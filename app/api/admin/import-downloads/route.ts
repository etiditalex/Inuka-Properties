import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogDownloads } from "@/lib/downloads/importCatalog";
import { STATIC_DOWNLOAD_ITEMS } from "@/lib/downloads/catalog";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const serviceClient = createServiceClient();
    if (!serviceClient) return NextResponse.json({ error: authConfigError() }, { status: 503 });

    const result = await importCatalogDownloads(serviceClient);
    return NextResponse.json({
      ...result,
      total: STATIC_DOWNLOAD_ITEMS.length,
      message: result.failed === 0
        ? `Imported ${result.imported} download items from the website.`
        : `Imported ${result.imported} download items. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-downloads]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
