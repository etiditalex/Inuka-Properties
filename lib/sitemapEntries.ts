import type { MetadataRoute } from "next";
import { BLOG_ARTICLE_SLUGS, BLOG_POSTS } from "@/lib/blogPosts";
import { PROPERTY_SEO } from "@/lib/propertySeo";
import { fetchPublishedProperties } from "@/lib/properties/getProperties";
import { SITE_ORIGIN } from "@/lib/site";

type SitemapEntry = MetadataRoute.Sitemap[number];

function parseDate(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toLastmod(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function staticPage(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "monthly",
  lastModified?: Date
): SitemapEntry {
  return {
    url: `${SITE_ORIGIN}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const propertyById = new Map<
    number,
    { lastModified?: Date; priority: number }
  >();

  for (const property of PROPERTY_SEO) {
    propertyById.set(property.id, {
      lastModified: parseDate(property.datePosted),
      priority: property.soldOut ? 0.4 : property.sitemapPriority ?? 0.85,
    });
  }

  try {
    const live = await fetchPublishedProperties();
    for (const property of live) {
      const existing = propertyById.get(property.id);
      const lastModified =
        parseDate(property.created_at) ?? existing?.lastModified;
      const priority =
        existing?.priority ?? (property.status === "sold" ? 0.4 : 0.85);
      propertyById.set(property.id, { lastModified, priority });
    }
  } catch {
    // Keep the static PROPERTY_SEO list if live listings cannot be loaded.
  }

  const newestPropertyDate = [...propertyById.values()]
    .map((property) => property.lastModified)
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const staticRoutes: SitemapEntry[] = [
    staticPage("", 1, "weekly", newestPropertyDate),
    staticPage("/for-sale", 0.95, "daily", newestPropertyDate),
    staticPage("/for-sale/ongoing-projects", 0.9, "daily", newestPropertyDate),
    staticPage("/project-showcase", 0.85, "weekly"),
    staticPage("/book-site-visit", 0.85, "monthly"),
    staticPage("/about-us", 0.8, "monthly"),
    staticPage("/about-us/who-we-are", 0.75, "monthly"),
    staticPage("/about-us/why-us", 0.75, "monthly"),
    staticPage("/about-us/our-team", 0.75, "monthly"),
    staticPage("/about-us/csr", 0.6, "monthly"),
    staticPage("/about-us/our-partners", 0.6, "monthly"),
    staticPage("/contact-us", 0.85, "monthly"),
    staticPage("/services", 0.85, "monthly"),
    staticPage("/services/residential-properties", 0.8, "monthly"),
    staticPage("/services/commercial-properties", 0.8, "monthly"),
    staticPage("/services/beach-properties", 0.8, "monthly"),
    staticPage("/services/farm-land", 0.8, "monthly"),
    staticPage("/services/affordable-housing", 0.8, "monthly"),
    staticPage("/services/property-management", 0.75, "monthly"),
    staticPage("/services/title-issuance", 0.75, "monthly"),
    staticPage("/iapl-insider", 0.7, "weekly"),
    staticPage("/iapl-insider/blogs", 0.8, "weekly"),
    staticPage("/iapl-insider/news", 0.65, "weekly"),
    staticPage("/iapl-insider/market-research", 0.65, "monthly"),
    staticPage("/testimonials", 0.7, "monthly"),
    staticPage("/testimonials/client-testimonials", 0.65, "monthly"),
    staticPage("/testimonials/video-gallery", 0.65, "monthly"),
    staticPage("/testimonials/newsletters", 0.6, "monthly"),
    staticPage("/testimonials/downloads", 0.6, "monthly"),
    staticPage("/privacy-policy", 0.3, "yearly"),
    staticPage("/terms-of-service", 0.3, "yearly"),
    staticPage("/cookie-policy", 0.3, "yearly"),
  ];

  const propertyRoutes: SitemapEntry[] = [...propertyById.entries()]
    .sort((a, b) => b[0] - a[0])
    .flatMap(([id, property]) => {
      const seo = PROPERTY_SEO.find((entry) => entry.id === id);
      const numbered: SitemapEntry = {
        url: `${SITE_ORIGIN}/for-sale/${id}`,
        ...(property.lastModified ? { lastModified: property.lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority: seo?.slug ? Math.min(property.priority, 0.8) : property.priority,
      };
      if (!seo?.slug) return [numbered];
      return [
        {
          url: `${SITE_ORIGIN}/${seo.slug}`,
          ...(property.lastModified ? { lastModified: property.lastModified } : {}),
          changeFrequency: "weekly" as const,
          priority: property.priority,
        },
        numbered,
      ];
    });

  const blogRoutes: SitemapEntry[] = BLOG_POSTS.filter((post) =>
    BLOG_ARTICLE_SLUGS.has(post.slug)
  ).map((post) => ({
    url: `${SITE_ORIGIN}/iapl-insider/blogs/${post.slug}`,
    lastModified: parseDate(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function buildSitemapXml(): Promise<string> {
  const entries = await getSitemapEntries();

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${toLastmod(entry.lastModified)}</lastmod>`
        : "";

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${lastmod}${entry.changeFrequency ? `\n    <changefreq>${entry.changeFrequency}</changefreq>` : ""}${entry.priority !== undefined ? `\n    <priority>${entry.priority}</priority>` : ""}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
