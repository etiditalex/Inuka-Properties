import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { metadata as source } from "./metadata";

export const metadata = buildPageMetadata({
  title: "Contact the Nyali office",
  description: String(source.description ?? ""),
  path: "/contact-us",
  keywords: source.keywords as string[] | undefined,
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
