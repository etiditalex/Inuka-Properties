"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { adminPath } from "@/lib/admin/path";
import type { PlotMapHandle } from "@/components/maps/PlotMapCanvas";
import { formatKes, PLOT_STYLE, statusLabel } from "@/lib/maps/colors";
import { findOverlaps, ringArea } from "@/lib/maps/geometry";
import { applySimilarity, residualMetres, similarityFromControl, toEnu } from "@/lib/maps/georef";
import { parseGeoJson, parseKml } from "@/lib/maps/parseImport";
import type { MapPlot, PlotMapDocument, PlotStatus, Position, Similarity } from "@/lib/maps/types";

type AlignmentPreview =
  | { transform: Similarity; residuals: { label: string; metres: number }[] }
  | { error: string };

const PlotMapCanvas = dynamic(() => import("@/components/maps/PlotMapCanvas"), { ssr: false });

const STATUSES: PlotStatus[] = ["available", "reserved", "sold", "on_hold"];

function areaOf(ring: Position[], geographic: boolean): number {
  const metres = geographic ? ring.map((point) => toEnu(point, ring[0])) : ring;
  return Math.round(ringArea(metres) * 10) / 10;
}

export default function PlotMapEditor({ initial }: { initial: PlotMapDocument }) {
  const [doc, setDoc] = useState(initial);
  const [past, setPast] = useState<PlotMapDocument[]>([]);
  const [future, setFuture] = useState<PlotMapDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(doc.plots[0]?.plotNumber ?? null);
  const [placingId, setPlacingId] = useState<string | null>(null);
  const [draw, setDraw] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [overlaps, setOverlaps] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmAlignment, setConfirmAlignment] = useState(false);
  const planRef = useRef<PlotMapHandle>(null);
  const satelliteRef = useRef<PlotMapHandle>(null);

  const selected = doc.plots.find((plot) => plot.plotNumber === selectedId) ?? null;
  const placed = doc.controlPoints.filter((point) => point.ground);
  const hasSheet = doc.crs === "local-metres" || doc.plots.some((plot) => plot.planRing);

  const preview = useMemo((): AlignmentPreview | null => {
    if (placed.length < 2) return null;
    try {
      const transform = similarityFromControl(placed[0].plan, placed[0].ground!, placed[1].plan, placed[1].ground!);
      const residuals = placed.slice(2).map((point) => ({
        label: point.label,
        metres: residualMetres(transform, point.plan, point.ground!),
      }));
      return { transform, residuals };
    } catch (caught) {
      return { error: caught instanceof Error ? caught.message : "Those two corners cannot fix the alignment." };
    }
  }, [placed]);

  const planPlots = doc.plots.flatMap((plot) => {
    const ring = plot.planRing ?? (doc.crs === "local-metres" ? plot.ring : null);
    return ring ? [{ ...plot, ring }] : [];
  });
  const planRoads = doc.roads.flatMap((road) => {
    const ring = road.planRing ?? (doc.crs === "local-metres" ? road.ring : null);
    return ring ? [{ ...road, ring }] : [];
  });
  const planBoundary = doc.planBoundary ?? (doc.crs === "local-metres" ? doc.boundary : null);

  const previewTransform = preview && "transform" in preview ? preview.transform : null;
  const satellitePlots = previewTransform
    ? doc.plots.flatMap((plot) => {
        const source = plot.planRing ?? (doc.crs === "local-metres" ? plot.ring : null);
        if (!source) return doc.crs === "EPSG:4326" ? [plot] : [];
        return [{ ...plot, ring: applySimilarity(previewTransform, source) }];
      })
    : doc.crs === "EPSG:4326"
      ? doc.plots
      : [];
  const satelliteRoads = previewTransform
    ? doc.roads.flatMap((road) => {
        const source = road.planRing ?? (doc.crs === "local-metres" ? road.ring : null);
        return source ? [{ ...road, ring: applySimilarity(previewTransform, source) }] : [];
      })
    : doc.crs === "EPSG:4326"
      ? doc.roads
      : [];

  const commit = (next: PlotMapDocument) => {
    setPast((items) => [...items, doc].slice(-40));
    setFuture([]);
    setDoc(next);
    setOverlaps([]);
  };

  const undo = () => {
    setPast((items) => {
      const previous = items[items.length - 1];
      if (!previous) return items;
      setFuture((queue) => [doc, ...queue]);
      setDoc(previous);
      return items.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((items) => {
      const [next, ...rest] = items;
      if (!next) return items;
      setPast((history) => [...history, doc].slice(-40));
      setDoc(next);
      return rest;
    });
  };

  const updatePlot = (plotNumber: string, patch: Partial<MapPlot>) => {
    commit({
      ...doc,
      plots: doc.plots.map((plot) => (plot.plotNumber === plotNumber ? { ...plot, ...patch } : plot)),
    });
  };

  const onPlanRing = (plotNumber: string, ring: Position[]) => {
    updatePlot(plotNumber, {
      planRing: ring,
      ring: doc.crs === "local-metres" ? ring : selected?.ring ?? ring,
      areaM2: areaOf(ring, false),
    });
  };

  const addPlot = (ring: Position[], geographic: boolean) => {
    const numbers = doc.plots.map((plot) => Number(plot.plotNumber)).filter((value) => Number.isInteger(value));
    const plotNumber = String((numbers.length ? Math.max(...numbers) : 0) + 1);
    const plot: MapPlot = {
      plotNumber,
      status: "available",
      areaM2: areaOf(ring, geographic),
      frontageM: null,
      depthM: null,
      priceKes: null,
      depositKes: null,
      paymentPeriod: null,
      ring: geographic ? ring : ring,
      planRing: geographic ? null : ring,
      dimensionNote: null,
    };
    commit({
      ...doc,
      geometrySource: doc.plots.length ? doc.geometrySource : "drawn",
      plots: [...doc.plots, plot],
    });
    setSelectedId(plotNumber);
    setDraw(false);
  };

  const placeCorner = (position: Position) => {
    if (!placingId) return;
    commit({
      ...doc,
      alignmentStatus: "draft",
      transform: null,
      controlPoints: doc.controlPoints.map((point) => (point.id === placingId ? { ...point, ground: position } : point)),
    });
    setPlacingId(null);
    setConfirmAlignment(false);
  };

  const importFile = async (file: File) => {
    setError("");
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith(".kml") ? parseKml(text) : parseGeoJson(text);
      commit({
        ...doc,
        crs: parsed.crs,
        plots: parsed.plots,
        alignmentStatus: parsed.crs === "EPSG:4326" ? "draft" : "unverified",
        geometrySource: "imported",
        transform: null,
        roads: parsed.crs === "local-metres" ? doc.roads : [],
        boundary: parsed.crs === "local-metres" ? doc.boundary : null,
        planBoundary: parsed.crs === "local-metres" ? doc.planBoundary : null,
      });
      setSelectedId(parsed.plots[0]?.plotNumber ?? null);
      setNotice(`${parsed.plots.length} plots imported as ${parsed.crs === "EPSG:4326" ? "longitude and latitude" : "sheet metres"}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The file could not be read.");
    }
  };

  const checkOverlaps = () => {
    const issues = findOverlaps(
      doc.plots.map((plot) => ({ plotNumber: plot.plotNumber, ring: plot.ring })),
      doc.crs
    );
    setOverlaps(issues);
    setNotice(issues.length ? "" : "No overlapping plots.");
  };

  const save = async (publishAlignment: boolean) => {
    setSaving(true);
    setError("");
    setNotice("");
    let payload = doc;
    if (previewTransform) payload = { ...doc, transform: previewTransform };
    if (publishAlignment) payload = { ...payload, alignmentStatus: "verified" };
    const response = await fetch(`/api/admin/plot-maps/${doc.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, confirmAlignment: publishAlignment }),
    });
    const body = (await response.json()) as { document?: PlotMapDocument; error?: string; migrationRequired?: boolean };
    setSaving(false);
    if (!response.ok || !body.document) {
      setError(body.error ?? "The map was not saved.");
      return;
    }
    setDoc(body.document);
    setPast([]);
    setFuture([]);
    setNotice(
      body.document.alignmentStatus === "verified"
        ? "Saved. The public map can draw these plots on the satellite image."
        : "Saved. The public map still uses the survey drawing until you confirm the ground corners."
    );
  };

  const markers = doc.controlPoints.flatMap((point) =>
    point.ground ? [{ id: point.id, position: point.ground, label: point.label }] : []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={adminPath("plot-maps")} className="text-sm font-semibold text-primary-700">
            All plot maps
          </Link>
          <h2 className="font-montserrat text-2xl font-bold text-dark-900">{doc.projectName}</h2>
          <p className="text-sm text-dark-600">
            {doc.alignmentStatus === "verified"
              ? "Ground corners are confirmed."
              : doc.alignmentStatus === "draft"
                ? "Draft alignment. It is not on the public satellite map."
                : "Ground position is not set."}
            {doc.surveyRef ? ` ${doc.surveyRef}.` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={undo} disabled={!past.length} className="rounded-lg border border-dark-200 px-3 py-2 text-sm disabled:opacity-40">
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!future.length} className="rounded-lg border border-dark-200 px-3 py-2 text-sm disabled:opacity-40">
            Redo
          </button>
          <button type="button" onClick={checkOverlaps} className="rounded-lg border border-dark-200 px-3 py-2 text-sm">
            Check overlaps
          </button>
          <button type="button" onClick={() => save(false)} disabled={saving} className="rounded-lg bg-dark-900 px-3 py-2 text-sm font-semibold text-white">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
      {notice ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{notice}</p> : null}
      {overlaps.length ? (
        <ul className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {overlaps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setDraw((value) => !value);
            setPlacingId(null);
          }}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${draw ? "bg-primary-700 text-white" : "border border-dark-200"}`}
        >
          {draw ? "Stop drawing" : "Draw a plot"}
        </button>
        {draw && draftCount >= 3 ? (
          <button
            type="button"
            className="rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => {
              const ring = (hasSheet ? planRef : satelliteRef).current?.finishDraw();
              if (ring) addPlot(ring, !hasSheet);
              setDraftCount(0);
            }}
          >
            Finish plot
          </button>
        ) : null}
        <label className="cursor-pointer rounded-lg border border-dark-200 px-3 py-2 text-sm font-semibold">
          Import GeoJSON or KML
          <input
            type="file"
            accept=".geojson,.json,.kml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importFile(file);
              event.target.value = "";
            }}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={doc.published}
            onChange={(event) => setDoc({ ...doc, published: event.target.checked })}
          />
          Visible on the listing
        </label>
      </div>
      <p className="text-sm text-dark-600">
        A PDF has no coordinates. Export the survey from QGIS as GeoJSON in WGS 84 (EPSG:4326), or place two corners of this drawing on the satellite image.
      </p>

      <div className={`grid gap-4 ${hasSheet ? "xl:grid-cols-2" : ""}`}>
        {hasSheet ? (
          <section className="overflow-hidden rounded-xl border border-dark-200">
            <div className="border-b border-dark-200 px-3 py-2 text-sm font-semibold text-dark-800">Survey drawing</div>
            <div className="h-[480px]">
              <PlotMapCanvas
                ref={planRef}
                plots={planPlots}
                roads={planRoads}
                boundary={planBoundary}
                crs="local-metres"
                satellite={false}
                selected={selectedId}
                onSelect={setSelectedId}
                editVertices
                onRingChange={onPlanRing}
                draw={draw}
                onDraftChange={(ring) => setDraftCount(ring.length)}
                onDrawComplete={(ring) => addPlot(ring, false)}
              />
            </div>
          </section>
        ) : null}
        <section className="overflow-hidden rounded-xl border border-dark-200">
          <div className="border-b border-dark-200 px-3 py-2 text-sm font-semibold text-dark-800">
            {previewTransform ? "Satellite preview, not published" : "Satellite"}
          </div>
          <div className="h-[480px]">
            <PlotMapCanvas
              ref={satelliteRef}
              plots={satellitePlots}
              roads={satelliteRoads}
              crs="EPSG:4326"
              satellite
              selected={selectedId}
              onSelect={hasSheet ? undefined : setSelectedId}
              editVertices={!hasSheet}
              onRingChange={
                hasSheet
                  ? undefined
                  : (plotNumber, ring) => updatePlot(plotNumber, { ring, areaM2: areaOf(ring, true) })
              }
              draw={draw && !hasSheet}
              onDraftChange={(ring) => setDraftCount(ring.length)}
              onDrawComplete={(ring) => addPlot(ring, true)}
              clickMode={placingId ? "place" : "select"}
              onMapClick={placeCorner}
              markers={markers}
              initialCenter={doc.cameraHint ? [doc.cameraHint.lng, doc.cameraHint.lat] : null}
            />
          </div>
          {doc.cameraHint ? <p className="px-3 py-2 text-xs text-dark-500">{doc.cameraHint.label}</p> : null}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-dark-200 p-4">
          <h3 className="font-semibold text-dark-900">Ground corners</h3>
          <p className="mt-1 text-sm text-dark-600">Choose a corner, then click the same place on the satellite image.</p>
          <ul className="mt-3 space-y-2">
            {doc.controlPoints.map((point) => (
              <li key={point.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {point.label}
                  {point.ground ? <span className="ml-2 text-emerald-700">Placed</span> : null}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPlacingId(point.id);
                    setDraw(false);
                  }}
                  className={`rounded-md px-2 py-1 ${placingId === point.id ? "bg-primary-700 text-white" : "border border-dark-200"}`}
                >
                  {placingId === point.id ? "Click the satellite" : "Place"}
                </button>
              </li>
            ))}
            {!doc.controlPoints.length ? <li className="text-sm text-dark-500">Import a survey file, or draw plots on the satellite image.</li> : null}
          </ul>
          {preview && "error" in preview ? <p className="mt-3 text-sm text-red-700">{preview.error}</p> : null}
          {preview && "residuals" in preview && preview.residuals.length ? (
            <ul className="mt-3 text-sm text-dark-700">
              {preview.residuals.map((item) => (
                <li key={item.label}>
                  {item.label}: {item.metres.toFixed(1)} m from the clicked point
                </li>
              ))}
            </ul>
          ) : null}
          <label className="mt-4 flex items-start gap-2 text-sm text-dark-800">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmAlignment}
              onChange={(event) => setConfirmAlignment(event.target.checked)}
            />
            These corners match the survey. Publish the plots on the satellite map.
          </label>
          <button
            type="button"
            disabled={!confirmAlignment || placed.length < 2 || saving || Boolean(preview && "error" in preview)}
            onClick={() => save(true)}
            className="mt-3 rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Publish alignment
          </button>
        </section>

        <section className="rounded-xl border border-dark-200 p-4">
          <h3 className="font-semibold text-dark-900">{selected ? `Plot ${selected.plotNumber}` : "Plot details"}</h3>
          {selected ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Number
                <input
                  value={selected.plotNumber}
                  onChange={(event) => {
                    const plotNumber = event.target.value;
                    updatePlot(selected.plotNumber, { plotNumber });
                    setSelectedId(plotNumber);
                  }}
                  className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Status
                <select
                  value={selected.status}
                  onChange={async (event) => {
                    const status = event.target.value as PlotStatus;
                    if (status === "reserved" && selected.status === "available") {
                      const response = await fetch(`/api/admin/plot-maps/${doc.slug}/reserve`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ plotNumber: selected.plotNumber }),
                      });
                      if (response.status === 409) {
                        const body = (await response.json()) as { error?: string };
                        setError(body.error ?? `Plot ${selected.plotNumber} is no longer available.`);
                        return;
                      }
                    }
                    updatePlot(selected.plotNumber, { status });
                  }}
                  className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Price (KES)
                <input
                  value={selected.priceKes ?? ""}
                  onChange={(event) => updatePlot(selected.plotNumber, { priceKes: event.target.value ? Number(event.target.value) : null })}
                  className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Deposit (KES)
                <input
                  value={selected.depositKes ?? ""}
                  onChange={(event) => updatePlot(selected.plotNumber, { depositKes: event.target.value ? Number(event.target.value) : null })}
                  className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Payment period
                <input
                  value={selected.paymentPeriod ?? ""}
                  onChange={(event) => updatePlot(selected.plotNumber, { paymentPeriod: event.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
                />
              </label>
              <p className="text-sm text-dark-600 sm:col-span-2">
                {selected.areaM2.toLocaleString("en-KE")} m²
                {selected.priceKes != null ? ` · ${formatKes(selected.priceKes)}` : ""}
                <span className="ml-2 inline-block h-2 w-2 rounded-full" style={{ background: PLOT_STYLE[selected.status].fill }} />
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-dark-600">Select a plot on the drawing.</p>
          )}
          <label className="mt-4 block text-sm">
            Notes
            <textarea
              value={doc.notes.join("\n")}
              onChange={(event) => setDoc({ ...doc, notes: event.target.value.split("\n").filter(Boolean) })}
              rows={4}
              className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
            />
          </label>
        </section>
      </div>

      {doc.sheetImage ? (
        <section>
          <h3 className="mb-2 font-semibold text-dark-900">Scanned sheet</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={doc.sheetImage} alt={`${doc.projectName} survey sheet`} className="max-h-[480px] rounded-xl border border-dark-200" />
        </section>
      ) : null}
    </div>
  );
}
