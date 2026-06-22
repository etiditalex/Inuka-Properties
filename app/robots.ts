import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { getAdminBasePath } from "@/lib/admin/path";

export default function robots(): MetadataRoute.Robots {
  const adminBase = getAdminBasePath();
  const disallow = ["/api/", "/admin/", `${adminBase}/`];
  const unique = [...new Set(disallow)];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: unique,
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN.replace(/^https?:\/\//, ""),
  };
}
