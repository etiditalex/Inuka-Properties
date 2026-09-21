import { NextResponse } from "next/server";
import { fetchPublishedProperties } from "@/lib/properties/getProperties";
import { fetchEngagementMap } from "@/lib/properties/engagement";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const properties = await fetchPublishedProperties();
  const engagement = await fetchEngagementMap(
    properties.map((property) => property.id),
    null
  ).catch(() => ({}));

  return NextResponse.json(
    { properties, engagement },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
