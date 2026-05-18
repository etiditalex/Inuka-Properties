import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Us | Coastal Kenya Real Estate Since 2016",
  description:
    "Inuka Afrika Properties Limited — 10+ years delivering affordable land and housing across Kilifi County. Meet our team, partners, and CSR initiatives on Kenya's coast.",
  path: "/about-us",
  keywords: [
    "about Inuka Afrika Properties",
    "real estate company Kilifi",
    "property developer Kenya coast",
    "affordable land Kenya",
  ],
});

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return children;
}
