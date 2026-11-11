"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { adminPath } from "@/lib/admin/path";
import type { PlotMapSummary } from "@/lib/maps/types";

export default function PlotMapsPage() {
  const [maps, setMaps] = useState<PlotMapSummary[]>([]);
  const [propertyId, setPropertyId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = () => {
    fetch("/api/admin/plot-maps")
      .then((response) => response.json())
      .then((body: { maps?: PlotMapSummary[]; error?: string }) => {
        if (body.maps) setMaps(body.maps);
        if (body.error) setError(body.error);
      })
      .catch(() => setError("The plot maps could not be loaded."));
  };

  useEffect(() => {
    load();
  }, []);

  const createMap = async () => {
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/plot-maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: Number(propertyId), projectName, location }),
    });
    const body = (await response.json()) as { error?: string; document?: { slug: string } };
    if (!response.ok) {
      setError(body.error ?? "The map was not created.");
      return;
    }
    setNotice("Map created.");
    setProjectName("");
    setLocation("");
    setPropertyId("");
    load();
  };

  return (
    <AdminShell title="Plot maps" subtitle="One satellite subdivision for each land listing">
      <div className="mb-6 grid gap-3 rounded-xl border border-dark-200 bg-white p-4 md:grid-cols-4">
        <input
          value={propertyId}
          onChange={(event) => setPropertyId(event.target.value)}
          placeholder="Listing id"
          className="rounded-lg border border-dark-200 px-3 py-2 text-sm"
        />
        <input
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          placeholder="Project name"
          className="rounded-lg border border-dark-200 px-3 py-2 text-sm"
        />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          className="rounded-lg border border-dark-200 px-3 py-2 text-sm"
        />
        <button type="button" onClick={createMap} className="rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white">
          New plot map
        </button>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {notice ? <p className="mb-4 text-sm text-emerald-800">{notice}</p> : null}
      <div className="overflow-hidden rounded-xl border border-dark-200 bg-white">
        {maps.map((item) => (
          <Link
            key={item.slug}
            href={adminPath(`plot-maps/${item.slug}`)}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-100 px-4 py-3 last:border-b-0 hover:bg-dark-50"
          >
            <span>
              <span className="font-semibold text-dark-900">{item.projectName}</span>
              <span className="ml-2 text-sm text-dark-500">{item.location}</span>
            </span>
            <span className="text-sm text-dark-600">
              {item.plotCount} plots · {item.alignmentStatus === "verified" ? "On satellite" : "Needs ground corners"}
            </span>
          </Link>
        ))}
        {!maps.length ? <p className="px-4 py-6 text-sm text-dark-500">No plot maps yet.</p> : null}
      </div>
    </AdminShell>
  );
}
