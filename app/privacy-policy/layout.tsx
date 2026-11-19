import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "How we handle your data",
  description: String(source.description ?? ""),
  path: "/privacy-policy",
  keywords: source.keywords as string[] | undefined,
});

export default function PrivacyPolicyLayout({ children }: { children: ReactNode }) {
  return children;
}
