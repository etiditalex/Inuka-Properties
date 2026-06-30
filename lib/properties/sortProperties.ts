import type { CatalogProperty } from "./catalog";

/** Tulivu Haven — newest listing; pinned on homepage */
export const LATEST_PROJECT_ID = 14;

type SortableProperty = { id: number };

/** Newest projects first (highest property id = latest). */
export function sortPropertiesNewestFirst<T extends SortableProperty>(properties: T[]): T[] {
  return [...properties].sort((a, b) => b.id - a.id);
}

export function getAvailableProperties<T extends SortableProperty & { status?: string }>(
  properties: T[]
): T[] {
  return sortPropertiesNewestFirst(properties.filter((p) => p.status !== "sold"));
}

/** Homepage grid: latest project first, then other newest available listings. */
export function getHomepageProperties(properties: CatalogProperty[], limit = 4): CatalogProperty[] {
  const available = getAvailableProperties(properties);
  const latest = available.find((p) => p.id === LATEST_PROJECT_ID);
  const rest = available.filter((p) => p.id !== LATEST_PROJECT_ID);
  const ordered = latest ? [latest, ...rest] : available;
  return ordered.slice(0, limit);
}

export function getLatestProject<T extends SortableProperty>(
  properties: T[]
): T | undefined {
  return properties.find((p) => p.id === LATEST_PROJECT_ID);
}
