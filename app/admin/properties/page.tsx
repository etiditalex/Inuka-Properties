"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Plus, Pencil, Trash2, Search, Download, MapPin } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { createClient } from "@/lib/supabase/client";
import type { Property } from "@/lib/supabase/types";
import { cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { parseMapCoords } from "@/lib/maps";
import { sortPropertiesNewestFirst } from "@/lib/properties/sortProperties";
import type { AdminMapMarker } from "@/components/admin/AdminLeafletMap";

const AdminLeafletMap = dynamic(() => import("@/components/admin/AdminLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-xl border border-dark-200 bg-dark-50 text-sm text-dark-500">
      Loading map…
    </div>
  ),
});

const statusColors = {
  available: "bg-emerald-100 text-emerald-800",
  ongoing: "bg-amber-100 text-amber-800",
  sold: "bg-red-100 text-red-800",
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    setProperties(sortPropertiesNewestFirst((data as Property[]) || []));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this property?")) return;
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    load();
  };

  const handleImportFromWebsite = async () => {
    if (
      !confirm(
        "Import all land listings from the public website into the dashboard? Existing listings with the same ID will be updated."
      )
    ) {
      return;
    }

    setImporting(true);
    setImportMessage("");

    try {
      const res = await fetch("/api/admin/import-properties", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setImportMessage(data.error || "Import failed");
        return;
      }

      setImportMessage(data.message || `Imported ${data.imported} listings.`);
      await load();
    } catch {
      setImportMessage("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const mapMarkers = useMemo<AdminMapMarker[]>(
    () =>
      properties
        .filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.location.toLowerCase().includes(search.toLowerCase())
        )
        .flatMap((property) => {
          const coords = parseMapCoords(property.map_link);
          if (!coords) return [];
          return [
            {
              id: property.id,
              lat: coords.lat,
              lng: coords.lng,
              label: property.title,
              href: adminPath(`properties/${property.id}`),
            },
          ];
        }),
    [properties, search]
  );

  return (
    <AdminShell title="Land Listings" subtitle="Manage properties for sale">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="search"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={handleImportFromWebsite} loading={importing}>
            <Download size={16} /> Import from website
          </AdminButton>
          <Link href={adminPath("properties/new")}>
            <AdminButton>
              <Plus size={16} /> Add Property
            </AdminButton>
          </Link>
        </div>
      </div>

      {importMessage && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${importMessage.includes("failed") || importMessage.includes("Failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
        >
          {importMessage}
        </div>
      )}

      <div className="mb-6 overflow-hidden rounded-2xl border border-dark-200/60 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-dark-900 font-montserrat">
              <MapPin size={18} className="text-primary-600" />
              Property map
            </h3>
            <p className="mt-1 text-xs text-dark-500">
              {mapMarkers.length > 0
                ? `${mapMarkers.length} listing${mapMarkers.length === 1 ? "" : "s"} pinned. Click a pin to edit. Open a listing to drop or move its pin.`
                : "No listings have a map pin yet. Open a property and click the map to drop a pin."}
            </p>
          </div>
        </div>
        <AdminLeafletMap heightClass="h-80 md:h-[28rem]" markers={mapMarkers} />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
          <p className="text-dark-500">No properties found</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <AdminButton size="sm" variant="secondary" onClick={handleImportFromWebsite} loading={importing}>
              <Download size={14} /> Import from website
            </AdminButton>
            <Link href={adminPath("properties/new")}>
              <AdminButton size="sm">Add your first property</AdminButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-dark-100 bg-dark-50/80">
              <tr>
                <th className="px-4 py-3 font-semibold text-dark-600">Property</th>
                <th className="hidden px-4 py-3 font-semibold text-dark-600 md:table-cell">Location</th>
                <th className="hidden px-4 py-3 font-semibold text-dark-600 lg:table-cell">Map</th>
                <th className="px-4 py-3 font-semibold text-dark-600">Price</th>
                <th className="px-4 py-3 font-semibold text-dark-600">Units</th>
                <th className="px-4 py-3 font-semibold text-dark-600">Status</th>
                <th className="px-4 py-3 font-semibold text-dark-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filtered.map((p) => (
                <tr key={p.id} className="transition hover:bg-primary-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.image} alt={p.title} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900">{p.title}</p>
                        <p className="text-xs text-dark-400 capitalize">{p.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-dark-600 md:table-cell">{p.location}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {parseMapCoords(p.map_link) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                        <MapPin size={12} /> Pinned
                      </span>
                    ) : (
                      <span className="text-xs text-dark-400">No pin</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-amber-700">{p.price}</td>
                  <td className="px-4 py-3 text-dark-600">
                    {p.total_units > 0 ? `${p.sold_units}/${p.total_units}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold uppercase", statusColors[p.status])}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={adminPath(`properties/${p.id}`)} className="rounded-lg p-1.5 text-dark-400 hover:bg-primary-100 hover:text-primary-700">
                        <Pencil size={16} />
                      </Link>
                      <button type="button" onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-dark-400 hover:bg-red-100 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
