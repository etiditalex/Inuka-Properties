import {
  EMPTY_ENGAGEMENT,
  type PropertyEngagementStats,
} from "@/lib/properties/engagementTypes";

const VISITOR_STORAGE_KEY = "iapl_visitor_id";
const LOCAL_LIKES_KEY = "iapl_property_likes";
const LOCAL_RATINGS_KEY = "iapl_property_ratings";
const VISITOR_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type LocalMap<T> = Record<string, T>;

function readLocalMap<T>(key: string): LocalMap<T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalMap<T>(key: string, value: LocalMap<T>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

function mergeLocalStats(propertyId: number, stats: PropertyEngagementStats): PropertyEngagementStats {
  const likes = readLocalMap<boolean>(LOCAL_LIKES_KEY);
  const ratings = readLocalMap<number>(LOCAL_RATINGS_KEY);
  const key = String(propertyId);
  let next = { ...stats };

  if (likes[key] && !next.liked) {
    next = { ...next, liked: true, likeCount: Math.max(next.likeCount, 1) };
  }
  if (typeof ratings[key] === "number" && !next.myRating) {
    const rating = ratings[key];
    const count = Math.max(next.ratingCount, 1);
    next = {
      ...next,
      myRating: rating,
      ratingCount: count,
      ratingAvg: next.ratingCount > 0 ? next.ratingAvg : rating,
    };
  }
  return next;
}

function saveLocalLike(propertyId: number, liked: boolean) {
  const likes = readLocalMap<boolean>(LOCAL_LIKES_KEY);
  if (liked) likes[String(propertyId)] = true;
  else delete likes[String(propertyId)];
  writeLocalMap(LOCAL_LIKES_KEY, likes);
}

function saveLocalRating(propertyId: number, rating: number) {
  const ratings = readLocalMap<number>(LOCAL_RATINGS_KEY);
  ratings[String(propertyId)] = rating;
  writeLocalMap(LOCAL_RATINGS_KEY, ratings);
}

const cache = new Map<number, PropertyEngagementStats>();
const listeners = new Map<number, Set<(stats: PropertyEngagementStats) => void>>();
const queued = new Set<number>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing && VISITOR_ID_RE.test(existing)) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function notify(propertyId: number, stats: PropertyEngagementStats) {
  cache.set(propertyId, stats);
  listeners.get(propertyId)?.forEach((listener) => listener(stats));
}

async function flushQueue() {
  const ids = [...queued];
  queued.clear();
  flushTimer = null;
  if (ids.length === 0) return;

  const visitorId = getVisitorId();
  const params = new URLSearchParams({ ids: ids.join(",") });
  if (visitorId) params.set("visitorId", visitorId);

  try {
    const res = await fetch(`/api/content/properties/engagement?${params.toString()}`, {
      cache: "no-store",
    });
    const data = res.ok ? await res.json() : { items: {} };
    const items = (data.items || {}) as Record<string, PropertyEngagementStats>;
    for (const id of ids) {
      notify(id, mergeLocalStats(id, items[String(id)] ?? { ...EMPTY_ENGAGEMENT }));
    }
  } catch {
    for (const id of ids) {
      notify(id, mergeLocalStats(id, cache.get(id) ?? { ...EMPTY_ENGAGEMENT }));
    }
  }
}

function enqueue(propertyId: number) {
  queued.add(propertyId);
  if (flushTimer) return;
  flushTimer = setTimeout(flushQueue, 30);
}

export function subscribePropertyEngagement(
  propertyId: number,
  listener: (stats: PropertyEngagementStats) => void
): () => void {
  if (!listeners.has(propertyId)) listeners.set(propertyId, new Set());
  listeners.get(propertyId)!.add(listener);

  const cached = cache.get(propertyId);
  if (cached) listener(cached);
  else enqueue(propertyId);

  return () => {
    listeners.get(propertyId)?.delete(listener);
  };
}

function optimisticLike(current: PropertyEngagementStats): PropertyEngagementStats {
  const liked = !current.liked;
  return {
    ...current,
    liked,
    likeCount: Math.max(0, current.likeCount + (liked ? 1 : -1)),
  };
}

function optimisticRating(
  current: PropertyEngagementStats,
  rating: number
): PropertyEngagementStats {
  const previous = current.myRating;
  const count = previous ? current.ratingCount : current.ratingCount + 1;
  const sum = current.ratingAvg * current.ratingCount - (previous || 0) + rating;
  const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : rating;
  return {
    ...current,
    myRating: rating,
    ratingCount: count,
    ratingAvg: avg,
  };
}

export async function togglePropertyLikeClient(
  propertyId: number
): Promise<PropertyEngagementStats> {
  const previous = cache.get(propertyId) ?? { ...EMPTY_ENGAGEMENT };
  notify(propertyId, optimisticLike(previous));

  try {
    const res = await fetch(`/api/content/properties/${propertyId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId() }),
    });
    const data = await res.json();
    const optimistic = optimisticLike(previous);
    saveLocalLike(propertyId, optimistic.liked);
    if (!res.ok) {
      notify(propertyId, optimistic);
      return optimistic;
    }
    const next = (data.engagement as PropertyEngagementStats) || optimistic;
    notify(propertyId, next);
    return next;
  } catch {
    const optimistic = optimisticLike(previous);
    saveLocalLike(propertyId, optimistic.liked);
    notify(propertyId, optimistic);
    return optimistic;
  }
}

export async function setPropertyRatingClient(
  propertyId: number,
  rating: number
): Promise<PropertyEngagementStats> {
  const previous = cache.get(propertyId) ?? { ...EMPTY_ENGAGEMENT };
  notify(propertyId, optimisticRating(previous, rating));

  try {
    const res = await fetch(`/api/content/properties/${propertyId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), rating }),
    });
    const data = await res.json();
    const optimistic = optimisticRating(previous, rating);
    saveLocalRating(propertyId, rating);
    if (!res.ok) {
      notify(propertyId, optimistic);
      return optimistic;
    }
    const next = (data.engagement as PropertyEngagementStats) || optimistic;
    notify(propertyId, next);
    return next;
  } catch {
    const optimistic = optimisticRating(previous, rating);
    saveLocalRating(propertyId, rating);
    notify(propertyId, optimistic);
    return optimistic;
  }
}
