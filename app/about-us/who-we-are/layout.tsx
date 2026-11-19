import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Who runs Inuka Properties",
  description: String(source.description ?? ""),
  path: "/about-us/who-we-are",
  keywords: source.keywords as string[] | undefined,
});

export default function WhoWeAreLayout({ children }: { children: ReactNode }) {
  return children;
}
