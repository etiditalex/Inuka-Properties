import { createClient } from "@supabase/supabase-js";
import type { Property } from "@/lib/supabase/types";
import { STATIC_PROPERTY_CATALOG, type CatalogProperty } from "./catalog";
import { PROPERTY_DETAILS } from "./detailFallback";
import { mapDbPropertyToDetail, type PropertyDetail } from "./mapProperty";
import { parseGalleryUrls } from "@/lib/images";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function getStaticCatalog(): CatalogProperty[] {
  return STATIC_PROPERTY_CATALOG;
}

export function getStaticPropertyDetail(id: number): PropertyDetail | null {
  const raw = PROPERTY_DETAILS[id];
  if (!raw) return null;
  return raw as PropertyDetail;
}

export async function fetchPublishedProperties(): Promise<CatalogProperty[]> {
  const supabase = getPublicClient();
  if (!supabase) return STATIC_PROPERTY_CATALOG;

  const { data } = await supabase
    .from("properties")
    .select("id, title, location, type, price, size, bedrooms, image, gallery, featured, status, features, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (!data?.length) return STATIC_PROPERTY_CATALOG;

  return data.map((p) => {
    const image = parseGalleryUrls(p.gallery, p.image)[0] ?? p.image;
    return {
      id: p.id,
      title: p.title,
      location: p.location,
      type: p.type,
      price: p.price,
      size: p.size,
      bedrooms: p.bedrooms ?? undefined,
      image,
      featured: p.featured,
      status: p.status as CatalogProperty["status"],
      features: (p.features as string[]) ?? [],
    };
  });
}

export async function fetchPropertyDetail(id: number): Promise<PropertyDetail | null> {
  const supabase = getPublicClient();
  if (supabase) {
    const { data } = await supabase.from("properties").select("*").eq("id", id).eq("published", true).single();
    if (data) return mapDbPropertyToDetail(data as Property);
  }
  return getStaticPropertyDetail(id);
}

export async function fetchFeaturedProperties(limit = 4): Promise<CatalogProperty[]> {
  const all = await fetchPublishedProperties();
  const featured = all.filter((p) => p.featured && p.status !== "sold");
  return (featured.length ? featured : all.filter((p) => p.status !== "sold")).slice(0, limit);
}

/** Latest published listings (newest first) for homepage and highlights */
export async function fetchLatestProperties(limit = 4): Promise<CatalogProperty[]> {
  const all = await fetchPublishedProperties();
  return all.filter((p) => p.status !== "sold").slice(0, limit);
}
