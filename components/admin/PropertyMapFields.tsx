"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { AdminInput } from "@/components/admin/AdminForm";
import AdminButton from "@/components/admin/AdminButton";
import {
  buildGoogleMapsLink,
  buildGoogleMapsLinkFromCoords,
  parseMapCoords,
} from "@/lib/maps";

const AdminLeafletMap = dynamic(() => import("@/components/admin/AdminLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dark-200 bg-dark-50 text-sm text-dark-500">
      Loading map…
    </div>
  ),
});

type PropertyMapFieldsProps = {
  location: string;
  mapLink: string;
  onChange: (mapLink: string) => void;
};

export default function PropertyMapFields({
  location,
  mapLink,
  onChange,
}: PropertyMapFieldsProps) {
  const parsed = parseMapCoords(mapLink);
  const [lat, setLat] = useState(parsed ? String(parsed.lat) : "");
  const [lng, setLng] = useState(parsed ? String(parsed.lng) : "");
  const [finding, setFinding] = useState(false);
  const [findError, setFindError] = useState("");

  useEffect(() => {
    const next = parseMapCoords(mapLink);
    setLat(next ? String(next.lat) : "");
    setLng(next ? String(next.lng) : "");
  }, [mapLink]);

  const applyCoords = (latValue: string, lngValue: string) => {
    const coords = parseMapCoords(`${latValue},${lngValue}`);
    if (!coords) return;
    onChange(buildGoogleMapsLinkFromCoords(coords));
  };

  const findFromLocation = async () => {
    const query = location.trim();
    if (!query) {
      setFindError("Enter the property location first.");
      return;
    }
    setFinding(true);
    setFindError("");
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok || data.lat == null || data.lng == null) {
        onChange(buildGoogleMapsLink(query));
        setFindError(data.error || "Could not pin exact coordinates. Click the map to drop a pin.");
        return;
      }
      onChange(buildGoogleMapsLinkFromCoords({ lat: Number(data.lat), lng: Number(data.lng) }));
    } catch {
      onChange(buildGoogleMapsLink(query));
      setFindError("Could not look up coordinates. Click the map to drop a pin.");
    } finally {
      setFinding(false);
    }
  };

  const selected = parsed || (lat && lng ? parseMapCoords(`${lat},${lng}`) : null);

  return (
    <div className="space-y-4 rounded-xl border border-primary-100 bg-primary-50/40 p-4">
      <div>
        <h4 className="flex items-center gap-2 font-bold text-dark-900 font-montserrat">
          <MapPin size={16} className="text-primary-600" />
          Map location
        </h4>
        <p className="mt-1 text-xs text-dark-500">
          Click the map to drop a pin, drag it to adjust, or paste coordinates. This pin appears on the public listing.
        </p>
      </div>

      <AdminLeafletMap
        heightClass="h-64 md:h-80"
        clickToPin
        selected={selected}
        onPin={(coords) => onChange(buildGoogleMapsLinkFromCoords(coords))}
      />

      <AdminInput
        label="Google Maps URL"
        value={mapLink}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://maps.google.com/?q=-3.535695,39.896584"
        hint="Optional: paste a Google Maps share link"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput
          label="Latitude"
          value={lat}
          onChange={(e) => {
            setLat(e.target.value);
            applyCoords(e.target.value, lng);
          }}
          placeholder="-3.535695"
        />
        <AdminInput
          label="Longitude"
          value={lng}
          onChange={(e) => {
            setLng(e.target.value);
            applyCoords(lat, e.target.value);
          }}
          placeholder="39.896584"
        />
      </div>

      <AdminButton variant="secondary" size="sm" loading={finding} onClick={findFromLocation}>
        <MapPin size={14} />
        Pin from listing location
      </AdminButton>
      {findError && <p className="text-xs text-amber-700">{findError}</p>}
    </div>
  );
}
