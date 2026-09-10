"use client";

import FacebookLandingPage from "@/components/landing/FacebookLandingPage";
import type { ClientTestimonial, LandingPage, Property } from "@/lib/supabase/types";

type LandingPagePreviewProps = {
  page: Partial<LandingPage>;
  property?: Property | null;
  testimonials?: ClientTestimonial[];
};

export default function LandingPagePreview({
  page,
  property,
  testimonials = [],
}: LandingPagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200 bg-neutral-100 shadow-sm">
      <div className="border-b border-dark-200 bg-dark-900 px-4 py-2">
        <p className="text-xs font-medium text-white/60">Live preview — Facebook landing page</p>
        <p className="text-[10px] text-white/40">
          {page.published ? "Published" : "Draft"} · /lp/{page.slug || "your-slug"}
        </p>
      </div>
      <div className="max-h-[920px] overflow-y-auto">
        <div className="pointer-events-none">
          <FacebookLandingPage page={page} property={property} testimonials={testimonials} preview />
        </div>
      </div>
    </div>
  );
}
