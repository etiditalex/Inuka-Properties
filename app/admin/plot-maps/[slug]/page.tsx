"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PlotMapEditor from "@/components/admin/plot-maps/PlotMapEditor";
import type { PlotMapDocument } from "@/lib/maps/types";

export default function EditPlotMapPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [document, setDocument] = useState<PlotMapDocument | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/plot-maps/${slug}`)
      .then(async (response) => {
        const body = (await response.json()) as { document?: PlotMapDocument; error?: string };
        if (!response.ok || !body.document) {
          setError(body.error ?? "This plot map was not found.");
          return;
        }
        setDocument(body.document);
      })
      .catch(() => setError("This plot map could not be loaded."));
  }, [slug]);

  return (
    <AdminShell title="Plot map" subtitle={document?.projectName ?? "Loading"}>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {document ? <PlotMapEditor initial={document} /> : null}
      {!document && !error ? <p className="text-sm text-dark-500">Loading the plot map…</p> : null}
    </AdminShell>
  );
}
