import { buildSitemapXml } from "@/lib/sitemapEntries";

export const revalidate = 3600;

export function GET() {
  const xml = buildSitemapXml();

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
