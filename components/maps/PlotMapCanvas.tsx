"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  FullscreenControl,
  GeoJSONSource,
  LngLatBounds,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
  setWorkerUrl,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PLOT_LINE, PLOT_STYLE, SELECTED_LINE } from "@/lib/maps/colors";
import { closeRing, nearestOtherVertex, openRing } from "@/lib/maps/geometry";
import { displayToMetres, metresToDisplay } from "@/lib/maps/georef";
import type { MapCrs, MapPlot, MapRoad, PlotStatus, Position } from "@/lib/maps/types";

export type PlotMapMarker = { id: string; position: Position; label: string };

export type PlotMapHandle = {
  finishDraw: () => Position[] | null;
  cancelDraw: () => void;
  fit: (plotNumber?: string) => void;
};

type PlotMapCanvasProps = {
  plots: MapPlot[];
  roads: MapRoad[];
  boundary?: Position[] | null;
  crs: MapCrs;
  satellite: boolean;
  selected: string | null;
  hiddenStatuses?: PlotStatus[];
  onSelect?: (plotNumber: string | null) => void;
  editVertices?: boolean;
  onRingChange?: (plotNumber: string, ring: Position[]) => void;
  draw?: boolean;
  onDraftChange?: (ring: Position[]) => void;
  onDrawComplete?: (ring: Position[]) => void;
  clickMode?: "select" | "place";
  onMapClick?: (position: Position) => void;
  onMarkerDrag?: (id: string, position: Position) => void;
  onMarkerDragEnd?: (id: string, position: Position) => void;
  markers?: PlotMapMarker[];
  initialCenter?: Position | null;
  cooperativeGestures?: boolean;
  className?: string;
};

function project(position: Position, crs: MapCrs): [number, number] {
  return crs === "EPSG:4326" ? position : metresToDisplay(position[0], position[1]);
}

/** Short diagonal marks at the boundary corners, so the ground inside each plot stays visible. */
function cornerTicks(ring: Position[], crs: MapCrs) {
  const open = openRing(ring);
  if (open.length < 3) return [];
  const metres = 6;
  return open.flatMap((point) => {
    const east = crs === "EPSG:4326" ? metres / (111320 * Math.cos((point[1] * Math.PI) / 180)) : metres;
    const north = crs === "EPSG:4326" ? metres / 110540 : metres;
    const here = project(point, crs);
    const diagonal = (x: number, y: number): [number, number] => project([point[0] + x, point[1] + y], crs);
    return [
      {
        type: "Feature" as const,
        properties: {},
        geometry: { type: "LineString" as const, coordinates: [diagonal(-east, -north), here, diagonal(east, north)] },
      },
      {
        type: "Feature" as const,
        properties: {},
        geometry: { type: "LineString" as const, coordinates: [diagonal(-east, north), here, diagonal(east, -north)] },
      },
    ];
  });
}

function unproject(lng: number, lat: number, crs: MapCrs): Position {
  return crs === "EPSG:4326" ? [lng, lat] : displayToMetres(lng, lat);
}

function asPolygon(ring: Position[], crs: MapCrs) {
  return {
    type: "Polygon" as const,
    coordinates: [closeRing(ring).map((point) => project(point, crs))],
  };
}

function mapStyle(satellite: boolean): StyleSpecification {
  const glyphs = "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf";
  if (!satellite) {
    return {
      version: 8,
      glyphs,
      sources: {},
      layers: [{ id: "background", type: "background", paint: { "background-color": "#e7e0d4" } }],
    };
  }
  return {
    version: 8,
    glyphs,
    sources: {
      satellite: {
        type: "raster",
        tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
        tileSize: 256,
        maxzoom: 19,
        attribution: "Tiles © Esri",
      },
    },
    layers: [{ id: "satellite", type: "raster", source: "satellite" }],
  };
}

function emptyCollection() {
  return { type: "FeatureCollection" as const, features: [] };
}

const PlotMapCanvas = forwardRef<PlotMapHandle, PlotMapCanvasProps>(function PlotMapCanvas(props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const propsRef = useRef(props);
  const draftRef = useRef<Position[]>([]);
  propsRef.current = props;

  const fitMap = (map: MapLibreMap, plotNumber?: string) => {
    const current = propsRef.current;
    const chosen = plotNumber ? current.plots.filter((plot) => plot.plotNumber === plotNumber) : current.plots;
    const rings = [
      ...chosen.map((plot) => plot.ring),
      ...(plotNumber ? [] : current.roads.map((road) => road.ring)),
      ...(plotNumber || !current.boundary ? [] : [current.boundary]),
    ];
    const bounds = new LngLatBounds();
    rings.forEach((ring) => {
      openRing(ring).forEach((point) => bounds.extend(project(point, current.crs)));
    });
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 36, maxZoom: current.satellite ? 19 : 18, animate: false });
      if (!current.satellite) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const dx = Math.max(ne.lng - sw.lng, 0.0001) * 0.8;
        const dy = Math.max(ne.lat - sw.lat, 0.0001) * 0.8;
        map.setMaxBounds(new LngLatBounds([sw.lng - dx, sw.lat - dy], [ne.lng + dx, ne.lat + dy]));
      }
      return;
    }
    if (current.initialCenter) {
      map.jumpTo({ center: project(current.initialCenter, current.crs), zoom: 17 });
    }
  };

  const sync = (map: MapLibreMap) => {
    const current = propsRef.current;
    const hidden = new Set(current.hiddenStatuses ?? []);
    const plots = current.plots.filter((plot) => !hidden.has(plot.status));
    const plotSource = map.getSource("plots") as GeoJSONSource | undefined;
    plotSource?.setData({
      type: "FeatureCollection",
      features: plots.map((plot) => ({
        type: "Feature",
        id: plot.plotNumber,
        properties: { plotNumber: plot.plotNumber, status: plot.status },
        geometry: asPolygon(plot.ring, current.crs),
      })),
    });
    const roadSource = map.getSource("roads") as GeoJSONSource | undefined;
    roadSource?.setData({
      type: "FeatureCollection",
      features: current.roads.map((road) => ({
        type: "Feature",
        properties: { name: road.name },
        geometry: asPolygon(road.ring, current.crs),
      })),
    });
    const tickSource = map.getSource("corner-ticks") as GeoJSONSource | undefined;
    tickSource?.setData(
      current.satellite && current.boundary
        ? { type: "FeatureCollection", features: cornerTicks(current.boundary, current.crs) }
        : emptyCollection()
    );
    const boundarySource = map.getSource("boundary") as GeoJSONSource | undefined;
    boundarySource?.setData(
      current.boundary
        ? {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: closeRing(current.boundary).map((point) => project(point, current.crs)) },
              },
            ],
          }
        : emptyCollection()
    );
    const selected = plots.find((plot) => plot.plotNumber === current.selected);
    const vertexSource = map.getSource("vertices") as GeoJSONSource | undefined;
    vertexSource?.setData(
      current.editVertices && selected
        ? {
            type: "FeatureCollection",
            features: openRing(selected.ring).map((point, index) => ({
              type: "Feature",
              properties: { index },
              geometry: { type: "Point", coordinates: project(point, current.crs) },
            })),
          }
        : emptyCollection()
    );
    const markerSource = map.getSource("markers") as GeoJSONSource | undefined;
    markerSource?.setData({
      type: "FeatureCollection",
      features: (current.markers ?? []).map((marker) => ({
        type: "Feature",
        properties: { id: marker.id, label: marker.label },
        geometry: { type: "Point", coordinates: project(marker.position, current.crs) },
      })),
    });
    const draftSource = map.getSource("draft") as GeoJSONSource | undefined;
    const draft = draftRef.current;
    draftSource?.setData(
      draft.length
        ? {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: draft.map((point) => project(point, current.crs)),
                },
              },
            ],
          }
        : emptyCollection()
    );
    plots.forEach((plot) => {
      try {
        map.setFeatureState({ source: "plots", id: plot.plotNumber }, { selected: plot.plotNumber === current.selected });
      } catch {
        // Feature state is optional until the source has indexed the plot.
      }
    });
  };

  useImperativeHandle(ref, () => ({
    finishDraw: () => {
      const ring = openRing(draftRef.current);
      if (ring.length < 3) return null;
      draftRef.current = [];
      propsRef.current.onDraftChange?.([]);
      const map = mapRef.current;
      if (map) sync(map);
      return ring;
    },
    cancelDraw: () => {
      draftRef.current = [];
      propsRef.current.onDraftChange?.([]);
      const map = mapRef.current;
      if (map) sync(map);
    },
    fit: (plotNumber?: string) => {
      const map = mapRef.current;
      if (map) fitMap(map, plotNumber);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const current = propsRef.current;
    // The bundled worker URL does not resolve under Next.js.
    setWorkerUrl("/maps/maplibre-gl-worker.mjs");
    const map = new MapLibreMap({
      container,
      style: mapStyle(current.satellite),
      center: current.initialCenter ? project(current.initialCenter, current.crs) : [0, 0],
      zoom: current.satellite ? 16 : 14,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      cooperativeGestures: current.cooperativeGestures ?? false,
      maxZoom: 20,
    });
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new FullscreenControl(), "top-right");
    map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");

    let hovered: string | number | null = null;
    let dragging: number | null = null;
    let draggingMarker: string | null = null;
    let ignoreNextClick = false;
    let dragRing: Position[] | null = null;

    map.on("load", () => {
      map.addSource("roads", { type: "geojson", data: emptyCollection() });
      map.addSource("plots", { type: "geojson", data: emptyCollection(), promoteId: "plotNumber" });
      map.addSource("boundary", { type: "geojson", data: emptyCollection() });
      map.addSource("vertices", { type: "geojson", data: emptyCollection() });
      map.addSource("markers", { type: "geojson", data: emptyCollection() });
      map.addSource("draft", { type: "geojson", data: emptyCollection() });
      map.addSource("corner-ticks", { type: "geojson", data: emptyCollection() });
      map.addLayer({
        id: "roads-fill",
        type: "fill",
        source: "roads",
        paint: { "fill-color": "#f7f1e4", "fill-opacity": current.satellite ? 0 : 0.94 },
      });
      map.addLayer({
        id: "roads-line",
        type: "line",
        source: "roads",
        paint: { "line-color": "#3f3a34", "line-width": 1.25 },
      });
      map.addLayer({
        id: "plots-fill",
        type: "fill",
        source: "plots",
        paint: {
          "fill-color": [
            "match",
            ["get", "status"],
            "available",
            PLOT_STYLE.available.fill,
            "reserved",
            PLOT_STYLE.reserved.fill,
            "sold",
            PLOT_STYLE.sold.fill,
            "on_hold",
            PLOT_STYLE.on_hold.fill,
            PLOT_STYLE.available.fill,
          ],
          "fill-opacity": current.satellite
            ? ["case", ["boolean", ["feature-state", "selected"], false], 0.18, ["boolean", ["feature-state", "hover"], false], 0.08, 0]
            : [
                "match",
                ["get", "status"],
                "available",
                PLOT_STYLE.available.opacity,
                "reserved",
                PLOT_STYLE.reserved.opacity,
                "sold",
                PLOT_STYLE.sold.opacity,
                "on_hold",
                PLOT_STYLE.on_hold.opacity,
                0.65,
              ],
        },
      });
      map.addLayer({
        id: "plots-line",
        type: "line",
        source: "plots",
        paint: {
          "line-color": current.satellite
            ? [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                SELECTED_LINE,
                [
                  "match",
                  ["get", "status"],
                  "available",
                  PLOT_STYLE.available.fill,
                  "reserved",
                  PLOT_STYLE.reserved.fill,
                  "sold",
                  PLOT_STYLE.sold.fill,
                  "on_hold",
                  PLOT_STYLE.on_hold.fill,
                  PLOT_LINE,
                ],
              ]
            : ["case", ["boolean", ["feature-state", "selected"], false], SELECTED_LINE, PLOT_LINE],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            3.2,
            ["boolean", ["feature-state", "hover"], false],
            2.4,
            1.5,
          ],
        },
      });
      map.addLayer({
        id: "boundary-line",
        type: "line",
        source: "boundary",
        paint: {
          "line-color": "#111827",
          "line-width": current.satellite ? 2.4 : 2,
          "line-dasharray": current.satellite ? [1.2, 0.8] : [2, 1.2],
        },
      });
      map.addLayer({
        id: "corner-ticks",
        type: "line",
        source: "corner-ticks",
        paint: { "line-color": "#111827", "line-width": 2 },
      });
      map.addLayer({
        id: "draft-line",
        type: "line",
        source: "draft",
        paint: { "line-color": "#0369a1", "line-width": 2 },
      });
      map.addLayer({
        id: "labels",
        type: "symbol",
        source: "plots",
        layout: {
          "text-field": ["get", "plotNumber"],
          "text-font": ["Open Sans Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 14, 0, 16, 11, 19, 15],
          "text-allow-overlap": true,
        },
        paint: { "text-color": "#ffffff", "text-halo-color": "#1a1a1a", "text-halo-width": 1.15 },
      });
      map.addLayer({
        id: "vertices",
        type: "circle",
        source: "vertices",
        paint: { "circle-radius": 5, "circle-color": "#ffffff", "circle-stroke-color": "#111827", "circle-stroke-width": 2 },
      });
      map.addLayer({
        id: "marker-points",
        type: "circle",
        source: "markers",
        paint: { "circle-radius": 6, "circle-color": "#0369a1", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 },
      });
      mapRef.current = map;
      sync(map);
      fitMap(map);

    map.on("mouseenter", "marker-points", () => {
      if (propsRef.current.onMarkerDrag) map.getCanvas().style.cursor = "grab";
    });
    map.on("mouseleave", "marker-points", () => {
      if (draggingMarker == null) map.getCanvas().style.cursor = "";
    });
    map.on("click", (event) => {
      if (ignoreNextClick) {
        ignoreNextClick = false;
        return;
      }
      const latest = propsRef.current;
      const position = unproject(event.lngLat.lng, event.lngLat.lat, latest.crs);
      if (latest.draw) {
        const draft = draftRef.current;
        const first = draft[0];
        const closeDistance = latest.crs === "EPSG:4326" ? 0.00003 : 1.5;
        if (draft.length >= 3 && first && Math.hypot(position[0] - first[0], position[1] - first[1]) <= closeDistance) {
          const finished = openRing(draft);
          draftRef.current = [];
          latest.onDraftChange?.([]);
          sync(map);
          latest.onDrawComplete?.(finished);
          return;
        }
        draftRef.current = [...draft, position];
        latest.onDraftChange?.(draftRef.current);
        sync(map);
        return;
      }
      if (latest.clickMode === "place") {
        latest.onMapClick?.(position);
        return;
      }
      const hits = map.queryRenderedFeatures(event.point, { layers: ["plots-fill"] });
      const number = hits[0]?.properties?.plotNumber;
      latest.onSelect?.(number != null ? String(number) : null);
    });

    map.on("mousemove", "plots-fill", (event) => {
      map.getCanvas().style.cursor = "pointer";
      const id = event.features?.[0]?.id;
      if (id == null) return;
      if (hovered != null && hovered !== id) map.setFeatureState({ source: "plots", id: hovered }, { hover: false });
      hovered = id;
      map.setFeatureState({ source: "plots", id }, { hover: true });
    });
    map.on("mouseleave", "plots-fill", () => {
      if (hovered != null) map.setFeatureState({ source: "plots", id: hovered }, { hover: false });
      hovered = null;
      if (dragging == null) map.getCanvas().style.cursor = "";
    });
    map.on("mousedown", "vertices", (event) => {
      event.preventDefault();
      const index = Number(event.features?.[0]?.properties?.index);
      const latest = propsRef.current;
      const plot = latest.plots.find((item) => item.plotNumber === latest.selected);
      if (!plot || !Number.isInteger(index)) return;
      dragging = index;
      dragRing = openRing(plot.ring);
      map.dragPan.disable();
      map.getCanvas().style.cursor = "grabbing";
    });
    map.on("mousedown", "marker-points", (event) => {
      const latest = propsRef.current;
      if (!latest.onMarkerDrag) return;
      event.preventDefault();
      const id = event.features?.[0]?.properties?.id;
      if (!id) return;
      draggingMarker = String(id);
      ignoreNextClick = true;
      map.dragPan.disable();
      map.getCanvas().style.cursor = "grabbing";
      latest.onMarkerDrag(draggingMarker, unproject(event.lngLat.lng, event.lngLat.lat, latest.crs));
    });
    map.on("mousemove", (event) => {
      const latest = propsRef.current;
      if (draggingMarker) {
        latest.onMarkerDrag?.(draggingMarker, unproject(event.lngLat.lng, event.lngLat.lat, latest.crs));
        return;
      }
      if (dragging == null || !dragRing) return;
      dragRing[dragging] = unproject(event.lngLat.lng, event.lngLat.lat, latest.crs);
      syncDuringDrag(map, dragRing, latest.selected, latest.crs, latest);
    });
    map.on("mouseup", (event) => {
      if (draggingMarker) {
        const latest = propsRef.current;
        const id = draggingMarker;
        const position = unproject(event.lngLat.lng, event.lngLat.lat, latest.crs);
        draggingMarker = null;
        map.dragPan.enable();
        map.getCanvas().style.cursor = "";
        latest.onMarkerDragEnd?.(id, position);
        return;
      }
      if (dragging == null || !dragRing) return;
      const latest = propsRef.current;
      const index = dragging;
      const plotNumber = latest.selected;
      map.dragPan.enable();
      map.getCanvas().style.cursor = "";
      dragging = null;
      if (!plotNumber) {
        dragRing = null;
        return;
      }
      let next = dragRing.slice();
      const snapDistance = latest.crs === "EPSG:4326" ? 0.00002 : 1.25;
      const snapped = nearestOtherVertex(
        next[index],
        latest.plots.map((plot) => ({ plotNumber: plot.plotNumber, ring: plot.ring })),
        { plotNumber, index },
        snapDistance
      );
      if (snapped) next[index] = snapped;
      dragRing = null;
      latest.onRingChange?.(plotNumber, next);
    });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The map is rebuilt when the basemap or coordinate system changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.satellite, props.crs]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    sync(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.plots, props.roads, props.boundary, props.selected, props.hiddenStatuses, props.editVertices, props.markers, props.crs]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (props.draw) map.doubleClickZoom.disable();
    else map.doubleClickZoom.enable();
  }, [props.draw]);

  return (
    <div className={props.className ?? "h-full w-full"}>
      <style>{`.plot-map-canvas img{max-width:none !important;}`}</style>
      <div ref={containerRef} className="plot-map-canvas h-full w-full" />
    </div>
  );
});

function syncDuringDrag(
  map: MapLibreMap,
  ring: Position[],
  plotNumber: string | null,
  crs: MapCrs,
  current: PlotMapCanvasProps
) {
  if (!plotNumber) return;
  const hidden = new Set(current.hiddenStatuses ?? []);
  const plotSource = map.getSource("plots") as GeoJSONSource | undefined;
  plotSource?.setData({
    type: "FeatureCollection",
    features: current.plots
      .filter((plot) => !hidden.has(plot.status))
      .map((plot) => ({
        type: "Feature" as const,
        id: plot.plotNumber,
        properties: { plotNumber: plot.plotNumber, status: plot.status },
        geometry: asPolygon(plot.plotNumber === plotNumber ? ring : plot.ring, crs),
      })),
  });
  const vertexSource = map.getSource("vertices") as GeoJSONSource | undefined;
  vertexSource?.setData({
    type: "FeatureCollection",
    features: ring.map((point, index) => ({
      type: "Feature" as const,
      properties: { index },
      geometry: { type: "Point" as const, coordinates: project(point, crs) },
    })),
  });
}

export default PlotMapCanvas;
