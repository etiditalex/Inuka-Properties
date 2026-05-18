import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Our Partners",
  description:
    "Inuka Afrika Properties partners with leading institutions to deliver secure, affordable land and housing solutions along Kenya's coast.",
  path: "/about-us/our-partners",
});

export default function OurPartnersLayout({ children }: { children: ReactNode }) {
  return children;
}
