import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemapEntries";

export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
