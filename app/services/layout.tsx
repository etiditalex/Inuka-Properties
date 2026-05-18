import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { servicesMetadata } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Real Estate Services in Kilifi County",
  description:
    "Residential plots, commercial property, beach land, farm land, affordable housing, property management, and title deed issuance across Kilifi, Malindi, Mtwapa, and coastal Kenya.",
  path: "/services",
  keywords: servicesMetadata.keywords as string[] | undefined,
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
