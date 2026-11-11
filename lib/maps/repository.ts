import { createServiceClient } from "@/lib/supabase/service";
import { bakeAlignment, validatePlotMap } from "@/lib/maps/publish";
import { getPlotMapSeed, getPlotMapSeedByProperty, listPlotMapSeeds, slugifyProjectName } from "@/lib/maps/registry";
import type { PlotMapDocument, PlotMapSummary } from "@/lib/maps/types";

export type LoadedPlotMap = {
  document: PlotMapDocument;
  source: "database" | "sheet";
  persisted: boolean;
};

function isMissingSchema(message: string, code?: string): boolean {
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    code === "PGRST202" ||
    /plot_maps|schema cache|does not exist|could not find the function/i.test(message)
  );
}

function asDocument(value: unknown): PlotMapDocument | null {
  if (!value || typeof value !== "object") return null;
  const document = value as PlotMapDocument;
  if (!document.slug || !Array.isArray(document.plots)) return null;
  return document;
}

async function readDatabaseDocument(slug: string): Promise<PlotMapDocument | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("plot_maps").select("document").eq("slug", slug).maybeSingle();
  if (error) {
    if (isMissingSchema(error.message, error.code)) return null;
    throw new Error(error.message);
  }
  return asDocument(data?.document);
}

async function readDatabaseByProperty(propertyId: number): Promise<PlotMapDocument | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("plot_maps")
    .select("document")
    .eq("property_id", propertyId)
    .maybeSingle();
  if (error) {
    if (isMissingSchema(error.message, error.code)) return null;
    throw new Error(error.message);
  }
  return asDocument(data?.document);
}

export async function loadPublishedPlotMap(slug: string): Promise<LoadedPlotMap | null> {
  const stored = await readDatabaseDocument(slug);
  if (stored) {
    if (!stored.published) return null;
    return { document: stored, source: "database", persisted: true };
  }
  const seed = getPlotMapSeed(slug);
  if (!seed?.published) return null;
  return { document: seed, source: "sheet", persisted: false };
}

export async function loadPublishedPlotMapByProperty(propertyId: number): Promise<LoadedPlotMap | null> {
  const stored = await readDatabaseByProperty(propertyId);
  if (stored) {
    if (!stored.published) return null;
    return { document: stored, source: "database", persisted: true };
  }
  const seed = getPlotMapSeedByProperty(propertyId);
  if (!seed?.published) return null;
  return { document: seed, source: "sheet", persisted: false };
}

export async function loadAdminPlotMap(slug: string): Promise<LoadedPlotMap | null> {
  const stored = await readDatabaseDocument(slug);
  if (stored) return { document: stored, source: "database", persisted: true };
  const seed = getPlotMapSeed(slug);
  if (!seed) return null;
  return { document: seed, source: "sheet", persisted: false };
}

export async function listAdminPlotMaps(): Promise<PlotMapSummary[]> {
  const bySlug = new Map<string, PlotMapSummary>();
  listPlotMapSeeds().forEach((document) => {
    bySlug.set(document.slug, summarize(document, "sheet"));
  });
  const supabase = createServiceClient();
  if (supabase) {
    const { data, error } = await supabase.from("plot_maps").select("document");
    if (error && !isMissingSchema(error.message, error.code)) throw new Error(error.message);
    (data ?? []).forEach((row) => {
      const document = asDocument(row.document);
      if (document) bySlug.set(document.slug, summarize(document, "database"));
    });
  }
  return Array.from(bySlug.values()).sort((a, b) => a.projectName.localeCompare(b.projectName));
}

function summarize(document: PlotMapDocument, source: "database" | "sheet"): PlotMapSummary {
  return {
    slug: document.slug,
    propertyId: document.propertyId,
    projectName: document.projectName,
    location: document.location,
    alignmentStatus: document.alignmentStatus,
    published: document.published,
    plotCount: document.plots.length,
    source,
  };
}

export async function savePlotMap(
  incoming: PlotMapDocument,
  actorId: string,
  confirmAlignment: boolean
): Promise<{ document: PlotMapDocument } | { error: string; migrationRequired?: boolean; status: number }> {
  let document = incoming;
  const placedCorners = document.controlPoints.filter((point) => point.ground).length;
  const updatePublicAlignment = confirmAlignment || (document.published && placedCorners >= 2);
  if (updatePublicAlignment) {
    try {
      document = bakeAlignment(document);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The alignment could not be saved.", status: 400 };
    }
  } else if (document.alignmentStatus === "verified") {
    const existing = await loadAdminPlotMap(document.slug);
    if (existing?.document.alignmentStatus !== "verified") {
      document = { ...document, alignmentStatus: document.transform ? "draft" : "unverified" };
    }
  }
  document = { ...document, updatedAt: new Date().toISOString() };
  const errors = validatePlotMap(document);
  if (errors.length > 0) return { error: errors.join(" "), status: 400 };

  const supabase = createServiceClient();
  if (!supabase) {
    return {
      error: "Supabase is not configured on this server, so the map cannot be stored yet.",
      migrationRequired: true,
      status: 503,
    };
  }

  const payload = { ...document, actorId };
  const rpc = await supabase.rpc("save_plot_map", { payload });
  if (!rpc.error) return { document };

  if (!isMissingSchema(rpc.error.message, rpc.error.code)) {
    return { error: rpc.error.message, status: 500 };
  }

  const upsert = await supabase.from("plot_maps").upsert(
    {
      slug: document.slug,
      property_id: document.propertyId,
      project_name: document.projectName,
      location: document.location,
      survey_ref: document.surveyRef,
      alignment_status: document.alignmentStatus,
      crs: document.crs,
      published: document.published,
      document,
      updated_at: document.updatedAt,
    },
    { onConflict: "slug" }
  );
  if (!upsert.error) return { document };
  if (isMissingSchema(upsert.error.message, upsert.error.code)) {
    return {
      error: "Run supabase/migrations/plot_maps.sql in the Supabase SQL editor, then save again.",
      migrationRequired: true,
      status: 503,
    };
  }
  return { error: upsert.error.message, status: 500 };
}

export function blankPlotMap(input: { propertyId: number; projectName: string; location: string }): PlotMapDocument {
  const slug = slugifyProjectName(input.projectName) || `project-${input.propertyId}`;
  return {
    slug,
    propertyId: input.propertyId,
    projectName: input.projectName.trim(),
    location: input.location.trim(),
    surveyRef: null,
    alignmentStatus: "unverified",
    crs: "EPSG:4326",
    published: false,
    geometrySource: "drawn",
    sheetImage: null,
    notes: [
      "No survey file has been imported. Draw the plots, or import a GeoJSON file that QGIS has saved in WGS 84 (EPSG:4326).",
      "The map stays off the public satellite view until the alignment is confirmed.",
    ],
    cameraHint: null,
    plots: [],
    roads: [],
    boundary: null,
    planBoundary: null,
    controlPoints: [],
    transform: null,
    updatedAt: null,
  };
}
