"use client";

import { useEffect } from "react";
import { trackFacebookEvent } from "@/lib/facebook/trackClient";

type FacebookPixelInitProps = {
  propertyId?: number;
  pagePath?: string;
};

export default function FacebookPixelInit({ propertyId, pagePath }: FacebookPixelInitProps) {
  useEffect(() => {
    trackFacebookEvent(
      "PageView",
      {
        property_id: propertyId ?? null,
        page_path: pagePath ?? window.location.pathname,
      },
      { skipFbq: true }
    );
  }, [propertyId, pagePath]);

  return null;
}
