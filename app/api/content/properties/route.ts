import { NextResponse } from "next/server";
import { fetchPublishedProperties } from "@/lib/properties/getProperties";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const properties = await fetchPublishedProperties();
  return NextResponse.json(
    { properties },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
