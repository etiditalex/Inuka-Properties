"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureFacebookLandingParams } from "@/lib/leads/contactAutofill";

function FacebookAdLandingCaptureInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureFacebookLandingParams(searchParams);
  }, [searchParams]);

  return null;
}

/** Captures Facebook ad click params as soon as the landing page loads. */
export default function FacebookAdLandingCapture() {
  return (
    <Suspense fallback={null}>
      <FacebookAdLandingCaptureInner />
    </Suspense>
  );
}
