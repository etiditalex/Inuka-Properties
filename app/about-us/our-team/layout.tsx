import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Meet the Inuka team",
  description: String(source.description ?? ""),
  path: "/about-us/our-team",
  keywords: source.keywords as string[] | undefined,
});

export default function OurTeamLayout({ children }: { children: ReactNode }) {
  return children;
}
