"use client";

import { useEffect, useRef, useState } from "react";
import type { LatLngExpression, LayerGroup, Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

export const KILIFI_CENTER: [number, number] = [-3.63, 39.85];

export type AdminMapMarker = {
  id: string | number;
  lat: number;
  lng: number;
  label?: string;
  href?: string;
};

type AdminLeafletMapProps = {
  heightClass?: string;
  markers?: AdminMapMarker[];
  selected?: { lat: number; lng: number } | null;
  clickToPin?: boolean;
  onPin?: (coords: { lat: number; lng: number }) => void;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function AdminLeafletMap({
  heightClass = "h-80",
  markers = [],
  selected = null,
  clickToPin = false,
  onPin,
}: AdminLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const pinRef = useRef<LeafletMarker | null>(null);
  const onPinRef = useRef(onPin);
  const [ready, setReady] = useState(false);
  onPinRef.current = onPin;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      // Next.js bundling breaks Leaflet's default icon URL resolution.
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
        KILIFI_CENTER,
        9
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      if (clickToPin) {
        map.on("click", (event) => {
          const { lat, lng } = event.latlng;
          onPinRef.current?.({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
        });
      }

      map.invalidateSize();
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      pinRef.current = null;
      setReady(false);
    };
  }, [clickToPin]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !map || !layer) return;

    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      layer.clearLayers();
      const points: LatLngExpression[] = [];

      markers.forEach((marker) => {
        const pin = L.marker([marker.lat, marker.lng]);
        if (marker.label) {
          const body = marker.href
            ? `<strong>${escapeHtml(marker.label)}</strong><br/><a href="${escapeHtml(marker.href)}">Edit listing</a>`
            : `<strong>${escapeHtml(marker.label)}</strong>`;
          pin.bindPopup(body);
        }
        pin.addTo(layer);
        points.push([marker.lat, marker.lng]);
      });

      if (selected) {
        if (pinRef.current) {
          pinRef.current.setLatLng([selected.lat, selected.lng]);
          if (!map.hasLayer(pinRef.current)) pinRef.current.addTo(map);
        } else {
          pinRef.current = L.marker([selected.lat, selected.lng], {
            draggable: clickToPin,
          }).addTo(map);
          if (clickToPin) {
            pinRef.current.on("dragend", () => {
              const latlng = pinRef.current?.getLatLng();
              if (!latlng) return;
              onPinRef.current?.({
                lat: Number(latlng.lat.toFixed(6)),
                lng: Number(latlng.lng.toFixed(6)),
              });
            });
          }
        }
        points.push([selected.lat, selected.lng]);
      } else if (pinRef.current) {
        pinRef.current.remove();
        pinRef.current = null;
      }

      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 14 });
      } else if (points.length === 1) {
        map.setView(points[0], 14);
      } else {
        map.setView(KILIFI_CENTER, 9);
      }

      setTimeout(() => map.invalidateSize(), 80);
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, markers, selected, clickToPin]);

  return (
    <div className={`admin-leaflet-map relative overflow-hidden rounded-xl border border-dark-200 bg-dark-50 ${heightClass}`}>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
