import {
  EMPTY_ENGAGEMENT,
  type PropertyEngagementStats,
} from "@/lib/properties/engagementTypes";

const VISITOR_STORAGE_KEY = "iapl_visitor_id";
const LOCAL_LIKES_KEY = "iapl_property_likes";
const LOCAL_RATINGS_KEY = "iapl_property_ratings";
const CHANNEL_NAME = "iapl-property-engagement";
const VISITOR_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POLL_MS = 8000;

type LocalMap<T> = Record<string, T>;

let memoryVisitorId = "";
const cache = new Map<number, PropertyEngagementStats>();
const listeners = new Map<number, Set<(stats: PropertyEngagementStats) => void>>();
const queued = new Set<number>();
const inFlight = new Set<number>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let channel: BroadcastChannel | null | undefined;

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

function applyLocalFlags(propertyId: number, stats: PropertyEngagementStats): PropertyEngagementStats {
  const likes = readLocalMap<boolean>(LOCAL_LIKES_KEY);
  const ratings = readLocalMap<number>(LOCAL_RATINGS_KEY);
  const key = String(propertyId);
  return {
    ...stats,
    liked: Boolean(stats.liked || likes[key]),
    myRating: stats.myRating ?? (typeof ratings[key] === "number" ? ratings[key] : null),
  };
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

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing && VISITOR_ID_RE.test(existing)) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    return id;
  } catch {
    if (!memoryVisitorId) memoryVisitorId = crypto.randomUUID();
    return memoryVisitorId;
  }
}

function getChannel(): BroadcastChannel | null {
  if (channel !== undefined) return channel;
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    channel = null;
    return channel;
  }
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      const payload = event.data as { propertyId?: number; stats?: PropertyEngagementStats } | null;
      if (!payload?.propertyId || !payload.stats) return;
      cache.set(payload.propertyId, payload.stats);
      listeners.get(payload.propertyId)?.forEach((listener) => listener(payload.stats!));
    };
  } catch {
    channel = null;
  }
  return channel;
}

function notify(propertyId: number, stats: PropertyEngagementStats, broadcast = true) {
  cache.set(propertyId, stats);
  listeners.get(propertyId)?.forEach((listener) => listener(stats));
  if (broadcast) {
    getChannel()?.postMessage({ propertyId, stats });
  }
}

export function hydratePropertyEngagement(items: Record<string, PropertyEngagementStats> | undefined) {
  if (!items) return;
  for (const [id, stats] of Object.entries(items)) {
    const propertyId = Number(id);
    if (!Number.isInteger(propertyId) || !stats) continue;
    notify(propertyId, applyLocalFlags(propertyId, stats), false);
  }
}

async function flushQueue() {
  const ids = [...queued].filter((id) => !inFlight.has(id));
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
      if (inFlight.has(id)) continue;
      notify(id, applyLocalFlags(id, items[String(id)] ?? cache.get(id) ?? { ...EMPTY_ENGAGEMENT }));
    }
  } catch {
    for (const id of ids) {
      if (inFlight.has(id)) continue;
      notify(id, applyLocalFlags(id, cache.get(id) ?? { ...EMPTY_ENGAGEMENT }));
    }
  }
}

function enqueue(propertyId: number) {
  queued.add(propertyId);
  if (flushTimer) return;
  flushTimer = setTimeout(flushQueue, 30);
}

function subscribedIds(): number[] {
  return [...listeners.entries()].filter(([, set]) => set.size > 0).map(([id]) => id);
}

function ensurePolling() {
  if (typeof window === "undefined" || pollTimer) return;
  pollTimer = setInterval(() => {
    if (document.hidden) return;
    const ids = subscribedIds().filter((id) => !inFlight.has(id));
    if (ids.length === 0) return;
    ids.forEach((id) => queued.add(id));
    void flushQueue();
  }, POLL_MS);
}

function stopPollingIfIdle() {
  if (subscribedIds().length > 0 || !pollTimer) return;
  clearInterval(pollTimer);
  pollTimer = null;
}

export function subscribePropertyEngagement(
  propertyId: number,
  listener: (stats: PropertyEngagementStats) => void
): () => void {
  if (!listeners.has(propertyId)) listeners.set(propertyId, new Set());
  listeners.get(propertyId)!.add(listener);
  getChannel();
  ensurePolling();

  const cached = cache.get(propertyId);
  if (cached) listener(cached);
  enqueue(propertyId);

  return () => {
    listeners.get(propertyId)?.delete(listener);
    stopPollingIfIdle();
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
  const optimistic = optimisticLike(previous);
  inFlight.add(propertyId);
  notify(propertyId, optimistic);

  try {
    const res = await fetch(`/api/content/properties/${propertyId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ visitorId: getVisitorId() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      notify(propertyId, previous);
      throw new Error(data.error || "Could not save your like.");
    }
    const next = (data.engagement as PropertyEngagementStats) || optimistic;
    saveLocalLike(propertyId, next.liked);
    notify(propertyId, next);
    return next;
  } catch (error) {
    if (cache.get(propertyId) === optimistic) notify(propertyId, previous);
    throw error;
  } finally {
    inFlight.delete(propertyId);
  }
}

export async function setPropertyRatingClient(
  propertyId: number,
  rating: number
): Promise<PropertyEngagementStats> {
  const previous = cache.get(propertyId) ?? { ...EMPTY_ENGAGEMENT };
  const optimistic = optimisticRating(previous, rating);
  inFlight.add(propertyId);
  notify(propertyId, optimistic);

  try {
    const res = await fetch(`/api/content/properties/${propertyId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ visitorId: getVisitorId(), rating }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      notify(propertyId, previous);
      throw new Error(data.error || "Could not save your rating.");
    }
    const next = (data.engagement as PropertyEngagementStats) || optimistic;
    saveLocalRating(propertyId, rating);
    notify(propertyId, next);
    return next;
  } catch (error) {
    if (cache.get(propertyId) === optimistic) notify(propertyId, previous);
    throw error;
  } finally {
    inFlight.delete(propertyId);
  }
}
