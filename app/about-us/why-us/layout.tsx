import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Why Choose Inuka Afrika Properties",
  description:
    "Discover why buyers trust Inuka Afrika for verified title deeds, flexible installment plans, prime coastal locations, and transparent property sales in Kilifi County.",
  path: "/about-us/why-us",
  keywords: [
    "why buy land Inuka Afrika",
    "trusted land selling company Kenya",
    "title deed verification Kenya",
    "flexible land payment plans",
  ],
});

export default function WhyUsLayout({ children }: { children: ReactNode }) {
  return children;
}
