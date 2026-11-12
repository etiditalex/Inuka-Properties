"use client";

import { useState } from "react";
import DroneView from "@/components/maps/DroneView";
import { applyDroneFit, dronePointErrorPx, fitDroneRegistration } from "@/lib/maps/droneRegistration";
import type { DroneImage, ImagePoint, MapCrs, MapPlot, Position } from "@/lib/maps/types";

type DroneCalibrationProps = {
  images: DroneImage[];
  plots: MapPlot[];
  crs: MapCrs;
  pickingGroundId: string | null;
  onChange: (images: DroneImage[]) => void;
  onPickGround: (imageId: string, pointId: string) => void;
};

function updateImage(images: DroneImage[], imageId: string, patch: (image: DroneImage) => DroneImage): DroneImage[] {
  return images.map((image) => (image.id === imageId ? patch(image) : image));
}

export default function DroneCalibration({ images, plots, crs, pickingGroundId, onChange, onPickGround }: DroneCalibrationProps) {
  const [selectedId, setSelectedId] = useState(images[0]?.id ?? "");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [imagePointId, setImagePointId] = useState<string | null>(null);
  const [editablePlot, setEditablePlot] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const selected = images.find((image) => image.id === selectedId) ?? images[0] ?? null;

  const changeSelected = (patch: (image: DroneImage) => DroneImage) => {
    if (!selected) return;
    onChange(updateImage(images, selected.id, patch));
  };

  const addImage = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const image: DroneImage = {
      id: crypto.randomUUID(),
      name: name.trim() || "Drone photograph",
      url: trimmed,
      widthPx: 0,
      heightPx: 0,
      controlPoints: [],
      fit: null,
      corrections: [],
    };
    onChange([...images, image]);
    setSelectedId(image.id);
    setUrl("");
    setName("");
  };

  const addPoint = () => {
    if (!selected) return;
    const point = {
      id: crypto.randomUUID(),
      label: `Point ${selected.controlPoints.length + 1}`,
      ground: null as Position | null,
      image: null as ImagePoint | null,
    };
    changeSelected((image) => ({ ...image, controlPoints: [...image.controlPoints, point], fit: null }));
  };

  const estimate = () => {
    if (!selected) return;
    setError("");
    setNotice("");
    const pairs = selected.controlPoints.flatMap((point) =>
      point.ground && point.image ? [{ ground: point.ground, image: point.image }] : []
    );
    try {
      const fit = fitDroneRegistration(pairs, selected.widthPx, selected.heightPx);
      changeSelected((image) => ({ ...image, fit }));
      setNotice(`Approximate registration. Typical miss ${fit.rmsPx.toFixed(1)} pixels. This is not a survey.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The photograph could not be registered.");
    }
  };

  const correctPlot = (plotNumber: string) => {
    if (!selected) return;
    const existing = selected.corrections.find((item) => item.plotNumber === plotNumber);
    if (existing) {
      setEditablePlot(plotNumber);
      return;
    }
    const plot = plots.find((item) => item.plotNumber === plotNumber);
    if (!plot || !selected.fit || crs !== "EPSG:4326") {
      setError("Estimate the registration before correcting a plot, or draw the satellite corners first.");
      return;
    }
    try {
      const projected = applyDroneFit(selected.fit, plot.ring);
      changeSelected((image) => ({
        ...image,
        corrections: [...image.corrections.filter((item) => item.plotNumber !== plotNumber), { plotNumber, ring: projected }],
      }));
      setEditablePlot(plotNumber);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That plot could not be copied onto the photograph.");
    }
  };

  return (
    <section className="rounded-xl border border-dark-200 p-4">
      <h3 className="font-semibold text-dark-900">Drone photograph</h3>
      <p className="mt-1 text-sm text-dark-600">
        Match points on the satellite map to the same places on this photograph. The registration is approximate and is stored with this photograph only. Plot prices and statuses stay on the plot list.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Photograph name"
          className="rounded-lg border border-dark-200 px-3 py-2 text-sm"
          aria-label="Photograph name"
        />
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Image URL"
          className="min-w-[16rem] flex-1 rounded-lg border border-dark-200 px-3 py-2 text-sm"
          aria-label="Photograph URL"
        />
        <button type="button" onClick={addImage} className="rounded-lg border border-dark-200 px-3 py-2 text-sm font-semibold">
          Add photograph
        </button>
      </div>
      {images.length > 1 ? (
        <label className="mt-3 block text-sm">
          Photograph
          <select
            value={selected?.id ?? ""}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setImagePointId(null);
              setEditablePlot(null);
            }}
            className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
          >
            {images.map((image) => (
              <option key={image.id} value={image.id}>
                {image.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {selected ? (
        <>
          <div className="mt-3 h-[480px] overflow-hidden rounded-xl border border-dark-200">
            <DroneView
              image={selected}
              plots={plots}
              crs={crs}
              selected={editablePlot}
              showBoundaries
              showNumbers
              onImageClick={
                imagePointId
                  ? (point) => {
                      changeSelected((image) => ({
                        ...image,
                        fit: null,
                        controlPoints: image.controlPoints.map((item) => (item.id === imagePointId ? { ...item, image: point } : item)),
                      }));
                      setImagePointId(null);
                    }
                  : undefined
              }
              markers={selected.controlPoints.flatMap((point) =>
                point.image ? [{ id: point.id, position: point.image, label: point.label }] : []
              )}
              editablePlot={editablePlot}
              onCorrection={(plotNumber, ring) =>
                changeSelected((image) => ({
                  ...image,
                  corrections: image.corrections.map((item) => (item.plotNumber === plotNumber ? { ...item, ring } : item)),
                }))
              }
              onMeasured={(widthPx, heightPx) => {
                if (selected.widthPx === widthPx && selected.heightPx === heightPx) return;
                changeSelected((image) => ({ ...image, widthPx, heightPx }));
              }}
            />
          </div>
          {imagePointId ? <p className="mt-2 text-sm text-primary-700">Click the photograph where this point is visible.</p> : null}
          {pickingGroundId ? <p className="mt-2 text-sm text-primary-700">Click the satellite map where this same point is.</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={addPoint} className="rounded-lg border border-dark-200 px-3 py-2 text-sm font-semibold">
              Add correspondence point
            </button>
            <button type="button" onClick={estimate} className="rounded-lg bg-dark-900 px-3 py-2 text-sm font-semibold text-white">
              Estimate registration
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {selected.controlPoints.map((point) => {
              const errorPx =
                selected.fit && point.ground && point.image
                  ? dronePointErrorPx(selected.fit, { ground: point.ground, image: point.image }, selected.widthPx, selected.heightPx)
                  : null;
              return (
                <li key={point.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span>
                    {point.label}
                    {point.ground ? <span className="ml-2 text-emerald-700">Satellite</span> : null}
                    {point.image ? <span className="ml-2 text-emerald-700">Photo</span> : null}
                    {errorPx != null ? <span className="ml-2 text-dark-500">{errorPx.toFixed(1)} px off</span> : null}
                  </span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onPickGround(selected.id, point.id)}
                      className={`rounded-md px-2 py-1 ${pickingGroundId === point.id ? "bg-primary-700 text-white" : "border border-dark-200"}`}
                    >
                      Mark on satellite
                    </button>
                    <button
                      type="button"
                      onClick={() => setImagePointId(point.id)}
                      className={`rounded-md px-2 py-1 ${imagePointId === point.id ? "bg-primary-700 text-white" : "border border-dark-200"}`}
                    >
                      Mark on photo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        changeSelected((image) => ({
                          ...image,
                          fit: null,
                          controlPoints: image.controlPoints.filter((item) => item.id !== point.id),
                        }))
                      }
                      className="rounded-md border border-dark-200 px-2 py-1"
                    >
                      Remove
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          {selected.fit ? (
            <p className="mt-3 text-sm text-dark-700">
              Typical miss {selected.fit.rmsPx.toFixed(1)} pixels. Move a point or correct an individual plot if a boundary does not sit on the photograph. This registration is not a survey.
            </p>
          ) : (
            <p className="mt-3 text-sm text-dark-600">Outlines stay off the photograph until four matched points have been estimated.</p>
          )}
          <label className="mt-3 block text-sm">
            Correct one plot outline
            <select
              value={editablePlot ?? ""}
              onChange={(event) => {
                const plotNumber = event.target.value;
                if (!plotNumber) {
                  setEditablePlot(null);
                  return;
                }
                correctPlot(plotNumber);
              }}
              className="mt-1 w-full rounded-lg border border-dark-200 px-3 py-2"
            >
              <option value="">Choose a plot</option>
              {plots.map((plot) => (
                <option key={plot.plotNumber} value={plot.plotNumber}>
                  Plot {plot.plotNumber}
                  {selected.corrections.some((item) => item.plotNumber === plot.plotNumber) ? " (corrected)" : ""}
                </option>
              ))}
            </select>
          </label>
          {editablePlot ? (
            <button
              type="button"
              onClick={() => {
                changeSelected((image) => ({
                  ...image,
                  corrections: image.corrections.filter((item) => item.plotNumber !== editablePlot),
                }));
                setEditablePlot(null);
              }}
              className="mt-2 rounded-md border border-dark-200 px-2 py-1 text-sm"
            >
              Use the estimated outline for plot {editablePlot}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onChange(images.filter((image) => image.id !== selected.id))}
            className="mt-4 block text-sm font-semibold text-red-700"
          >
            Remove this photograph
          </button>
        </>
      ) : (
        <p className="mt-3 text-sm text-dark-600">Add a photograph URL to start a calibration for this project.</p>
      )}
      {notice ? <p className="mt-3 text-sm text-emerald-800">{notice}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
