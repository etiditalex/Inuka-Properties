"use client";

import { BarChart3, TrendingUp, MapPin, type LucideIcon } from "lucide-react";
import type { MarketResearchInsight, MarketResearchReport } from "@/lib/supabase/types";
import { formatIsoDate } from "@/lib/admin/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  MapPin,
  BarChart3,
};

type MarketResearchPreviewProps = {
  insights: Partial<MarketResearchInsight>[];
  reports: Partial<MarketResearchReport>[];
};

export default function MarketResearchPreview({
  insights,
  reports,
}: MarketResearchPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200">
      <div className="border-b border-dark-200 bg-dark-900 px-4 py-2">
        <p className="text-xs font-medium text-white/60">Frontend Preview — Market Research</p>
      </div>

      <div className="bg-white px-4 pb-2 pt-4 text-xs font-semibold text-neutral-900">
        Home <span className="text-neutral-400">›</span> Market Research
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-3 bg-dark-50 p-4">
        {(insights.length ? insights : [{ title: "—", value: "—", description: "—", icon: "TrendingUp" }]).map(
          (insight, i) => {
            const Icon = ICON_MAP[insight.icon || "TrendingUp"] || TrendingUp;
            return (
              <div key={i} className="rounded-xl bg-white p-3 text-center shadow-sm">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Icon size={18} className="text-primary-700" />
                </div>
                <div className="text-lg font-bold text-primary-700">{insight.value || "—"}</div>
                <p className="text-xs font-semibold text-dark-900">{insight.title}</p>
                <p className="mt-0.5 text-[10px] text-dark-500 line-clamp-2">{insight.description}</p>
              </div>
            );
          }
        )}
      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 gap-3 bg-white p-4 sm:grid-cols-2">
        {(reports.length
          ? reports
          : [{ title: "Report title", description: "Report summary", report_type: "Market Report", report_date: "2024-01-01" }]
        )
          .slice(0, 4)
          .map((report, i) => (
            <div key={i} className="flex h-full flex-col border border-neutral-200 bg-[#f5f5f5] p-3">
              <div className="flex items-start gap-2">
                <div className="h-10 w-14 shrink-0 bg-neutral-300" />
                <h4 className="text-xs font-bold leading-snug text-neutral-900">{report.title}</h4>
              </div>
              {report.report_date ? (
                <p className="mt-2 text-center text-[10px] text-neutral-500">{formatIsoDate(report.report_date)}</p>
              ) : null}
              <p className="mt-1 line-clamp-3 flex-1 text-center text-[10px] text-neutral-600">{report.description}</p>
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral-900">
                Read more →
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
