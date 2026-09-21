import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Get Property Details",
  description:
    "Request pricing, payment plans, and plot availability for Inuka Afrika Properties land in Kilifi County. We email full project details as soon as you submit your contact information.",
  path: "/get-property-details",
  keywords: [
    "get property details Kilifi",
    "land payment plan Kenya",
    "Inuka Afrika Properties brochure",
  ],
});

export default function GetPropertyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
