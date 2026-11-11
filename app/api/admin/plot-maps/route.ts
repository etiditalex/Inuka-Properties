import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/maps/adminAuth";
import { blankPlotMap, listAdminPlotMaps, loadAdminPlotMap, savePlotMap } from "@/lib/maps/repository";
import { slugifyProjectName } from "@/lib/maps/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  try {
    const maps = await listAdminPlotMaps();
    return NextResponse.json({ maps });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The plot maps could not be listed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = (await request.json()) as { propertyId?: number; projectName?: string; location?: string };
  const propertyId = Number(body.propertyId);
  const projectName = body.projectName?.trim() ?? "";
  const location = body.location?.trim() ?? "";
  if (!Number.isInteger(propertyId) || propertyId <= 0 || !projectName) {
    return NextResponse.json({ error: "Choose a listing and enter the project name." }, { status: 400 });
  }
  const maps = await listAdminPlotMaps();
  if (maps.some((item) => item.propertyId === propertyId)) {
    return NextResponse.json({ error: "That listing already has a plot map." }, { status: 409 });
  }
  let document = blankPlotMap({ propertyId, projectName, location });
  if (await loadAdminPlotMap(document.slug)) {
    document = { ...document, slug: `${slugifyProjectName(projectName)}-${propertyId}` };
  }
  const saved = await savePlotMap(document, auth.user.id, false);
  if ("error" in saved) {
    return NextResponse.json(
      { error: saved.error, migrationRequired: saved.migrationRequired, document },
      { status: saved.status }
    );
  }
  return NextResponse.json({ document: saved.document });
}
