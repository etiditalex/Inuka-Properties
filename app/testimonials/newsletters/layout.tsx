import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Newsletters",
  description:
    "Inuka Afrika Properties newsletters — coastal Kenya market updates, new project launches, and land investment opportunities.",
  path: "/testimonials/newsletters",
});

export default function NewslettersLayout({ children }: { children: ReactNode }) {
  return children;
}
