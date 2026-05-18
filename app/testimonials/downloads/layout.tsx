import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Downloads & Resources",
  description:
    "Download brochures, payment plans, and project guides for Inuka Afrika Properties land and housing developments in Kilifi County.",
  path: "/testimonials/downloads",
});

export default function DownloadsLayout({ children }: { children: ReactNode }) {
  return children;
}
