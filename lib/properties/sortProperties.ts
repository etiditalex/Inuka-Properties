import type { CatalogProperty } from "./catalog";

type SortableProperty = { id: number; created_at?: string | null };

function createdAtTime(property: SortableProperty): number {
  if (!property.created_at) return 0;
  const time = Date.parse(property.created_at);
  return Number.isNaN(time) ? 0 : time;
}

/** Newest listings first: created_at, then highest id as a tiebreaker. */
export function sortPropertiesNewestFirst<T extends SortableProperty>(properties: T[]): T[] {
  return [...properties].sort((a, b) => {
    const byDate = createdAtTime(b) - createdAtTime(a);
    if (byDate !== 0) return byDate;
    return b.id - a.id;
  });
}

export function getAvailableProperties<T extends SortableProperty & { status?: string }>(
  properties: T[]
): T[] {
  return sortPropertiesNewestFirst(properties.filter((p) => p.status !== "sold"));
}

export function getNewestListingId<T extends SortableProperty>(properties: T[]): number | undefined {
  return sortPropertiesNewestFirst(properties)[0]?.id;
}

/** Homepage grid: newly added available listings first. */
export function getHomepageProperties(properties: CatalogProperty[], limit = 4): CatalogProperty[] {
  return getAvailableProperties(properties).slice(0, limit);
}

/** Newest available listing — used for the homepage spotlight. */
export function getLatestProject<T extends SortableProperty & { status?: string }>(
  properties: T[]
): T | undefined {
  return getAvailableProperties(properties)[0];
}
