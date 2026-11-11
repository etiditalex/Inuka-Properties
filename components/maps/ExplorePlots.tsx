"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { PlotMapDocument } from "@/lib/maps/types";

const PlotExplorer = dynamic(() => import("@/components/maps/PlotExplorer"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-dark-100" />,
});

export default function ExplorePlots({ propertyId }: { propertyId: number }) {
  const [document, setDocument] = useState<PlotMapDocument | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/maps/property/${propertyId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { document?: PlotMapDocument } | null) => {
        if (!cancelled) setDocument(body?.document ?? null);
      })
      .catch(() => {
        if (!cancelled) setDocument(null);
      });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (!document) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 font-montserrat text-2xl font-bold text-dark-900">Explore Available Plots</h2>
      <PlotExplorer initial={document} variant="embedded" />
    </section>
  );
}
