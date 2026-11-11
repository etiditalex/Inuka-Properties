import { applySimilarity, residualMetres } from "@/lib/maps/georef";
import { findOverlaps } from "@/lib/maps/geometry";
import type { PlotMapDocument } from "@/lib/maps/types";

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

/** Move sheet polygons onto the ground points the administrator confirmed. */
export function bakeAlignment(document: PlotMapDocument): PlotMapDocument {
  const placed = document.controlPoints.filter((point) => point.ground);
  if (placed.length < 2 || !document.transform) {
    throw new Error("Place at least two sheet corners on the satellite image first.");
  }
  const [first, second, ...rest] = placed;
  const shift = residualMetres(document.transform, second.plan, second.ground!);
  if (shift > 1) {
    throw new Error("The two control points do not match the saved alignment. Preview the alignment again.");
  }
  const mismatch = rest
    .map((point) => ({
      label: point.label,
      metres: residualMetres(document.transform!, point.plan, point.ground!),
    }))
    .filter((item) => item.metres > 20);
  if (mismatch.length > 0) {
    const detail = mismatch.map((item) => `${item.label} is ${item.metres.toFixed(1)} m off`).join(". ");
    throw new Error(`The extra corners do not agree: ${detail}. Move them, or remove the ones you are not using.`);
  }
  const transform = document.transform!;
  const sheetBoundary = document.planBoundary ?? (document.crs === "local-metres" ? document.boundary : null);
  return {
    ...document,
    crs: "EPSG:4326",
    alignmentStatus: "verified",
    plots: document.plots.map((plot) => {
      const source = plot.planRing ?? (document.crs === "local-metres" ? plot.ring : null);
      if (!source) return plot;
      return { ...plot, planRing: source, ring: applySimilarity(transform, source) };
    }),
    planBoundary: sheetBoundary,
    boundary: sheetBoundary ? applySimilarity(transform, sheetBoundary) : document.boundary,
    roads: document.roads.map((road) => {
      const source = road.planRing ?? (document.crs === "local-metres" ? road.ring : null);
      if (!source) return road;
      return { ...road, planRing: source, ring: applySimilarity(transform, source) };
    }),
  };
}
