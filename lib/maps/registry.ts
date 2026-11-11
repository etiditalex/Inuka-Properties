import { rubyHighwayDocument } from "@/lib/maps/rubyHighwayLayout";
import type { PlotMapDocument } from "@/lib/maps/types";

const SEEDS: PlotMapDocument[] = [rubyHighwayDocument()];

export function listPlotMapSeeds(): PlotMapDocument[] {
  return SEEDS.map((document) => structuredClone(document));
}

export function getPlotMapSeed(slug: string): PlotMapDocument | null {
  const found = SEEDS.find((document) => document.slug === slug);
  return found ? structuredClone(found) : null;
}

export function getPlotMapSeedByProperty(propertyId: number): PlotMapDocument | null {
  const found = SEEDS.find((document) => document.propertyId === propertyId);
  return found ? structuredClone(found) : null;
}

export function slugifyProjectName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
