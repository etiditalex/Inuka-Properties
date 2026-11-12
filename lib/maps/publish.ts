import { applyGround, fitControlPoints, residualMetres } from "@/lib/maps/georef";
import { findOverlaps } from "@/lib/maps/geometry";
import type { PlotMapDocument, Position } from "@/lib/maps/types";

export function validatePlotMap(document: PlotMapDocument): string[] {
  const errors: string[] = [];
  if (!document.slug.trim()) errors.push("The map needs a name.");
  if (!document.propertyId) errors.push("Choose the land listing this map belongs to.");
  if (!document.projectName.trim()) errors.push("The project needs a name.");
  const seen = new Set<string>();
  document.plots.forEach((plot) => {
    const number = plot.plotNumber.trim();
    if (!number) errors.push("Every plot needs a number.");
    if (seen.has(number)) errors.push(`Plot ${number} is used more than once.`);
    seen.add(number);
  });
  errors.push(
    ...findOverlaps(
      document.plots.map((plot) => ({ plotNumber: plot.plotNumber, ring: plot.ring })),
      document.crs
    )
  );
  return errors;
}

function sheetRing(plan: Position[] | null, ring: Position[], crs: PlotMapDocument["crs"]): Position[] | null {
  return plan ?? (crs === "local-metres" ? ring : null);
}

/** True when the stored polygons already meet every clicked corner. */
export function placedCornersMatch(document: PlotMapDocument, limitMetres = 1): boolean {
  if (document.crs !== "EPSG:4326" || !document.transform) return false;
  const placed = document.controlPoints.filter((point) => point.ground);
  if (placed.length < 2) return false;
  return placed.every((point) => residualMetres(document.transform!, point.plan, point.ground!) <= limitMetres);
}

/**
 * Stretch the sheet so every placed corner lands on the satellite point.
 * Two corners keep one scale. Four corners fill the quadrilateral, so the
 * plotted block runs to each click instead of stopping short of it.
 */
export function projectSheet(document: PlotMapDocument): PlotMapDocument | null {
  const placed = document.controlPoints.filter((point) => point.ground);
  if (placed.length < 2) return null;
  const fit = fitControlPoints(placed.map((point) => ({ plan: point.plan, ground: point.ground! })));
  const sheetBoundary = document.planBoundary ?? (document.crs === "local-metres" ? document.boundary : null);
  return {
    ...document,
    crs: "EPSG:4326",
    transform: fit,
    plots: document.plots.map((plot) => {
      const source = sheetRing(plot.planRing, plot.ring, document.crs);
      if (!source) return plot;
      return { ...plot, planRing: source, ring: applyGround(fit, source) };
    }),
    planBoundary: sheetBoundary,
    boundary: sheetBoundary ? applyGround(fit, sheetBoundary) : document.boundary,
    roads: document.roads.map((road) => {
      const source = sheetRing(road.planRing, road.ring, document.crs);
      if (!source) return road;
      return { ...road, planRing: source, ring: applyGround(fit, source) };
    }),
  };
}

/** Move sheet polygons onto the ground points the administrator confirmed. */
export function bakeAlignment(document: PlotMapDocument): PlotMapDocument {
  const placed = document.controlPoints.filter((point) => point.ground);
  const projected = projectSheet(document);
  if (!projected || placed.length < 2) {
    throw new Error("Place at least two sheet corners on the satellite image first.");
  }
  const mismatch = placed
    .map((point) => ({
      label: point.label,
      metres: residualMetres(projected.transform!, point.plan, point.ground!),
    }))
    .filter((item) => item.metres > 1);
  if (mismatch.length > 0) {
    const detail = mismatch.map((item) => `${item.label} is ${item.metres.toFixed(1)} m off`).join(". ");
    throw new Error(`These corners do not meet the points you placed: ${detail}.`);
  }
  return { ...projected, alignmentStatus: "verified" };
}
