import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Inuka Properties",
    description:
      "Land and property for sale in Kilifi County, Kenya — affordable coastal plots with title deeds.",
    start_url: SITE_ORIGIN,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b91c1c",
    icons: [
      {
        src: DEFAULT_OG_IMAGE,
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
