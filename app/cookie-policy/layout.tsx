import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "How this site uses cookies",
  description:
    "How Inuka Properties uses cookies on inukaproperties.co.ke, and how you can control them in your browser.",
  path: "/cookie-policy",
});

export default function CookiePolicyLayout({ children }: { children: ReactNode }) {
  return children;
}
