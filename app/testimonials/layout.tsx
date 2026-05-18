import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Client Testimonials & Reviews",
  description:
    "Read reviews and success stories from Inuka Afrika Properties buyers who purchased land and homes across Kilifi County and coastal Kenya.",
  path: "/testimonials",
});

export default function TestimonialsLayout({ children }: { children: ReactNode }) {
  return children;
}
