"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, ChevronRight, Home, MapPin, TrendingUp } from "lucide-react";
import { propertyImageProps } from "@/lib/images";
import {
  STATIC_MARKET_INSIGHTS,
  STATIC_MARKET_REPORTS,
} from "@/lib/market-research/catalog";

type ReportCard = {
  title: string;
  description: string;
  date: string;
  type: string;
  fileUrl?: string | null;
  imageUrl?: string | null;
};

const FALLBACK_IMAGES = [
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767596630/kilifi_investment_swq82s.jpg",
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774342011/Msabaha_phase_8_fc1tuh.jpg",
];

function formatReportDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MarketResearchPage() {
  const iconMap = {
    MapPin,
    BarChart3,
    TrendingUp,
  } as const;

  const staticReports: ReportCard[] = STATIC_MARKET_REPORTS.map((report) => ({
    title: report.title,
    description: report.description,
    date: report.report_date,
    type: report.report_type,
    fileUrl: report.file_url,
    imageUrl: report.image_url,
  }));

  const staticInsights = STATIC_MARKET_INSIGHTS.map((insight) => ({
    icon: iconMap[insight.icon as keyof typeof iconMap] ?? TrendingUp,
    title: insight.title,
    value: insight.value,
    description: insight.description,
  }));

  const [reports, setReports] = useState(staticReports);
  const [insights, setInsights] = useState(staticInsights);

  useEffect(() => {
    fetch("/api/content/market-research")
      .then((response) => response.json())
      .then((data) => {
        if (data.reports?.length) {
          setReports(
            data.reports.map(
              (report: {
                title: string;
                description: string;
                report_date: string;
                report_type: string;
                file_url?: string | null;
                image_url?: string | null;
              }) => ({
                title: report.title,
                description: report.description,
                date: report.report_date,
                type: report.report_type,
                fileUrl: report.file_url,
                imageUrl: report.image_url,
              })
            )
          );
        }
        if (data.insights?.length) {
          setInsights(
            data.insights.map((insight: { icon: string; title: string; value: string; description: string }) => ({
              icon: insight.icon === "MapPin" ? MapPin : insight.icon === "BarChart3" ? BarChart3 : TrendingUp,
              title: insight.title,
              value: insight.value,
              description: insight.description,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white pb-20 pt-28">
      <section className="container mx-auto px-4 md:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <Link href="/" aria-label="Home" className="inline-flex text-neutral-900 hover:text-primary-700">
            <Home size={18} strokeWidth={1.75} />
          </Link>
          <ChevronRight size={16} className="text-neutral-500" />
          <span>Market Research</span>
        </nav>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report, index) => {
            const image = report.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
            const imageProps = propertyImageProps(image);
            return (
              <article
                key={`${report.title}-${index}`}
                className="flex h-full flex-col border border-neutral-200 bg-[#f5f5f5] p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-[72px] w-[104px] shrink-0 overflow-hidden bg-neutral-200">
                    <Image
                      src={imageProps.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="104px"
                      unoptimized={imageProps.unoptimized}
                    />
                  </div>
                  <h2 className="text-[15px] font-bold leading-snug text-neutral-900 sm:text-base">
                    {report.title}
                  </h2>
                </div>
                <p className="mt-5 text-center text-sm text-neutral-500">{formatReportDate(report.date)}</p>
                <p className="mt-3 line-clamp-4 flex-1 text-center text-sm leading-relaxed text-neutral-600">
                  {report.description}
                </p>
                {report.fileUrl ? (
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-1 text-center text-sm font-bold uppercase tracking-wide text-neutral-900 hover:text-primary-700"
                  >
                    Read more
                    <ArrowRight size={15} />
                  </a>
                ) : (
                  <p className="mt-6 inline-flex items-center justify-center gap-1 text-center text-sm font-bold uppercase tracking-wide text-neutral-900">
                    Read more
                    <ArrowRight size={15} />
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {insights.length > 0 ? (
        <section className="container mx-auto mt-16 px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {insights.map((insight, index) => (
              <div key={index} className="rounded-xl bg-white p-6 text-center shadow-lg">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <insight.icon size={32} className="text-primary-700" />
                </div>
                <div className="mb-2 text-3xl font-bold text-primary-700">{insight.value}</div>
                <h3 className="mb-2 text-lg font-semibold text-dark-900">{insight.title}</h3>
                <p className="text-sm text-dark-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
