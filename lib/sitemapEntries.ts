import type { MetadataRoute } from "next";
import { BLOG_ARTICLE_SLUGS, BLOG_POSTS } from "@/lib/blogPosts";
import { PROPERTY_SEO } from "@/lib/propertySeo";
import { SITE_ORIGIN } from "@/lib/site";

type SitemapEntry = MetadataRoute.Sitemap[number];

function staticPage(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "monthly"
): SitemapEntry {
  return {
    url: `${SITE_ORIGIN}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const staticRoutes: SitemapEntry[] = [
    staticPage("", 1, "weekly"),
    staticPage("/for-sale", 0.95, "daily"),
    staticPage("/for-sale/ongoing-projects", 0.9, "daily"),
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

  const propertyRoutes: SitemapEntry[] = PROPERTY_SEO.map((property) => ({
    url: `${SITE_ORIGIN}/for-sale/${property.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: property.soldOut ? 0.4 : 0.85,
  }));

  const blogRoutes: SitemapEntry[] = BLOG_POSTS.filter((post) =>
    BLOG_ARTICLE_SLUGS.has(post.slug)
  ).map((post) => ({
    url: `${SITE_ORIGIN}/iapl-insider/blogs/${post.slug}`,
    lastModified: new Date(post.date),
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

export function buildSitemapXml(): string {
  const entries = getSitemapEntries();

  const urls = entries
    .map((entry) => {
      const lastmod =
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : entry.lastModified
            ? new Date(entry.lastModified).toISOString()
            : new Date().toISOString();

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${lastmod}</lastmod>${entry.changeFrequency ? `\n    <changefreq>${entry.changeFrequency}</changefreq>` : ""}${entry.priority !== undefined ? `\n    <priority>${entry.priority}</priority>` : ""}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
