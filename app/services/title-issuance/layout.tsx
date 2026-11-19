import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Title deed processing",
  description: String(source.description ?? ""),
  path: "/services/title-issuance",
  keywords: source.keywords as string[] | undefined,
});

export default function TitleIssuanceLayout({ children }: { children: ReactNode }) {
  return children;
}







