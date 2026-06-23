import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogNewsletters } from "@/lib/newsletters/importCatalog";
import { STATIC_NEWSLETTER_ISSUES } from "@/lib/newsletters/catalog";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const serviceClient = createServiceClient();
    if (!serviceClient) return NextResponse.json({ error: authConfigError() }, { status: 503 });

    const result = await importCatalogNewsletters(serviceClient);
    return NextResponse.json({
      ...result,
      total: STATIC_NEWSLETTER_ISSUES.length,
      message: STATIC_NEWSLETTER_ISSUES.length === 0
        ? "No static newsletter issues to import. Add issues in the admin or catalog first."
        : result.failed === 0
          ? `Imported ${result.imported} newsletter issues from the website.`
          : `Imported ${result.imported} newsletter issues. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-newsletters]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
