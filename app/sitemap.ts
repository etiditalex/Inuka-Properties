import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemapEntries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
