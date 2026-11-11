import { ensureCounterClockwise, ringArea } from "@/lib/maps/geometry";
import { toEnu } from "@/lib/maps/georef";
import type { MapCrs, MapPlot, PlotStatus, Position } from "@/lib/maps/types";

type ParsedImport = {
  crs: MapCrs;
  plots: MapPlot[];
};

const STATUS_ALIASES: Record<string, PlotStatus> = {
  available: "available",
  reserved: "reserved",
  sold: "sold",
  on_hold: "on_hold",
  onhold: "on_hold",
  hold: "on_hold",
  "on hold": "on_hold",
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readStatus(value: unknown): PlotStatus {
  const key = String(value ?? "available").trim().toLowerCase();
  return STATUS_ALIASES[key] ?? "available";
}

function readPlotNumber(properties: Record<string, unknown>, fallback: number): string {
  const raw =
    properties.plotNumber ??
    properties.plot_number ??
    properties.plot ??
    properties.number ??
    properties.name ??
    properties.id ??
    fallback;
  const text = String(raw).trim();
  return text || String(fallback);
}

function geographicArea(ring: Position[]): number {
  if (ring.length < 3) return 0;
  const origin = ring[0];
  return ringArea(ring.map((point) => toEnu(point, origin)));
}

function classify(rings: Position[][]): MapCrs {
  const coords = rings.flat();
  if (coords.some(([x, y]) => Math.abs(x) > 180 || Math.abs(y) > 90)) {
    throw new Error(
      "These coordinates are not longitude and latitude. In QGIS, set the layer to WGS 84 (EPSG:4326) and export GeoJSON again."
    );
  }
  const xs = coords.map(([x]) => x);
  const ys = coords.map(([, y]) => y);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const farFromOrigin = Math.max(...xs.map(Math.abs), ...ys.map(Math.abs)) > 20;
  return span < 2 && farFromOrigin ? "EPSG:4326" : "local-metres";
}

function plotFromRing(ring: Position[], properties: Record<string, unknown>, index: number, crs: MapCrs): MapPlot {
  const cleaned = ensureCounterClockwise(ring.filter((point, pointIndex, points) => {
    if (pointIndex === 0) return true;
    const previous = points[pointIndex - 1];
    return point[0] !== previous[0] || point[1] !== previous[1];
  }));
  if (cleaned.length < 3) {
    throw new Error(`Plot ${index + 1} needs at least three corners.`);
  }
  const area = crs === "EPSG:4326" ? geographicArea(cleaned) : ringArea(cleaned);
  return {
    plotNumber: readPlotNumber(properties, index + 1),
    status: readStatus(properties.status),
    areaM2: Math.round(area * 10) / 10,
    frontageM: readNumber(properties.frontageM ?? properties.frontage_m ?? properties.frontage),
    depthM: readNumber(properties.depthM ?? properties.depth_m ?? properties.depth),
    priceKes: readNumber(properties.priceKes ?? properties.price_kes ?? properties.price),
    depositKes: readNumber(properties.depositKes ?? properties.deposit_kes ?? properties.deposit),
    paymentPeriod:
      typeof (properties.paymentPeriod ?? properties.payment_period) === "string"
        ? String(properties.paymentPeriod ?? properties.payment_period)
        : null,
    ring: cleaned,
    planRing: crs === "local-metres" ? cleaned : null,
    dimensionNote: null,
  };
}

function ringsFromGeometry(geometry: unknown): Position[][] {
  const record = asRecord(geometry);
  const type = record.type;
  const coordinates = record.coordinates;
  if (type === "Polygon" && Array.isArray(coordinates)) {
    return [asPositions(coordinates[0])];
  }
  if (type === "MultiPolygon" && Array.isArray(coordinates)) {
    return coordinates.map((polygon) => asPositions(Array.isArray(polygon) ? polygon[0] : []));
  }
  return [];
}

function asPositions(value: unknown): Position[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((pair) => {
      if (!Array.isArray(pair) || pair.length < 2) return null;
      const x = Number(pair[0]);
      const y = Number(pair[1]);
      return Number.isFinite(x) && Number.isFinite(y) ? ([x, y] as Position) : null;
    })
    .filter((point): point is Position => point !== null);
}

function featuresFromGeoJson(parsed: unknown): { geometry: unknown; properties: Record<string, unknown> }[] {
  const record = asRecord(parsed);
  if (record.type === "FeatureCollection" && Array.isArray(record.features)) {
    return record.features.map((feature) => {
      const item = asRecord(feature);
      return { geometry: item.geometry, properties: asRecord(item.properties) };
    });
  }
  if (record.type === "Feature") {
    return [{ geometry: record.geometry, properties: asRecord(record.properties) }];
  }
  if (record.type === "Polygon" || record.type === "MultiPolygon") {
    return [{ geometry: record, properties: {} }];
  }
  throw new Error("The file needs a GeoJSON FeatureCollection of polygons.");
}

export function parseGeoJson(text: string): ParsedImport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  const features = featuresFromGeoJson(parsed);
  const rings = features.flatMap((feature) => ringsFromGeometry(feature.geometry)).filter((ring) => ring.length >= 3);
  if (rings.length === 0) throw new Error("No plot polygons were found in that file.");
  const crs = classify(rings);
  let index = 0;
  const plots = features.flatMap((feature) =>
    ringsFromGeometry(feature.geometry)
      .filter((ring) => ring.length >= 3)
      .map((ring) => plotFromRing(ring, feature.properties, index++, crs))
  );
  const numbers = new Set<string>();
  plots.forEach((plot) => {
    if (numbers.has(plot.plotNumber)) {
      throw new Error(`Plot ${plot.plotNumber} appears more than once.`);
    }
    numbers.add(plot.plotNumber);
  });
  return { crs, plots };
}

export function parseKml(text: string): ParsedImport {
  const blocks = text.match(/<Placemark[\s\S]*?<\/Placemark>/gi) ?? [];
  const found: { name: string; ring: Position[] }[] = [];
  blocks.forEach((block) => {
    const name = (block.match(/<name>([^<]*)<\/name>/i)?.[1] ?? "").trim();
    const coordinates = block.match(/<coordinates>([\s\S]*?)<\/coordinates>/gi) ?? [];
    coordinates.forEach((node) => {
      const body = node.replace(/<\/?coordinates>/gi, "").trim();
      const ring = body
        .split(/\s+/)
        .map((token) => {
          const [lng, lat] = token.split(",").map(Number);
          return Number.isFinite(lng) && Number.isFinite(lat) ? ([lng, lat] as Position) : null;
        })
        .filter((point): point is Position => point !== null);
      if (ring.length >= 3) found.push({ name, ring });
    });
  });
  if (found.length === 0) throw new Error("No polygons were found in that KML file.");
  classify(found.map((item) => item.ring));
  const plots = found.map((item, index) =>
    plotFromRing(item.ring, { plotNumber: item.name || String(index + 1) }, index, "EPSG:4326")
  );
  return { crs: "EPSG:4326", plots };
}
