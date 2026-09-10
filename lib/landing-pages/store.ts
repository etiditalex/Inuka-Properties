import type { SupabaseClient } from "@supabase/supabase-js";
import type { LandingPage, Property } from "@/lib/supabase/types";
import { createServiceClient } from "@/lib/supabase/service";
import { asStringList } from "./defaults";
import { isMissingLandingPagesTable } from "./setup";

const SETTINGS_KEY = "landing_pages_catalog";

type Catalog = {
  pages: LandingPage[];
  nextId: number;
};

export type LandingPageWithProperty = LandingPage & {
  properties?: Property | null;
};

function normalize(row: LandingPage): LandingPage {
  return {
    ...row,
    highlights: asStringList(row.highlights),
  };
}

function nowIso() {
  return new Date().toISOString();
}

function emptyCatalog(): Catalog {
  return { pages: [], nextId: 1 };
}

function getClient(explicit?: SupabaseClient | null) {
  return explicit || createServiceClient();
}

async function readCatalog(supabase: SupabaseClient): Promise<Catalog> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error || !data?.value || typeof data.value !== "object") {
    return emptyCatalog();
  }

  const value = data.value as Partial<Catalog>;
  const pages = Array.isArray(value.pages) ? value.pages.map(normalize) : [];
  const maxId = pages.reduce((max, page) => Math.max(max, Number(page.id) || 0), 0);
  return {
    pages,
    nextId: Math.max(Number(value.nextId) || 1, maxId + 1),
  };
}

async function writeCatalog(supabase: SupabaseClient, catalog: Catalog) {
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: SETTINGS_KEY,
      value: catalog,
    },
    { onConflict: "key" }
  );
  if (error) throw new Error(error.message);
}

async function attachProperty(
  supabase: SupabaseClient,
  page: LandingPage
): Promise<LandingPageWithProperty> {
  if (!page.property_id) return { ...normalize(page), properties: null };

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", page.property_id)
    .maybeSingle();

  if (error || !data) return { ...normalize(page), properties: null };
  return { ...normalize(page), properties: data as Property };
}

async function listFromTable(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingLandingPagesTable(error)) return null;
    throw new Error(error.message);
  }
  return ((data as LandingPage[]) || []).map(normalize);
}

export async function listLandingPages(client?: SupabaseClient | null): Promise<LandingPage[]> {
  const supabase = getClient(client);
  if (!supabase) return [];

  const fromTable = await listFromTable(supabase);
  if (fromTable) return fromTable;

  const catalog = await readCatalog(supabase);
  return [...catalog.pages].sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));
}

export async function getLandingPageById(
  id: number,
  client?: SupabaseClient | null
): Promise<LandingPage | null> {
  const supabase = getClient(client);
  if (!supabase || !id) return null;

  const { data, error } = await supabase.from("landing_pages").select("*").eq("id", id).maybeSingle();
  if (!error && data) return normalize(data as LandingPage);
  if (error && !isMissingLandingPagesTable(error)) throw new Error(error.message);

  const catalog = await readCatalog(supabase);
  return catalog.pages.find((page) => page.id === id) ?? null;
}

export async function getPublishedLandingPageBySlug(slug: string): Promise<LandingPageWithProperty | null> {
  const supabase = getClient();
  if (!supabase || !slug) return null;

  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!error && data) {
    return attachProperty(supabase, data as LandingPage);
  }
  if (error && !isMissingLandingPagesTable(error)) return null;

  const catalog = await readCatalog(supabase);
  const page = catalog.pages.find((item) => item.slug === slug && item.published);
  if (!page) return null;
  return attachProperty(supabase, page);
}

export async function saveLandingPage(
  payload: Omit<LandingPage, "id" | "created_at" | "updated_at"> & Partial<Pick<LandingPage, "id">>,
  id?: number,
  client?: SupabaseClient | null
): Promise<LandingPage> {
  const supabase = getClient(client);
  if (!supabase) throw new Error("Database is not configured.");

  const record = {
    ...payload,
    highlights: asStringList(payload.highlights),
    updated_at: nowIso(),
  };

  if (id) {
    const { data, error } = await supabase
      .from("landing_pages")
      .update(record)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (!error && data) return normalize(data as LandingPage);
    if (error && !isMissingLandingPagesTable(error) && !error.message.toLowerCase().includes("channel")) {
      throw new Error(error.message);
    }
  } else {
    const { data, error } = await supabase.from("landing_pages").insert(record).select("*").maybeSingle();
    if (!error && data) return normalize(data as LandingPage);
    if (error && !isMissingLandingPagesTable(error) && !error.message.toLowerCase().includes("channel")) {
      throw new Error(error.message);
    }
  }

  const catalog = await readCatalog(supabase);
  const stamp = nowIso();

  if (id) {
    const index = catalog.pages.findIndex((page) => page.id === id);
    if (index === -1) throw new Error("Landing page not found.");
    const updated: LandingPage = {
      ...catalog.pages[index],
      ...record,
      id,
      created_at: catalog.pages[index].created_at,
      updated_at: stamp,
    };
    catalog.pages[index] = updated;
    await writeCatalog(supabase, catalog);
    return normalize(updated);
  }

  const created: LandingPage = {
    ...(record as LandingPage),
    id: catalog.nextId,
    created_at: stamp,
    updated_at: stamp,
  };
  catalog.pages.unshift(created);
  catalog.nextId += 1;
  await writeCatalog(supabase, catalog);
  return normalize(created);
}

export async function deleteLandingPage(id: number, client?: SupabaseClient | null): Promise<void> {
  const supabase = getClient(client);
  if (!supabase) throw new Error("Database is not configured.");

  const { error } = await supabase.from("landing_pages").delete().eq("id", id);
  if (!error) return;
  if (!isMissingLandingPagesTable(error)) throw new Error(error.message);

  const catalog = await readCatalog(supabase);
  catalog.pages = catalog.pages.filter((page) => page.id !== id);
  await writeCatalog(supabase, catalog);
}
