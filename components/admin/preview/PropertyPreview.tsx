"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/supabase/types";
import { cn } from "@/lib/admin/utils";
import PropertyLocationMap from "@/components/PropertyLocationMap";

type PropertyPreviewProps = {
  property: Partial<Property>;
};

const statusStyles = {
  available: "bg-emerald-100 text-emerald-800",
  ongoing: "bg-amber-100 text-amber-800",
  sold: "bg-red-100 text-red-800",
};

export default function PropertyPreview({ property }: PropertyPreviewProps) {
  const status = property.status || "available";
  const soldPct =
    property.total_units && property.total_units > 0
      ? Math.round(((property.sold_units || 0) / property.total_units) * 100)
      : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200 bg-white">
      <div className="border-b border-dark-200 bg-dark-900 px-4 py-2">
        <p className="text-xs font-medium text-white/60">Frontend Preview — Property Card</p>
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-xl border border-dark-200 shadow-md">
          <div className="relative h-44">
            {property.image ? (
              <Image
                src={property.image}
                alt={property.title || "Property"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-dark-100 text-dark-400">
                Property image
              </div>
            )}
            <span
              className={cn(
                "absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                statusStyles[status as keyof typeof statusStyles]
              )}
            >
              {status}
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-dark-900 font-montserrat">
              {property.title || "Property Title"}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-dark-500">
              <MapPin size={14} className="text-primary-600" />
              {property.location || "Location"}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-amber-700">{property.price || "KES —"}</span>
              <span className="text-sm text-dark-500">{property.size || "Size"}</span>
            </div>
            {property.total_units ? (
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-dark-500">
                  <span>Units sold</span>
                  <span>
                    {property.sold_units || 0}/{property.total_units}
                    {property.auto_sold_out && soldPct >= 100 && " — Auto Sold Out"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-dark-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all"
                    style={{ width: `${Math.min(soldPct, 100)}%` }}
                  />
                </div>
              </div>
            ) : null}
            {(() => {
              const plan =
                typeof property.payment_plan === "object" && property.payment_plan
                  ? property.payment_plan
                  : null;
              const deposit =
                plan && typeof plan === "object"
                  ? (plan as Record<string, string>).Deposit
                  : undefined;
              return deposit ? (
                <p className="mt-3 text-sm text-primary-700">
                  <span className="font-semibold">Deposit:</span> {deposit}
                </p>
              ) : null;
            })()}
          </div>
        </div>
        {(property.map_link || property.location) && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-dark-500">Map location preview</p>
            <PropertyLocationMap
              mapLink={property.map_link}
              location={property.location}
              title={property.title || "Property"}
              heightClass="h-48"
              showOpenLink={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
