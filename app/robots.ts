import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { getAdminBasePath } from "@/lib/admin/path";

export default function robots(): MetadataRoute.Robots {
  const adminBase = getAdminBasePath();
  const privatePaths = ["/api/", "/admin/", `${adminBase}/`, "/lp/", "/support"];
  const disallow = [...new Set(privatePaths)];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/for-sale", "/iapl-insider", "/about-us", "/services", "/testimonials"],
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN.replace(/^https?:\/\//, ""),
  };
}
