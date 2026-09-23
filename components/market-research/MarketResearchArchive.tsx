"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BarChart3, ChevronRight, Home, MapPin, TrendingUp } from "lucide-react";
import { propertyImageProps } from "@/lib/images";
import {
  isMarketResearchPost,
  STATIC_MARKET_INSIGHTS,
} from "@/lib/market-research/catalog";

type ReportCard = {
  title: string;
  description: string;
  date: string;
  slug: string;
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

export default function MarketResearchArchive() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const iconMap = {
    MapPin,
    BarChart3,
    TrendingUp,
  } as const;

  const staticInsights = STATIC_MARKET_INSIGHTS.map((insight) => ({
    icon: iconMap[insight.icon as keyof typeof iconMap] ?? TrendingUp,
    title: insight.title,
    value: insight.value,
    description: insight.description,
  }));

  const [reports, setReports] = useState<ReportCard[]>([]);
  const [insights, setInsights] = useState(staticInsights);
  const visibleReports = useMemo(() => {
    if (!query) return reports;
    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query)
    );
  }, [query, reports]);

  useEffect(() => {
    fetch("/api/content/blogs", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const articles = (data.posts || []).filter((post: { category?: string }) =>
          isMarketResearchPost(post.category)
        );
        setReports(
          articles.map(
            (post: {
              title: string;
              excerpt: string;
              published_at: string;
              image?: string;
              slug: string;
            }) => ({
              title: post.title,
              description: post.excerpt,
              date: post.published_at.slice(0, 10),
              slug: post.slug,
              imageUrl: post.image,
            })
          )
        );
      })
      .catch(() => {});

    fetch("/api/content/market-research")
      .then((response) => response.json())
      .then((data) => {
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

        {visibleReports.length === 0 ? (
          <p className="text-center text-neutral-600">
            {query
              ? "No market research articles matched that search."
              : "Published market research articles will appear here."}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleReports.map((report, index) => {
            const image = report.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
            const imageProps = propertyImageProps(image);
            return (
              <article
                key={`${report.slug}-${index}`}
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
                <Link
                  href={`/iapl-insider/market-research/${report.slug}`}
                  className="mt-6 inline-flex items-center justify-center gap-1 text-center text-sm font-bold uppercase tracking-wide text-neutral-900 hover:text-primary-700"
                >
                  Read more
                  <ArrowRight size={15} />
                </Link>
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
