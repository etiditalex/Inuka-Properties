import type { SupabaseClient } from "@supabase/supabase-js";
import {
  STATIC_MARKET_INSIGHTS,
  STATIC_MARKET_REPORTS,
} from "@/lib/market-research/catalog";
import type { ImportResult } from "@/lib/content/importTypes";

export type MarketResearchImportResult = {
  reports: ImportResult;
  insights: ImportResult;
};

export async function importCatalogMarketResearch(
  supabase: SupabaseClient
): Promise<MarketResearchImportResult> {
  const reports: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };
  const insights: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const report of STATIC_MARKET_REPORTS) {
    const row = {
      id: report.id,
      title: report.title,
      description: report.description,
      report_date: report.report_date,
      report_type: report.report_type,
      sort_order: report.sort_order,
      file_url: report.file_url ?? null,
      published: true,
    };

    const { error } = await supabase
      .from("market_research_reports")
      .upsert(row, { onConflict: "id" });
    if (error) {
      reports.failed += 1;
      reports.errors.push(`${report.title}: ${error.message}`);
    } else {
      reports.imported += 1;
      reports.titles.push(report.title);
    }
  }

  for (const insight of STATIC_MARKET_INSIGHTS) {
    const row = {
      id: insight.id,
      icon: insight.icon,
      title: insight.title,
      value: insight.value,
      description: insight.description,
      sort_order: insight.sort_order,
      published: true,
    };

    const { error } = await supabase
      .from("market_research_insights")
      .upsert(row, { onConflict: "id" });
    if (error) {
      insights.failed += 1;
      insights.errors.push(`${insight.title}: ${error.message}`);
    } else {
      insights.imported += 1;
      insights.titles.push(insight.title);
    }
  }

  return { reports, insights };
}
