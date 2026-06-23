import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogProperties } from "@/lib/properties/importCatalog";
import { STATIC_PROPERTY_CATALOG } from "@/lib/properties/catalog";

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

    const result = await importCatalogProperties(serviceClient);

    return NextResponse.json({
      ...result,
      total: STATIC_PROPERTY_CATALOG.length,
      message:
        result.failed === 0
          ? `Imported ${result.imported} listings from the website catalog.`
          : `Imported ${result.imported} listings. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-properties]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
