"use client";

import { useEffect, useRef, useState } from "react";
import { PLOT_STYLE } from "@/lib/maps/colors";
import { applyDroneFit } from "@/lib/maps/droneRegistration";
import type { DroneImage, ImagePoint, MapCrs, MapPlot, PlotStatus } from "@/lib/maps/types";

type DroneViewProps = {
  image: DroneImage;
  plots: MapPlot[];
  crs: MapCrs;
  selected: string | null;
  hiddenStatuses?: PlotStatus[];
  showBoundaries: boolean;
  showNumbers: boolean;
  onSelect?: (plotNumber: string | null) => void;
  /** Calibration click. While set, plot clicks do not select. */
  onImageClick?: (point: ImagePoint) => void;
  markers?: { id: string; position: ImagePoint; label: string }[];
  editablePlot?: string | null;
  onCorrection?: (plotNumber: string, ring: ImagePoint[]) => void;
  onMeasured?: (widthPx: number, heightPx: number) => void;
};

type ViewState = { scale: number; x: number; y: number };

function outlineFor(plot: MapPlot, image: DroneImage, crs: MapCrs): ImagePoint[] | null {
  const correction = image.corrections.find((item) => item.plotNumber === plot.plotNumber && item.ring.length >= 3);
  if (correction) return correction.ring;
  if (!image.fit || crs !== "EPSG:4326") return null;
  try {
    return applyDroneFit(image.fit, plot.ring);
  } catch {
    return null;
  }
}

function centroid(ring: ImagePoint[]): ImagePoint {
  const total = ring.reduce<[number, number]>((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0]);
  return [total[0] / ring.length, total[1] / ring.length];
}

function pointsAttribute(ring: ImagePoint[]): string {
  return ring.map((point) => `${point[0]},${point[1]}`).join(" ");
}

/**
 * One oblique photograph with plot outlines in that photograph's own coordinates.
 * The picture and the overlay share one zoom and pan, so the outlines stay anchored.
 */
export default function DroneView({
  image,
  plots,
  crs,
  selected,
  hiddenStatuses,
  showBoundaries,
  showNumbers,
  onSelect,
  onImageClick,
  markers,
  editablePlot,
  onCorrection,
  onMeasured,
}: DroneViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number; x: number; y: number; midX: number; midY: number } | null>(null);
  const pan = useRef<{ x: number; y: number; viewX: number; viewY: number } | null>(null);
  const moved = useRef(false);
  const vertex = useRef<{ index: number; ring: ImagePoint[] } | null>(null);
  const viewRef = useRef<ViewState>({ scale: 1, x: 0, y: 0 });
  const [view, setView] = useState<ViewState>({ scale: 1, x: 0, y: 0 });
  const [draftRing, setDraftRing] = useState<ImagePoint[] | null>(null);
  const [base, setBase] = useState({ width: 0, height: 0 });
  const [aspect, setAspect] = useState(image.widthPx > 0 && image.heightPx > 0 ? image.widthPx / image.heightPx : 1.5);
  const frame = aspect || 1.5;
  const hidden = new Set(hiddenStatuses ?? []);
  const placing = Boolean(onImageClick);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const fit = () => {
      const rect = viewport.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const width = Math.min(rect.width, rect.height * frame);
      const height = width / frame;
      setBase({ width, height });
      setView((current) =>
        current.scale === 1 ? { scale: 1, x: (rect.width - width) / 2, y: (rect.height - height) / 2 } : current
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [frame, image.id]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const current = viewRef.current;
      const next = Math.min(8, Math.max(1, current.scale * (event.deltaY < 0 ? 1.12 : 0.89)));
      const ratio = next / current.scale;
      const updated = { scale: next, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio };
      viewRef.current = updated;
      setView(updated);
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [image.id]);

  const normalizedAt = (clientX: number, clientY: number): ImagePoint | null => {
    const viewport = viewportRef.current;
    if (!viewport || base.width < 2) return null;
    const rect = viewport.getBoundingClientRect();
    const current = viewRef.current;
    const stageX = (clientX - rect.left - current.x) / current.scale;
    const stageY = (clientY - rect.top - current.y) / current.scale;
    return [stageX / base.width, stageY / base.height];
  };

  const zoomBy = (factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const px = rect.width / 2;
    const py = rect.height / 2;
    const current = viewRef.current;
    const next = Math.min(8, Math.max(1, current.scale * factor));
    const ratio = next / current.scale;
    const updated = { scale: next, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio };
    viewRef.current = updated;
    setView(updated);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    const vertexIndex = target.dataset.vertex;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    moved.current = false;
    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()];
      pinch.current = {
        distance: Math.hypot(first.x - second.x, first.y - second.y),
        scale: viewRef.current.scale,
        x: viewRef.current.x,
        y: viewRef.current.y,
        midX: (first.x + second.x) / 2,
        midY: (first.y + second.y) / 2,
      };
      pan.current = null;
      vertex.current = null;
      return;
    }
    if (vertexIndex != null && editablePlot && onCorrection) {
      const plot = plots.find((item) => item.plotNumber === editablePlot);
      const ring = plot ? outlineFor(plot, image, crs) : null;
      if (ring) vertex.current = { index: Number(vertexIndex), ring: ring.map((point) => [...point]) };
      pan.current = null;
      return;
    }
    pan.current = { x: event.clientX, y: event.clientY, viewX: viewRef.current.x, viewY: viewRef.current.y };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointer = pointers.current.get(event.pointerId);
    if (!pointer) return;
    if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 4) moved.current = true;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size >= 2 && pinch.current) {
      const [first, second] = [...pointers.current.values()];
      const distance = Math.hypot(first.x - second.x, first.y - second.y) || pinch.current.distance;
      const viewport = viewportRef.current?.getBoundingClientRect();
      if (!viewport) return;
      const midX = (first.x + second.x) / 2 - viewport.left;
      const midY = (first.y + second.y) / 2 - viewport.top;
      const next = Math.min(8, Math.max(1, pinch.current.scale * (distance / pinch.current.distance)));
      const startMidX = pinch.current.midX - viewport.left;
      const startMidY = pinch.current.midY - viewport.top;
      const ratio = next / pinch.current.scale;
      const updated = {
        scale: next,
        x: midX - (startMidX - pinch.current.x) * ratio,
        y: midY - (startMidY - pinch.current.y) * ratio,
      };
      viewRef.current = updated;
      setView(updated);
      return;
    }
    if (vertex.current && editablePlot) {
      const point = normalizedAt(event.clientX, event.clientY);
      if (!point) return;
      const ring = vertex.current.ring.map((item, index) => (index === vertex.current?.index ? point : item));
      vertex.current = { ...vertex.current, ring };
      setDraftRing(ring);
      return;
    }
    if (!pan.current) return;
    const updated = {
      ...viewRef.current,
      x: pan.current.viewX + event.clientX - pan.current.x,
      y: pan.current.viewY + event.clientY - pan.current.y,
    };
    viewRef.current = updated;
    setView(updated);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    const dragged = vertex.current;
    vertex.current = null;
    pan.current = null;
    if (dragged && editablePlot && onCorrection) {
      onCorrection(editablePlot, dragged.ring);
      setDraftRing(null);
    }
    if (!moved.current && !dragged && onImageClick) {
      const point = normalizedAt(event.clientX, event.clientY);
      if (point) onImageClick(point);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden bg-dark-900 touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {base.width > 0 ? (
          <div
            className="absolute left-0 top-0"
            style={{
              width: base.width,
              height: base.height,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
              transformOrigin: "0 0",
            }}
          >
            <img
              src={image.url}
              alt={image.name}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none select-none"
              onLoad={(event) => {
                const photo = event.currentTarget;
                if (photo.naturalWidth > 0 && photo.naturalHeight > 0) {
                  setAspect(photo.naturalWidth / photo.naturalHeight);
                  onMeasured?.(photo.naturalWidth, photo.naturalHeight);
                }
              }}
            />
            <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {plots.map((plot) => {
                if (hidden.has(plot.status)) return null;
                const storedRing = outlineFor(plot, image, crs);
                const ring = plot.plotNumber === editablePlot && draftRing ? draftRing : storedRing;
                if (!ring) return null;
                const [cx, cy] = centroid(ring);
                const active = plot.plotNumber === selected;
                return (
                  <g key={plot.plotNumber}>
                    <polygon
                      points={pointsAttribute(ring)}
                      fill={PLOT_STYLE[plot.status].fill}
                      fillOpacity={active ? 0.55 : 0.38}
                      stroke={showBoundaries ? PLOT_STYLE[plot.status].fill : "none"}
                      strokeWidth={showBoundaries ? 2 : 0}
                      vectorEffect="non-scaling-stroke"
                      style={{ pointerEvents: placing ? "none" : "auto" }}
                      onClick={(event) => {
                        if (placing || moved.current) return;
                        event.stopPropagation();
                        onSelect?.(plot.plotNumber);
                      }}
                    />
                    {showNumbers ? (
                      <text
                        x={cx}
                        y={cy}
                        fill="#111827"
                        stroke="#ffffff"
                        strokeWidth={0.003}
                        fontSize={0.02}
                        fontWeight={700}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ pointerEvents: "none" }}
                      >
                        {plot.plotNumber}
                      </text>
                    ) : null}
                    {editablePlot === plot.plotNumber
                      ? ring.map((point, index) => (
                          <circle
                            key={`${plot.plotNumber}-${index}`}
                            data-vertex={index}
                            cx={point[0]}
                            cy={point[1]}
                            r={0.012}
                            fill="#ffffff"
                            stroke="#111827"
                            strokeWidth={0.003}
                          />
                        ))
                      : null}
                  </g>
                );
              })}
              {(markers ?? []).map((marker) => (
                <g key={marker.id} style={{ pointerEvents: "none" }}>
                  <circle cx={marker.position[0]} cy={marker.position[1]} r={0.012} fill="#0369a1" stroke="#ffffff" strokeWidth={0.003} />
                  <text x={marker.position[0]} y={marker.position[1] - 0.02} fill="#ffffff" stroke="#0f172a" strokeWidth={0.003} fontSize={0.016} textAnchor="middle">
                    {marker.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : null}
      </div>
      <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-md border border-dark-200 bg-white shadow">
        <button type="button" className="px-3 py-2 text-sm font-semibold text-dark-800" onClick={() => zoomBy(1.2)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="border-t border-dark-200 px-3 py-2 text-sm font-semibold text-dark-800" onClick={() => zoomBy(0.84)} aria-label="Zoom out">
          −
        </button>
      </div>
    </div>
  );
}
