import { NextResponse } from "next/server";
import { loadPublishedPlotMapByProperty } from "@/lib/maps/repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const propertyId = Number(params.id);
  if (!Number.isInteger(propertyId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const loaded = await loadPublishedPlotMapByProperty(propertyId);
    if (!loaded) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(loaded, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The plot map could not be loaded.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
