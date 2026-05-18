import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "IAPL Insider | Real Estate Insights & News",
  description:
    "Market research, investment guides, and coastal Kenya property news from Inuka Afrika Properties — land for sale in Kilifi, Malindi, Mtwapa, and beyond.",
  path: "/iapl-insider",
  keywords: [
    "Kenya real estate blog",
    "Kilifi land investment guide",
    "coastal property news Kenya",
    "Inuka Afrika Properties insights",
  ],
});

export default function IaplInsiderLayout({ children }: { children: ReactNode }) {
  return children;
}
