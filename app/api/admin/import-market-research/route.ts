import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogMarketResearch } from "@/lib/market-research/importCatalog";
import {
  STATIC_MARKET_INSIGHTS,
  STATIC_MARKET_REPORTS,
} from "@/lib/market-research/catalog";

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

    const { reports, insights } = await importCatalogMarketResearch(serviceClient);
    const totalFailed = reports.failed + insights.failed;
    const totalImported = reports.imported + insights.imported;

    return NextResponse.json({
      reports,
      insights,
      total: STATIC_MARKET_REPORTS.length + STATIC_MARKET_INSIGHTS.length,
      message:
        totalFailed === 0
          ? `Imported ${reports.imported} reports and ${insights.imported} insights from the website.`
          : `Imported ${totalImported} items. ${totalFailed} failed.`,
    });
  } catch (err) {
    console.error("[import-market-research]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
