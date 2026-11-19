import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Commercial land on the coast",
  description: String(source.description ?? ""),
  path: "/services/commercial-properties",
  keywords: source.keywords as string[] | undefined,
});

export default function CommercialPropertiesLayout({ children }: { children: ReactNode }) {
  return children;
}
