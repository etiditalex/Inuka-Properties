import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Ongoing coastal projects",
  description: String(source.description ?? ""),
  path: "/for-sale/ongoing-projects",
  keywords: source.keywords as string[] | undefined,
});

export default function OngoingProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
