export type PropertyEngagementStats = {
  likeCount: number;
  liked: boolean;
  ratingAvg: number;
  ratingCount: number;
  myRating: number | null;
};

export const EMPTY_ENGAGEMENT: PropertyEngagementStats = {
  likeCount: 0,
  liked: false,
  ratingAvg: 0,
  ratingCount: 0,
  myRating: null,
};

const VISITOR_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidVisitorId(value: unknown): value is string {
  return typeof value === "string" && VISITOR_ID_RE.test(value);
}

export function parsePropertyId(value: unknown): number | null {
  const id = typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(id) || id < 1 || id > 999999) return null;
  return id;
}

export function parseRating(value: unknown): number | null {
  const n = typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}
