"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { captureFacebookLandingParams } from "@/lib/leads/contactAutofill";
import { autoCaptureLeadFromVisit } from "@/lib/leads/captureLead";

function ContactAutoCaptureInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    captureFacebookLandingParams(searchParams);
    void autoCaptureLeadFromVisit(searchParams);
  }, [searchParams, pathname]);

  return null;
}

/** Captures ad/URL contact details site-wide and saves leads automatically when available. */
export default function ContactAutoCapture() {
  return (
    <Suspense fallback={null}>
      <ContactAutoCaptureInner />
    </Suspense>
  );
}
