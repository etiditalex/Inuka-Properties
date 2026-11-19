import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Beach plots on the Kenya coast",
  description: String(source.description ?? ""),
  path: "/services/beach-properties",
  keywords: source.keywords as string[] | undefined,
});

export default function BeachPropertiesLayout({ children }: { children: ReactNode }) {
  return children;
}
