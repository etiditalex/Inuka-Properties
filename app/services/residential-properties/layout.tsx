import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Residential plots on the coast",
  description: String(source.description ?? ""),
  path: "/services/residential-properties",
  keywords: source.keywords as string[] | undefined,
});

export default function ResidentialPropertiesLayout({ children }: { children: ReactNode }) {
  return children;
}







