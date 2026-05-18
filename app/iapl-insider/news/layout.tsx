import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Real Estate News | Coastal Kenya",
  description:
    "Latest property and land news from Kilifi County, Mombasa coast, and Kenya's real estate market — updates from Inuka Afrika Properties.",
  path: "/iapl-insider/news",
});

export default function NewsLayout({ children }: { children: ReactNode }) {
  return children;
}
