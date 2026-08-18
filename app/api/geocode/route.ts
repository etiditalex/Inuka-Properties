import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type NominatimHit = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing location" }, { status: 400 });
  }

  try {
    const url =
      "https://nominatim.openstreetmap.org/search" +
      `?format=json&limit=1&countrycodes=ke&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "InukaAfrikaProperties/1.0 (https://www.inukaproperties.co.ke)",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Map lookup failed" }, { status: 502 });
    }

    const hits = (await res.json()) as NominatimHit[];
    const hit = hits[0];
    if (!hit?.lat || !hit?.lon) {
      return NextResponse.json({ error: "No matching place found" }, { status: 404 });
    }

    return NextResponse.json({
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      label: hit.display_name || query,
    });
  } catch {
    return NextResponse.json({ error: "Map lookup failed" }, { status: 502 });
  }
}
