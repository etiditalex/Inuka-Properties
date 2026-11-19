import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Website terms of use",
  description: String(source.description ?? ""),
  path: "/terms-of-service",
  keywords: source.keywords as string[] | undefined,
});

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
