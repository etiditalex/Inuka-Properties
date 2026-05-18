import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Market Research | Kilifi & Coastal Property Trends",
  description:
    "Data-driven market research on land prices, investment trends, and growth corridors in Kilifi County, Malindi, Mtwapa, and Kenya's coastal region.",
  path: "/iapl-insider/market-research",
});

export default function MarketResearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
