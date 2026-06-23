import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogTestimonials } from "@/lib/testimonials/importCatalog";
import { STATIC_TESTIMONIALS } from "@/lib/testimonials/catalog";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const serviceClient = createServiceClient();
    if (!serviceClient) return NextResponse.json({ error: authConfigError() }, { status: 503 });

    const result = await importCatalogTestimonials(serviceClient);
    return NextResponse.json({
      ...result,
      total: STATIC_TESTIMONIALS.length,
      message: result.failed === 0
        ? `Imported ${result.imported} testimonials from the website.`
        : `Imported ${result.imported} testimonials. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-testimonials]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
