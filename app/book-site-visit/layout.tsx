import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Book a Site Visit | View Land & Plots in Kilifi County",
  description:
    "Schedule a free site visit to Inuka Afrika property projects in Tezo, Mariakani, Malindi, Bofa, Chumani, and across Kilifi County. See plots before you buy.",
  path: "/book-site-visit",
  keywords: [
    "book property site visit Kenya",
    "land viewing Kilifi",
    "plot site visit Mombasa coast",
    "Inuka Afrika site tour",
  ],
});

export default function BookSiteVisitLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
