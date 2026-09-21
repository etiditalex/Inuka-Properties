import { createServiceClient } from "@/lib/supabase/service";
import {
  EMPTY_ENGAGEMENT,
  type PropertyEngagementStats,
} from "@/lib/properties/engagementTypes";
import {
  emptyEngagementMap,
  fetchEngagementFromSettings,
  mutateEngagementStore,
  setRatingInStore,
  statsFromStore,
  toggleLikeInStore,
} from "@/lib/properties/engagementSettings";

export {
  EMPTY_ENGAGEMENT,
  isValidVisitorId,
  parsePropertyId,
  parseRating,
  type PropertyEngagementStats,
} from "@/lib/properties/engagementTypes";

type RpcRow = {
  property_id: number;
  like_count: number | string | null;
  rating_avg: number | string | null;
  rating_count: number | string | null;
  liked: boolean | null;
  my_rating: number | null;
};

function isMissingEngagementRelation(error?: { message?: string; code?: string } | null) {
  const message = (error?.message || "").toLowerCase();
  const code = error?.code || "";
  return (
    code === "PGRST202" ||
    code === "PGRST205" ||
    code === "42P01" ||
    code === "42883" ||
    message.includes("schema cache") ||
    ((message.includes("property_likes") ||
      message.includes("property_ratings") ||
      message.includes("get_property_engagement")) &&
      (message.includes("does not exist") || message.includes("could not find")))
  );
}

function toStats(row: Partial<RpcRow> | undefined): PropertyEngagementStats {
  const avg = Number(row?.rating_avg ?? 0);
  return {
    likeCount: Number(row?.like_count ?? 0),
    liked: Boolean(row?.liked),
    ratingAvg: Number.isFinite(avg) ? Math.round(avg * 10) / 10 : 0,
    ratingCount: Number(row?.rating_count ?? 0),
    myRating: row?.my_rating ?? null,
  };
}

async function fetchEngagementFallback(
  ids: number[],
  visitorId: string | null
): Promise<Record<number, PropertyEngagementStats> | "missing" | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const [likesRes, ratingsRes, myLikesRes, myRatingsRes] = await Promise.all([
    supabase.from("property_likes").select("property_id").in("property_id", ids),
    supabase.from("property_ratings").select("property_id, rating").in("property_id", ids),
    visitorId
      ? supabase
          .from("property_likes")
          .select("property_id")
          .eq("visitor_id", visitorId)
          .in("property_id", ids)
      : Promise.resolve({ data: [] as { property_id: number }[], error: null }),
    visitorId
      ? supabase
          .from("property_ratings")
          .select("property_id, rating")
          .eq("visitor_id", visitorId)
          .in("property_id", ids)
      : Promise.resolve({ data: [] as { property_id: number; rating: number }[], error: null }),
  ]);

  if (
    isMissingEngagementRelation(likesRes.error) ||
    isMissingEngagementRelation(ratingsRes.error)
  ) {
    return "missing";
  }

  if (likesRes.error && ratingsRes.error) return null;

  const map = emptyEngagementMap(ids);
  const likeTotals = new Map<number, number>();
  const ratingTotals = new Map<number, { sum: number; count: number }>();

  for (const row of likesRes.data || []) {
    likeTotals.set(row.property_id, (likeTotals.get(row.property_id) || 0) + 1);
  }
  for (const row of ratingsRes.data || []) {
    const current = ratingTotals.get(row.property_id) || { sum: 0, count: 0 };
    current.sum += Number(row.rating) || 0;
    current.count += 1;
    ratingTotals.set(row.property_id, current);
  }

  for (const id of ids) {
    const rating = ratingTotals.get(id);
    map[id] = {
      likeCount: likeTotals.get(id) || 0,
      liked: false,
      ratingAvg: rating && rating.count > 0 ? Math.round((rating.sum / rating.count) * 10) / 10 : 0,
      ratingCount: rating?.count || 0,
      myRating: null,
    };
  }

  for (const row of myLikesRes.data || []) {
    if (map[row.property_id]) map[row.property_id].liked = true;
  }
  for (const row of myRatingsRes.data || []) {
    if (map[row.property_id]) map[row.property_id].myRating = row.rating;
  }

  return map;
}

export async function fetchEngagementMap(
  ids: number[],
  visitorId: string | null
): Promise<Record<number, PropertyEngagementStats>> {
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length === 0) return {};

  const supabase = createServiceClient();
  if (!supabase) return emptyEngagementMap(uniqueIds);

  const { data, error } = await supabase.rpc("get_property_engagement", {
    p_ids: uniqueIds,
    p_visitor: visitorId,
  });

  if (!error && Array.isArray(data)) {
    const map = emptyEngagementMap(uniqueIds);
    for (const row of data as RpcRow[]) {
      map[row.property_id] = toStats(row);
    }
    return map;
  }

  const fallback = await fetchEngagementFallback(uniqueIds, visitorId);
  if (fallback && fallback !== "missing") return fallback;

  return fetchEngagementFromSettings(supabase, uniqueIds, visitorId);
}

export async function fetchPropertyEngagement(
  propertyId: number,
  visitorId: string | null
): Promise<PropertyEngagementStats> {
  const map = await fetchEngagementMap([propertyId], visitorId);
  return map[propertyId] ?? { ...EMPTY_ENGAGEMENT };
}

export async function togglePropertyLike(
  propertyId: number,
  visitorId: string
): Promise<PropertyEngagementStats | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: existing, error: existingError } = await supabase
    .from("property_likes")
    .select("id")
    .eq("property_id", propertyId)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (!isMissingEngagementRelation(existingError)) {
    if (existingError) throw new Error(existingError.message);

    if (existing?.id) {
      const { error } = await supabase.from("property_likes").delete().eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("property_likes").insert({
        property_id: propertyId,
        visitor_id: visitorId,
      });
      if (error && error.code !== "23505") throw new Error(error.message);
    }

    return fetchPropertyEngagement(propertyId, visitorId);
  }

  const store = await mutateEngagementStore(supabase, (next) => {
    toggleLikeInStore(next, propertyId, visitorId);
  });
  return statsFromStore(store, propertyId, visitorId);
}

export async function setPropertyRating(
  propertyId: number,
  visitorId: string,
  rating: number
): Promise<PropertyEngagementStats | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { error } = await supabase.from("property_ratings").upsert(
    {
      property_id: propertyId,
      visitor_id: visitorId,
      rating,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "property_id,visitor_id" }
  );

  if (!error) {
    return fetchPropertyEngagement(propertyId, visitorId);
  }
  if (!isMissingEngagementRelation(error)) {
    throw new Error(error.message);
  }

  const store = await mutateEngagementStore(supabase, (next) => {
    setRatingInStore(next, propertyId, visitorId, rating);
  });
  return statsFromStore(store, propertyId, visitorId);
}
