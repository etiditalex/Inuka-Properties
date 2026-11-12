import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/maps/adminAuth";
import { loadAdminPlotMap, savePlotMap } from "@/lib/maps/repository";
import type { PlotMapDocument } from "@/lib/maps/types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  try {
    const loaded = await loadAdminPlotMap(params.slug);
    if (!loaded) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(loaded);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The plot map could not be loaded.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = (await request.json()) as PlotMapDocument & { confirmAlignment?: boolean };
  const { confirmAlignment, ...document } = body;
  if (document.slug !== params.slug) {
    return NextResponse.json({ error: "The map name does not match this page." }, { status: 400 });
  }
  const saved = await savePlotMap(document, auth.user.id, Boolean(confirmAlignment));
  if ("error" in saved) {
    return NextResponse.json(
      { error: saved.error, migrationRequired: saved.migrationRequired },
      { status: saved.status }
    );
  }
  return NextResponse.json({ document: saved.document, persisted: true });
}
