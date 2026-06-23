import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogVideos } from "@/lib/videos/importCatalog";
import { STATIC_GALLERY_VIDEOS } from "@/lib/videos/catalog";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const serviceClient = createServiceClient();
    if (!serviceClient) return NextResponse.json({ error: authConfigError() }, { status: 503 });

    const result = await importCatalogVideos(serviceClient);
    return NextResponse.json({
      ...result,
      total: STATIC_GALLERY_VIDEOS.length,
      message: result.failed === 0
        ? `Imported ${result.imported} videos from the website.`
        : `Imported ${result.imported} videos. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-videos]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
