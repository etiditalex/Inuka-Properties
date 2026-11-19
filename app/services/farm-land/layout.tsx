import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Farm plots on the Kenya coast",
  description: String(source.description ?? ""),
  path: "/services/farm-land",
  keywords: source.keywords as string[] | undefined,
});

export default function FarmLandLayout({ children }: { children: ReactNode }) {
  return children;
}
