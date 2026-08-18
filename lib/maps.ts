export type MapCoords = { lat: number; lng: number };

function toCoords(latRaw: string, lngRaw: string): MapCoords | null {
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function isShortMapsLink(url: string) {
  return /maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url);
}

export function parseMapCoords(mapLink?: string | null): MapCoords | null {
  if (!mapLink?.trim()) return null;
  const value = mapLink.trim();

  const at = value.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (at) return toCoords(at[1], at[2]);

  const bang = value.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (bang) return toCoords(bang[1], bang[2]);

  const query = value.match(/[?&](?:q|query|ll)=(-?\d+\.?\d*)[,\s+]+(-?\d+\.?\d*)/i);
  if (query) return toCoords(query[1], query[2]);

  const pair = value.match(/^\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/);
  if (pair) return toCoords(pair[1], pair[2]);

  return null;
}

export function buildGoogleMapsLink(query: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(query.trim())}`;
}

export function buildGoogleMapsLinkFromCoords(coords: MapCoords) {
  return `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
}

export function extractMapQuery(mapLink?: string | null): string | null {
  if (!mapLink?.trim()) return null;
  try {
    const url = new URL(mapLink);
    const q = url.searchParams.get("q") || url.searchParams.get("query");
    if (q) return q;
  } catch {
    return mapLink.trim();
  }
  return null;
}

export function buildMapEmbedSrc(mapLink?: string | null, fallbackQuery?: string): string | null {
  const link = mapLink?.trim() || "";
  if (link && (link.includes("output=embed") || link.includes("/maps/embed"))) {
    return link;
  }

  const coords = parseMapCoords(link);
  if (coords) {
    return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`;
  }

  if (link && !isShortMapsLink(link)) {
    const query = extractMapQuery(link) || link;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  }

  const fallback = fallbackQuery?.trim();
  if (fallback) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallback)}&z=14&output=embed`;
  }

  return null;
}

export function buildOpenMapsHref(mapLink?: string | null, fallbackQuery?: string): string | null {
  if (mapLink?.trim()) return mapLink.trim();
  if (fallbackQuery?.trim()) return buildGoogleMapsLink(fallbackQuery);
  return null;
}
