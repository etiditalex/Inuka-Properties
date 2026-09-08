import { STATIC_DOWNLOAD_ITEMS } from "@/lib/downloads/catalog";
import { STATIC_PROPERTY_CATALOG } from "@/lib/properties/catalog";
import { PROPERTY_DETAILS } from "@/lib/properties/detailFallback";
import { PROPERTY_SEO, propertyDetailPath } from "@/lib/propertySeo";
import { getStaticChatbotPages, mergeLiveChatbotPages } from "./sitePages";
import { normalizeChatText } from "./text";
import type {
  ChatbotDownload,
  ChatbotKnowledge,
  ChatbotProperty,
  LiveBlogPost,
  LiveCatalogProperty,
  LiveDownloadItem,
  LiveNewsItem,
} from "./types";

const GENERIC_FIRST_WORDS = new Set([
  "ocean",
  "malindi",
  "bofa",
  "kibao",
  "inuka",
  "new",
  "land",
  "prime",
  "affordable",
]);

const MANUAL_PAYMENT: Record<number, Record<string, string>> = {
  3: {
    "1/8 Acre": "KES 450,000",
    "1/8 Acre deposit": "KES 150,000 then KES 25,000 x 12 months",
    "1/4 Acre": "KES 950,000",
    "1/4 Acre deposit": "KES 250,000, balance over 12 months",
    Note: "All-inclusive pricing, no hidden charges",
  },
};

const MANUAL_SIZE: Record<number, string> = {
  3: "1/8 & 1/4 Acre",
};

const MANUAL_ALIASES: Record<number, string[]> = {
  14: ["tulivu", "tulivu haven"],
  13: ["msabaha 8", "msabaha phase 8"],
  12: ["rafiki", "rafiki 10", "rafiki @10"],
  11: ["mwanda", "mwanda 3", "mwanda phase 3"],
  10: ["kibao kiche haven"],
  9: ["ocean view", "oceanview", "ocean view gardens"],
  8: ["bofa 21", "bofa phase 21"],
  7: ["msabaha 6", "msabaha phase 6"],
  6: ["airport gardens", "malindi airport gardens", "malindi airport"],
  5: ["mtondia", "mtondia highway", "mtondia highway gardens"],
  4: ["chumani 3", "chumani phase 3"],
  3: ["miliki tezo", "miliki tezo na inuka"],
  2: ["chumani 6", "chumani phase 6"],
  1: ["bofa platinum"],
};

export { normalizeChatText } from "./text";

function displayTitle(title: string): string {
  if (!title || title !== title.toUpperCase()) return title;
  return title.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function uniquePhrases(values: string[]): string[] {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const value of values) {
    const normalized = normalizeChatText(value);
    if (normalized.length < 4 || seen.has(normalized)) continue;
    seen.add(normalized);
    phrases.push(normalized);
  }
  return phrases.sort((a, b) => b.length - a.length);
}

function aliasesFromTitle(title: string, slug?: string, extra: string[] = []): string[] {
  const aliases = [title, ...extra];
  if (slug) aliases.push(slug.replace(/-/g, " "));

  const stripped = normalizeChatText(title)
    .replace(/\s+prime plots now selling$/, "")
    .replace(/\s+[-–—].*$/, "")
    .trim();
  aliases.push(stripped);

  const phaseMatch = stripped.match(/^(.*)\s+phase\s+(\d+)$/);
  if (phaseMatch) {
    aliases.push(`${phaseMatch[1]} ${phaseMatch[2]}`);
    aliases.push(phaseMatch[1]);
  }

  const first = stripped.split(" ")[0];
  if (first && first.length >= 5 && !GENERIC_FIRST_WORDS.has(first)) {
    aliases.push(first);
  }

  return uniquePhrases(aliases);
}

function aliasesFromDownloadTitle(title: string): string[] {
  const aliases = [title];
  const withoutMap = title.replace(/\s+map(\s+\(alt\))?$/i, "").trim();
  if (withoutMap !== title) aliases.push(withoutMap);
  aliases.push(withoutMap.replace(/\s+/g, ""));
  aliases.push(withoutMap.replace(/oceanview/i, "ocean view"));
  if (/company profile/i.test(title)) aliases.push("company profile");
  if (/property listings/i.test(title)) aliases.push("property listings", "listings catalog");
  return uniquePhrases(aliases);
}

function asStringRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function titlesConflict(left?: string, right?: string): boolean {
  if (!left || !right) return false;
  const a = normalizeChatText(left);
  const b = normalizeChatText(right);
  return a !== b && !a.includes(b) && !b.includes(a);
}

function buildPropertyFromSources(id: number): ChatbotProperty | null {
  const seo = PROPERTY_SEO.find((entry) => entry.id === id);
  const catalog = STATIC_PROPERTY_CATALOG.find((entry) => entry.id === id);
  const detail = PROPERTY_DETAILS[id] as Record<string, unknown> | undefined;
  const conflict = titlesConflict(seo?.title, typeof detail?.title === "string" ? detail.title : undefined);
  const useDetail = Boolean(detail) && !conflict;

  const title = displayTitle(
    catalog?.title ||
      (seo?.title && seo.title.trim()) ||
      (useDetail && typeof detail?.title === "string" ? detail.title : "")
  );
  if (!title) return null;

  const location =
    seo?.location ||
    catalog?.location ||
    (useDetail && typeof detail?.location === "string" ? detail.location : "Kilifi County");

  const seoFacts = seo?.additionalProperty?.map((item) => `${item.name}: ${item.value}`) ?? [];

  return {
    id,
    title,
    aliases: aliasesFromTitle(title, seo?.slug, MANUAL_ALIASES[id] ?? []),
    location: seo?.county && !location.includes(seo.county) ? `${location}, ${seo.county}` : location,
    type: catalog?.type || (useDetail && typeof detail?.type === "string" ? detail.type : "residential"),
    price: seo?.price || catalog?.price || (useDetail && typeof detail?.price === "string" ? detail.price : "Ask for pricing"),
    size: catalog?.size || (useDetail && typeof detail?.size === "string" ? detail.size : "") || MANUAL_SIZE[id] || "",
    status: catalog?.status || (useDetail && typeof detail?.status === "string" ? detail.status : seo?.soldOut ? "sold" : "available"),
    features: catalog?.features?.length
      ? catalog.features
      : useDetail
        ? asStringArray(detail?.features)
        : seoFacts,
    pricing: useDetail ? asStringRecord(detail?.pricing) : undefined,
    paymentPlan: (useDetail ? asStringRecord(detail?.paymentPlan) : undefined) || MANUAL_PAYMENT[id],
    description:
      (useDetail && typeof detail?.description === "string" ? detail.description : undefined) || seo?.description,
    path: propertyDetailPath(id),
    mapLink: seo?.mapLink || (useDetail && typeof detail?.mapLink === "string" ? detail.mapLink : undefined),
    faqs: seo?.faq ?? [],
  };
}

function buildKikambalaExtra(): ChatbotProperty | null {
  const seo = PROPERTY_SEO.find((entry) => entry.id === 3);
  const detail = PROPERTY_DETAILS[3] as Record<string, unknown> | undefined;
  if (!detail || typeof detail.title !== "string") return null;
  if (seo?.title && normalizeChatText(seo.title) === normalizeChatText(detail.title)) return null;

  return {
    id: 1003,
    title: detail.title,
    aliases: aliasesFromTitle(detail.title, undefined, ["kikambala", "kikambala phase 2", "kikambala gardens"]),
    location: typeof detail.location === "string" ? detail.location : "Kikambala, Kilifi County",
    type: typeof detail.type === "string" ? detail.type : "residential",
    price: typeof detail.price === "string" ? detail.price : "KES 1,250,000",
    size: typeof detail.size === "string" ? detail.size : "1/8 Acre",
    status: "ongoing",
    features: asStringArray(detail.features),
    pricing: asStringRecord(detail.pricing),
    paymentPlan: asStringRecord(detail.paymentPlan),
    description: typeof detail.description === "string" ? detail.description : undefined,
    path: "/for-sale/ongoing-projects",
    faqs: [],
  };
}

function buildDownloads(items: LiveDownloadItem[] = STATIC_DOWNLOAD_ITEMS): ChatbotDownload[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    fileUrl: item.file_url,
    parentId: item.parent_id,
    aliases: aliasesFromDownloadTitle(item.title),
  }));
}

export function getStaticChatbotKnowledge(): ChatbotKnowledge {
  const ids = new Set<number>([
    ...PROPERTY_SEO.map((entry) => entry.id),
    ...STATIC_PROPERTY_CATALOG.map((entry) => entry.id),
    ...Object.keys(PROPERTY_DETAILS).map(Number),
  ]);

  const properties = [...ids]
    .sort((a, b) => b - a)
    .map(buildPropertyFromSources)
    .filter((property): property is ChatbotProperty => Boolean(property));

  const extra = buildKikambalaExtra();

  return {
    properties,
    extraProjects: extra ? [extra] : [],
    downloads: buildDownloads(),
    pages: getStaticChatbotPages(),
  };
}

export function allChatbotProperties(knowledge: ChatbotKnowledge): ChatbotProperty[] {
  return [...knowledge.properties, ...knowledge.extraProjects];
}

export function mergeLiveChatbotKnowledge(
  base: ChatbotKnowledge,
  liveProperties?: LiveCatalogProperty[],
  liveDownloads?: LiveDownloadItem[],
  liveBlogs?: LiveBlogPost[],
  liveNews?: LiveNewsItem[]
): ChatbotKnowledge {
  const properties = base.properties.map((property) => {
    const live = liveProperties?.find((item) => item.id === property.id);
    if (!live) return property;
    return {
      ...property,
      title: live.title || property.title,
      aliases: uniquePhrases([...property.aliases, ...aliasesFromTitle(live.title, undefined, MANUAL_ALIASES[live.id] ?? [])]),
      location: live.location || property.location,
      type: live.type || property.type,
      price: live.price || property.price,
      size: live.size || property.size,
      status: live.status || property.status,
      features: live.features?.length ? live.features : property.features,
    };
  });

  const knownIds = new Set(properties.map((property) => property.id));
  for (const live of liveProperties ?? []) {
    if (knownIds.has(live.id)) continue;
    properties.push({
      id: live.id,
      title: live.title,
      aliases: aliasesFromTitle(live.title, undefined, MANUAL_ALIASES[live.id] ?? []),
      location: live.location,
      type: live.type,
      price: live.price,
      size: live.size,
      status: live.status || "available",
      features: live.features ?? [],
      path: propertyDetailPath(live.id),
      faqs: [],
    });
  }

  return {
    properties,
    extraProjects: base.extraProjects,
    downloads: liveDownloads?.length ? buildDownloads(liveDownloads) : base.downloads,
    pages: mergeLiveChatbotPages(base.pages, liveBlogs, liveNews),
  };
}

export function relatedDownloadsForProperty(
  property: ChatbotProperty,
  downloads: ChatbotDownload[]
): ChatbotDownload[] {
  const title = normalizeChatText(property.title);
  const compactTitle = title.replace(/\s+/g, "");
  const phase = title.match(/^(.*)\s+phase\s+(\d+)$/);

  return downloads.filter((download) => {
    const hay = normalizeChatText(`${download.title} ${download.aliases.join(" ")}`);
    const compactHay = hay.replace(/\s+/g, "");
    const mapped = normalizeChatText(download.title.replace(/\s+map(\s+\(alt\))?$/i, ""));
    const compactMapped = mapped.replace(/\s+/g, "");

    if (phase) {
      const downloadPhase = hay.match(/phase\s+(\d+)/);
      return hay.includes(phase[1]) && downloadPhase?.[1] === phase[2];
    }

    return (
      compactHay.includes(compactTitle) ||
      compactTitle.includes(compactMapped) ||
      compactMapped.includes(compactTitle)
    );
  });
}

export const COMPANY_PROFILE_PATH = "/downloads/Inuka-Afrika-Company-Profile.pdf";
export const PROPERTY_LISTINGS_PDF_PATH = "/downloads/inuka-12-13-25.pdf";
export const DOWNLOADS_PAGE_PATH = "/testimonials/downloads";
export const FOR_SALE_PATH = "/for-sale";
export const BOOK_VISIT_PATH = "/book-site-visit";
