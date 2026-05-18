import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Corporate Social Responsibility",
  description:
    "See how Inuka Afrika Properties gives back to coastal communities through CSR programmes in education, environment, and local development across Kilifi County.",
  path: "/about-us/csr",
});

export default function CsrLayout({ children }: { children: ReactNode }) {
  return children;
}
