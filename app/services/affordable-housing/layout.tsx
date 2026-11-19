import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Affordable coastal plot options",
  description: String(source.description ?? ""),
  path: "/services/affordable-housing",
  keywords: source.keywords as string[] | undefined,
});

export default function AffordableHousingLayout({ children }: { children: ReactNode }) {
  return children;
}
