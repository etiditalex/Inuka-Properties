"use client";

import { ReactNode, useEffect, useState } from "react";
import ExplorePlots from "@/components/maps/ExplorePlots";
import { STATIC_DOWNLOAD_ITEMS } from "@/lib/downloads/catalog";
import type { PlotMapDocument } from "@/lib/maps/types";

type DownloadItem = { title: string; file_url: string };

const RESOURCE_BUTTON =
  "inline-flex min-h-[43px] w-full items-center justify-center rounded-[5px] bg-primary-700 px-[29px] py-[13px] text-center font-montserrat text-sm font-normal uppercase tracking-[2px] text-white transition hover:bg-primary-800 sm:w-auto";

function compact(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function propertyNameKey(title: string) {
  const head = title.split(/[–—|]/)[0] ?? title;
  return compact(head);
}

function documentKey(title: string) {
  return compact(title.replace(/\([^)]*\)/g, " ").replace(/\b(map|pdf|brochure|site plan|alt)\b/gi, " "));
}

export function documentBelongsToProperty(documentTitle: string, propertyTitle: string) {
  const doc = documentKey(documentTitle);
  const prop = propertyNameKey(propertyTitle);
  if (doc.length < 4 || prop.length < 4) return false;
  return doc.includes(prop);
}

function encodeDownloadPath(filePath: string) {
  if (!filePath || filePath === "#") return null;
  return filePath
    .split("/")
    .map((part) => (part ? encodeURIComponent(part) : part))
    .join("/");
}

function buttonLabel(title: string, mapCount: number) {
  const lower = title.toLowerCase();
  if (lower.includes("brochure") || lower.includes("company profile")) return "Download Brochure";
  if (mapCount === 1 && (lower.includes("map") || lower.includes("plan"))) return "View PDF Site Plan";
  return title;
}

export default function PropertyDetailResources({
  propertyId,
  propertyTitle,
  mapHref,
  afterButtons,
}: {
  propertyId: number;
  propertyTitle: string;
  mapHref?: string | null;
  afterButtons?: ReactNode;
}) {
  const [downloads, setDownloads] = useState<DownloadItem[]>(
    STATIC_DOWNLOAD_ITEMS.map((item) => ({ title: item.title, file_url: item.file_url }))
  );
  const [plotMap, setPlotMap] = useState<PlotMapDocument | null>(null);

  useEffect(() => {
    fetch("/api/content/downloads")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { items?: { title?: string; file_url?: string }[] } | null) => {
        const items = data?.items
          ?.filter((item): item is { title: string; file_url: string } => Boolean(item.title && item.file_url))
          .map((item) => ({ title: item.title, file_url: item.file_url }));
        if (items?.length) setDownloads(items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/maps/property/${propertyId}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { document?: PlotMapDocument } | null) => {
        if (!cancelled) setPlotMap(body?.document ?? null);
      })
      .catch(() => {
        if (!cancelled) setPlotMap(null);
      });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const matched = downloads.filter(
    (item) => encodeDownloadPath(item.file_url) && documentBelongsToProperty(item.title, propertyTitle)
  );
  const mapCount = matched.filter((item) => /map|plan/i.test(item.title)).length;

  const buttons: { href: string; label: string; external?: boolean }[] = [];

  if (plotMap?.slug) {
    buttons.push({ href: `/maps/${plotMap.slug}`, label: "View Live Subdivision Map" });
  }
  if (mapHref) {
    buttons.push({ href: mapHref, label: "View Map Location", external: true });
  }
  matched.forEach((item) => {
    const href = encodeDownloadPath(item.file_url);
    if (!href) return;
    buttons.push({
      href,
      label: buttonLabel(item.title, mapCount),
      external: true,
    });
  });

  return (
    <div>
      {buttons.length > 0 && (
        <div className="my-5 flex flex-wrap gap-3">
          {buttons.map((button) => (
            <a
              key={`${button.label}-${button.href}`}
              href={button.href}
              target={button.external ? "_blank" : undefined}
              rel={button.external ? "noopener noreferrer" : undefined}
              className={RESOURCE_BUTTON}
            >
              {button.label}
            </a>
          ))}
        </div>
      )}
      {afterButtons}
      {plotMap ? (
        <div className="mt-8">
          <ExplorePlots propertyId={propertyId} />
        </div>
      ) : null}
    </div>
  );
}
