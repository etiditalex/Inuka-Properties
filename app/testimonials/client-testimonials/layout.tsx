import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Client Testimonials",
  description:
    "Verified buyer testimonials for Inuka Afrika Properties — land purchases in Kilifi, Malindi, Tezo, Mariakani, and the Kenyan coast.",
  path: "/testimonials/client-testimonials",
});

export default function ClientTestimonialsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
