"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { formatKes, PLOT_STYLE, statusLabel } from "@/lib/maps/colors";
import type { PlotMapHandle } from "@/components/maps/PlotMapCanvas";
import { placedCornersMatch, projectSheet } from "@/lib/maps/publish";
import type { MapPlot, PlotMapDocument, PlotStatus } from "@/lib/maps/types";
import { whatsAppUrl } from "@/lib/whatsapp";

const PlotMapCanvas = dynamic(() => import("@/components/maps/PlotMapCanvas"), { ssr: false });

const STATUSES: PlotStatus[] = ["available", "reserved", "sold", "on_hold"];

type PlotExplorerProps = {
  initial: PlotMapDocument;
  variant?: "page" | "embedded";
};

export default function PlotExplorer({ initial, variant = "page" }: PlotExplorerProps) {
  const [document, setDocument] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [hidden, setHidden] = useState<PlotStatus[]>([]);
  const mapRef = useRef<PlotMapHandle>(null);
  const placedCorners = document.controlPoints.filter((point) => point.ground).length;

  useEffect(() => {
    const refresh = () => {
      fetch(`/api/maps/${document.slug}`, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((body: { document?: PlotMapDocument } | null) => {
          if (body?.document) setDocument(body.document);
        })
        .catch(() => undefined);
    };
    const timer = window.setInterval(refresh, 20000);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [document.slug]);

  const counts = useMemo(() => {
    const tally = { available: 0, reserved: 0, sold: 0, on_hold: 0 };
    document.plots.forEach((plot) => {
      tally[plot.status] += 1;
    });
    return tally;
  }, [document.plots]);

  const selected = document.plots.find((plot) => plot.plotNumber === selectedId) ?? null;
  const cornersAlreadyDrawn = placedCornersMatch(document);
  const fitted = useMemo(() => {
    if (cornersAlreadyDrawn || placedCorners < 2) return null;
    try {
      return projectSheet(document);
    } catch {
      return null;
    }
  }, [document, placedCorners, cornersAlreadyDrawn]);
  const georeferenced =
    cornersAlreadyDrawn || Boolean(fitted) || (document.alignmentStatus === "verified" && document.crs === "EPSG:4326");
  const planPlots = georeferenced
    ? (fitted?.plots ?? document.plots)
    : document.plots.flatMap((plot) => {
        const ring = plot.planRing ?? (document.crs === "local-metres" ? plot.ring : null);
        return ring ? [{ ...plot, ring }] : [];
      });
  const planRoads = georeferenced
    ? (fitted?.roads ?? document.roads)
    : document.roads.flatMap((road) => {
        const ring = road.planRing ?? (document.crs === "local-metres" ? road.ring : null);
        return ring ? [{ ...road, ring }] : [];
      });
  const planBoundary = georeferenced
    ? (fitted?.boundary ?? document.boundary)
    : (document.planBoundary ?? (document.crs === "local-metres" ? document.boundary : null));
  const cornerMarkers = georeferenced
    ? document.controlPoints.flatMap((point) =>
        point.ground ? [{ id: point.id, position: point.ground, label: point.label }] : []
      )
    : [];
  const waitingForSurvey = !georeferenced && planPlots.length === 0;

  const findPlot = () => {
    const text = query.trim().toLowerCase().replace(/^plot\s+/, "");
    const plot =
      document.plots.find((item) => item.plotNumber.toLowerCase() === text) ??
      document.plots.find((item) => item.plotNumber === text.replace(/\D/g, ""));
    if (!plot) {
      setMessage("No plot with that number.");
      return;
    }
    setMessage("");
    setSelectedId(plot.plotNumber);
    mapRef.current?.fit(plot.plotNumber);
  };

  const toggleStatus = (status: PlotStatus) => {
    setHidden((current) => (current.includes(status) ? current.filter((item) => item !== status) : [...current, status]));
  };

  const details = (
    <div className="bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Explore available plots</p>
      <h2 className="mt-1 font-montserrat text-xl font-bold text-dark-900">{document.projectName}</h2>
      <p className="text-sm text-dark-600">
        {document.plots.length} plots · {document.location}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => toggleStatus(status)}
            className={`rounded-full border px-2.5 py-1 ${hidden.includes(status) ? "border-dark-200 text-dark-400 line-through" : "border-dark-300 text-dark-800"}`}
          >
            <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: PLOT_STYLE[status].fill }} />
            {counts[status]} {statusLabel(status)}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          findPlot();
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Plot number"
          className="w-full rounded-lg border border-dark-200 px-3 py-2 text-sm"
          aria-label="Find a plot number"
        />
        <button type="submit" className="rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white">
          Find
        </button>
      </form>
      {message ? <p className="mt-2 text-sm text-red-700">{message}</p> : null}
      {!georeferenced ? (
        <p className="mt-3 text-sm leading-relaxed text-dark-700">
          This is the survey drawing{document.surveyRef ? ` for ${document.surveyRef}` : ""}. The corners are not on the satellite image yet.
        </p>
      ) : (
        <p className="mt-3 text-sm text-dark-700">The plots are drawn on the satellite image from the confirmed survey corners.</p>
      )}
      {variant === "embedded" ? (
        <Link href={`/maps/${document.slug}`} className="mt-3 inline-block text-sm font-semibold text-primary-700">
          Open the full map
        </Link>
      ) : null}
      {selected ? (
        <PlotCard plot={selected} projectName={document.projectName} onClose={() => setSelectedId(null)} />
      ) : null}
    </div>
  );

  const map = (
    <div className={variant === "page" ? "relative min-h-0 flex-1" : "relative h-[70vh] min-h-[520px]"}>
      {waitingForSurvey ? (
        <div className="flex h-full items-center justify-center bg-dark-50 p-8 text-center text-sm text-dark-700">
          This project is waiting for a confirmed survey alignment before plots are shown on the map.
        </div>
      ) : (
        <PlotMapCanvas
          ref={mapRef}
          plots={planPlots}
          roads={planRoads}
          boundary={planBoundary}
          crs={georeferenced ? "EPSG:4326" : "local-metres"}
          satellite={georeferenced}
          selected={selectedId}
          hiddenStatuses={hidden}
          onSelect={setSelectedId}
          markers={cornerMarkers}
          cooperativeGestures={variant === "embedded"}
        />
      )}
      <div className="absolute bottom-8 left-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-dark-700 shadow">
        {georeferenced ? "Satellite" : "Plan view"}
      </div>
    </div>
  );

  if (variant === "page") {
    return (
      <div className="flex h-full min-h-0 flex-col lg:flex-row">
        <div className="max-h-[42vh] shrink-0 overflow-auto border-b border-dark-200 lg:max-h-none lg:w-96 lg:border-b-0 lg:border-r">{details}</div>
        {map}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-dark-200">
      <div className="border-b border-dark-200">{details}</div>
      {map}
    </div>
  );
}

function PlotCard({
  plot,
  projectName,
  onClose,
}: {
  plot: MapPlot;
  projectName: string;
  onClose: () => void;
}) {
  const enquiry = whatsAppUrl(
    `Hi, I am interested in plot ${plot.plotNumber} at ${projectName}. Is it still available?`
  );
  return (
    <aside className="mt-4 border-t border-dark-200 pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">{projectName}</p>
          <h3 className="font-montserrat text-2xl font-bold text-dark-900">Plot {plot.plotNumber}</h3>
        </div>
        <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm text-dark-500" aria-label="Close plot details">
          Close
        </button>
      </div>
      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-dark-800">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: PLOT_STYLE[plot.status].fill }} />
        {statusLabel(plot.status)}
      </p>
      <dl className="mt-3 space-y-2 text-sm text-dark-700">
        <div className="flex justify-between gap-3">
          <dt>Size</dt>
          <dd className="text-right font-semibold text-dark-900">{plot.areaM2.toLocaleString("en-KE")} m²</dd>
        </div>
        {plot.frontageM != null ? (
          <div className="flex justify-between gap-3">
            <dt>Frontage</dt>
            <dd>{plot.frontageM} m</dd>
          </div>
        ) : null}
        {plot.depthM != null ? (
          <div className="flex justify-between gap-3">
            <dt>Depth</dt>
            <dd>{plot.depthM} m</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <dt>Price</dt>
          <dd className="font-semibold text-dark-900">{plot.priceKes != null ? formatKes(plot.priceKes) : "Not set"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Deposit</dt>
          <dd>{plot.depositKes != null ? formatKes(plot.depositKes) : "Not set"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Payment period</dt>
          <dd className="text-right">{plot.paymentPeriod ?? "Not set"}</dd>
        </div>
      </dl>
      {plot.dimensionNote ? <p className="mt-3 text-xs leading-relaxed text-dark-500">{plot.dimensionNote}</p> : null}
      {plot.status !== "sold" ? (
        <a
          href={enquiry}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          WhatsApp about this plot
        </a>
      ) : (
        <p className="mt-4 text-sm text-dark-600">This plot has been sold.</p>
      )}
    </aside>
  );
}
