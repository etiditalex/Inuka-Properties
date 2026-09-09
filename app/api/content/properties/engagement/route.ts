import { NextResponse } from "next/server";
import {
  EMPTY_ENGAGEMENT,
  fetchEngagementMap,
  isValidVisitorId,
  parsePropertyId,
} from "@/lib/properties/engagement";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawIds = (searchParams.get("ids") || "")
    .split(",")
    .map((value) => parsePropertyId(value.trim()))
    .filter((id): id is number => id != null)
    .slice(0, 100);

  const visitorParam = searchParams.get("visitorId");
  const visitorId = isValidVisitorId(visitorParam) ? visitorParam : null;

  if (rawIds.length === 0) {
    return NextResponse.json({ items: {} });
  }

  try {
    const map = await fetchEngagementMap(rawIds, visitorId);
    const items: Record<string, typeof EMPTY_ENGAGEMENT> = {};
    for (const id of rawIds) {
      items[String(id)] = map[id] ?? { ...EMPTY_ENGAGEMENT };
    }
    return NextResponse.json(
      { items },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    const items = Object.fromEntries(rawIds.map((id) => [String(id), { ...EMPTY_ENGAGEMENT }]));
    return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
