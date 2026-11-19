import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Property management on the coast",
  description: String(source.description ?? ""),
  path: "/services/property-management",
  keywords: source.keywords as string[] | undefined,
});

export default function PropertyManagementLayout({ children }: { children: ReactNode }) {
  return children;
}
