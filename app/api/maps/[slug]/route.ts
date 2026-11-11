import { NextResponse } from "next/server";
import { loadPublishedPlotMap } from "@/lib/maps/repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const loaded = await loadPublishedPlotMap(params.slug);
    if (!loaded) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(loaded, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The plot map could not be loaded.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
