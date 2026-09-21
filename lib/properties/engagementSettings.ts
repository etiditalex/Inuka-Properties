import type { SupabaseClient } from "@supabase/supabase-js";
import { EMPTY_ENGAGEMENT, type PropertyEngagementStats } from "@/lib/properties/engagementTypes";

export const ENGAGEMENT_SETTINGS_KEY = "property_engagement";

type EngagementStore = {
  likes: Record<string, string[]>;
  ratings: Record<string, Record<string, number>>;
};

function emptyStore(): EngagementStore {
  return { likes: {}, ratings: {} };
}

function uniqueIds(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))];
}

function normalizeStore(value: unknown): EngagementStore {
  const raw = value && typeof value === "object" ? (value as Partial<EngagementStore>) : {};
  const likes: Record<string, string[]> = {};
  const ratings: Record<string, Record<string, number>> = {};

  if (raw.likes && typeof raw.likes === "object") {
    for (const [propertyId, visitors] of Object.entries(raw.likes)) {
      likes[propertyId] = uniqueIds(visitors);
    }
  }
  if (raw.ratings && typeof raw.ratings === "object") {
    for (const [propertyId, votes] of Object.entries(raw.ratings)) {
      if (!votes || typeof votes !== "object") continue;
      const next: Record<string, number> = {};
      for (const [visitorId, rating] of Object.entries(votes)) {
        const parsed = Number(rating);
        if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 5) {
          next[visitorId] = parsed;
        }
      }
      ratings[propertyId] = next;
    }
  }

  return { likes, ratings };
}

export function statsFromStore(
  store: EngagementStore,
  propertyId: number,
  visitorId: string | null
): PropertyEngagementStats {
  const key = String(propertyId);
  const likeVisitors = store.likes[key] || [];
  const ratingMap = store.ratings[key] || {};
  const ratingValues = Object.values(ratingMap);
  const ratingCount = ratingValues.length;
  const ratingSum = ratingValues.reduce((sum, rating) => sum + rating, 0);

  return {
    likeCount: likeVisitors.length,
    liked: Boolean(visitorId && likeVisitors.includes(visitorId)),
    ratingAvg: ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0,
    ratingCount,
    myRating: visitorId && typeof ratingMap[visitorId] === "number" ? ratingMap[visitorId] : null,
  };
}

export function emptyEngagementMap(ids: number[]): Record<number, PropertyEngagementStats> {
  return Object.fromEntries(ids.map((id) => [id, { ...EMPTY_ENGAGEMENT }]));
}

export async function readEngagementStore(supabase: SupabaseClient): Promise<{
  store: EngagementStore;
  updatedAt: string | null;
}> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value, updated_at")
    .eq("key", ENGAGEMENT_SETTINGS_KEY)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return {
    store: normalizeStore(data?.value),
    updatedAt: typeof data?.updated_at === "string" ? data.updated_at : null,
  };
}

export async function fetchEngagementFromSettings(
  supabase: SupabaseClient,
  ids: number[],
  visitorId: string | null
): Promise<Record<number, PropertyEngagementStats>> {
  const map = emptyEngagementMap(ids);
  try {
    const { store } = await readEngagementStore(supabase);
    for (const id of ids) {
      map[id] = statsFromStore(store, id, visitorId);
    }
    return map;
  } catch {
    return map;
  }
}

async function saveEngagementStore(
  supabase: SupabaseClient,
  store: EngagementStore,
  previousUpdatedAt: string | null
): Promise<boolean> {
  const stamp = new Date().toISOString();

  if (!previousUpdatedAt) {
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: ENGAGEMENT_SETTINGS_KEY,
        value: store,
        updated_at: stamp,
      },
      { onConflict: "key" }
    );
    if (error?.code === "23505") return false;
    if (error) throw new Error(error.message);
    return true;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update({
      value: store,
      updated_at: stamp,
    })
    .eq("key", ENGAGEMENT_SETTINGS_KEY)
    .eq("updated_at", previousUpdatedAt)
    .select("key")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data?.key);
}

export async function mutateEngagementStore(
  supabase: SupabaseClient,
  mutator: (store: EngagementStore) => void
): Promise<EngagementStore> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { store, updatedAt } = await readEngagementStore(supabase);
    mutator(store);
    const saved = await saveEngagementStore(supabase, store, updatedAt);
    if (saved) return store;
  }
  throw new Error("Could not save likes and ratings. Please try again.");
}

export function toggleLikeInStore(store: EngagementStore, propertyId: number, visitorId: string) {
  const key = String(propertyId);
  const current = uniqueIds(store.likes[key]);
  store.likes[key] = current.includes(visitorId)
    ? current.filter((id) => id !== visitorId)
    : [...current, visitorId];
}

export function setRatingInStore(
  store: EngagementStore,
  propertyId: number,
  visitorId: string,
  rating: number
) {
  const key = String(propertyId);
  store.ratings[key] = {
    ...(store.ratings[key] || {}),
    [visitorId]: rating,
  };
}
