"use client";

import { BarChart3, TrendingUp, MapPin, Download, type LucideIcon } from "lucide-react";
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

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-center text-white">
        <h2 className="text-2xl font-bold font-serif">Market Research</h2>
        <p className="mt-1 text-sm text-primary-100">
          Data-driven insights to guide your property investment decisions
        </p>
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
      <div className="space-y-3 p-4">
        {(reports.length ? reports : [{ title: "Sample Report", description: "...", report_type: "Market Report", report_date: "2024-01-01" }]).slice(0, 2).map(
          (report, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-dark-200 bg-white p-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                  {report.report_type || "Report"}
                </span>
                <h4 className="text-sm font-bold text-dark-900">{report.title}</h4>
                <p className="text-xs text-dark-500 line-clamp-1">{report.description}</p>
                {report.report_date && (
                  <p className="mt-1 text-[10px] text-dark-400">
                    {formatIsoDate(report.report_date)}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white"
              >
                <Download size={12} />
                Download
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
