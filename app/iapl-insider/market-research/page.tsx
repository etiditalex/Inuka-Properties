"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, MapPin, Download } from "lucide-react";
import {
  STATIC_MARKET_INSIGHTS,
  STATIC_MARKET_REPORTS,
} from "@/lib/market-research/catalog";

const formatIsoDate = (isoDate: string) => {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

export default function MarketResearchPage() {
  const iconMap = {
    MapPin,
    BarChart3,
    TrendingUp,
  } as const;

  const staticReports = STATIC_MARKET_REPORTS.map((r) => ({
    title: r.title,
    description: r.description,
    date: r.report_date,
    type: r.report_type,
  }));

  const staticInsights = STATIC_MARKET_INSIGHTS.map((i) => ({
    icon: iconMap[i.icon as keyof typeof iconMap] ?? TrendingUp,
    title: i.title,
    value: i.value,
    description: i.description,
  }));

  const [reports, setReports] = useState(staticReports);
  const [insights, setInsights] = useState(staticInsights);

  useEffect(() => {
    fetch("/api/content/market-research")
      .then((r) => r.json())
      .then((data) => {
        if (data.reports?.length) {
          setReports(
            data.reports.map((r: { title: string; description: string; report_date: string; report_type: string; file_url?: string }) => ({
              title: r.title,
              description: r.description,
              date: r.report_date,
              type: r.report_type,
              fileUrl: r.file_url,
            }))
          );
        }
        if (data.insights?.length) {
          setInsights(
            data.insights.map((i: { icon: string; title: string; value: string; description: string }) => ({
              icon: i.icon === "MapPin" ? MapPin : i.icon === "BarChart3" ? BarChart3 : TrendingUp,
              title: i.title,
              value: i.value,
              description: i.description,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Market Research</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Data-driven insights to guide your property investment decisions
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <insight.icon size={32} className="text-primary-700" />
              </div>
              <div className="text-3xl font-bold text-primary-700 mb-2">{insight.value}</div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">{insight.title}</h3>
              <p className="text-sm text-dark-600">{insight.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {report.type}
                    </span>
                    <span className="text-sm text-dark-600">{formatIsoDate(report.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">{report.title}</h3>
                  <p className="text-dark-600">{report.description}</p>
                </div>
                <button
                  type="button"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
                  onClick={() => {
                    const fileUrl = (report as { fileUrl?: string }).fileUrl;
                    if (fileUrl) window.open(fileUrl, "_blank");
                  }}
                >
                  <Download size={20} />
                  Download Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}








