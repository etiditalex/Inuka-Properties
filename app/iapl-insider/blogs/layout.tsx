import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Property & Land Investment Blog | Kilifi & Coastal Kenya",
  description:
    "Expert articles on land for sale in Kilifi County, coastal investment trends, title deeds, Tezo, Malindi, Kikambala, and affordable plots in Kenya.",
  path: "/iapl-insider/blogs",
  keywords: [
    "land for sale Kilifi blog",
    "coastal Kenya property investment",
    "buy land Kenya guide",
    "Kilifi real estate news",
  ],
});

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return children;
}
