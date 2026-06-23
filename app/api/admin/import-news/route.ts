import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogNews } from "@/lib/news/importCatalog";
import { STATIC_NEWS_CATALOG } from "@/lib/news/catalog";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceClient = createServiceClient();
    if (!serviceClient) {
      return NextResponse.json({ error: authConfigError() }, { status: 503 });
    }

    const result = await importCatalogNews(serviceClient);

    return NextResponse.json({
      ...result,
      total: STATIC_NEWS_CATALOG.length,
      message:
        result.failed === 0
          ? `Imported ${result.imported} news updates from the website.`
          : `Imported ${result.imported} news updates. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-news]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
