"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Heart, Home } from "lucide-react";
import { propertyImageProps } from "@/lib/images";

export interface PropertyListingCardData {
  id: number;
  title: string;
  location: string;
  /** Raw type slug or display label (e.g. residential, Beach) */
  type: string;
  price: string;
  size: string;
  bedrooms?: number;
  image: string;
  status?: "available" | "ongoing" | "sold";
}

function formatTypeLabel(type: string): string {
  const t = type.toLowerCase();
  if (t === "beach") return "Beach";
  if (t === "residential") return "Residential";
  if (t === "commercial") return "Commercial";
  if (t === "farm") return "Farm Land";
  if (t === "affordable") return "Affordable";
  if (t === "all") return "Property";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function PropertyListingCard({
  property,
  imageHeightClass = "h-[200px] sm:h-[220px] md:h-[240px]",
  imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
  className = "",
  badge,
}: {
  property: PropertyListingCardData;
  imageHeightClass?: string;
  imageSizes?: string;
  className?: string;
  badge?: string;
}) {
  const [saved, setSaved] = useState(false);
  const typeLabel = formatTypeLabel(property.type);
  const isSold = property.status === "sold";
  const imageProps = property.image ? propertyImageProps(property.image) : null;

  return (
    <article
      className={`flex flex-col rounded-xl border border-dark-200/70 bg-white shadow-sm transition-shadow hover:shadow-md min-h-0 min-w-0 ${isSold ? "opacity-[0.97]" : ""} ${className}`}
    >
      <div className={`relative w-full shrink-0 overflow-hidden rounded-t-xl ${imageHeightClass}`}>
        {imageProps ? (
          <Image
            src={imageProps.src}
            alt={property.title}
            fill
            unoptimized={imageProps.unoptimized}
            className={`object-cover ${isSold ? "opacity-80 saturate-[0.65]" : ""}`}
            sizes={imageSizes}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-dark-100 text-dark-400 text-sm">
            No image
          </div>
        )}
        {isSold && (
          <div className="absolute left-3 top-3 z-10 rounded-md bg-dark-900 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white shadow-lg">
            Sold out
          </div>
        )}
        {!isSold && badge && (
          <div className="absolute left-3 top-3 z-10 rounded-md bg-primary-600 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white shadow-lg">
            {badge}
          </div>
        )}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save property"}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-dark-100/80 bg-white shadow-md transition hover:bg-dark-50"
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            className={
              saved
                ? "fill-red-500 text-red-500"
                : "fill-none text-dark-900"
            }
          />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5 md:p-6 rounded-b-xl overflow-visible">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <span className="inline-flex max-w-full items-center rounded-full border border-amber-600/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 break-words text-center sm:text-left">
            {typeLabel}
          </span>
          <div className="max-w-full sm:text-right">
            {isSold ? (
              <>
                <span className="block font-montserrat text-base font-bold leading-snug text-amber-800 md:text-lg">
                  Sold out
                </span>
                <span className="mt-0.5 block text-sm font-normal text-dark-500 line-through [overflow-wrap:anywhere]">
                  Was {property.price}
                </span>
              </>
            ) : (
              <span className="block font-montserrat text-base font-bold leading-snug text-amber-700 md:text-lg break-words [overflow-wrap:anywhere]">
                {property.price}
              </span>
            )}
          </div>
        </div>

        <h3 className="break-words text-lg font-bold leading-snug text-dark-900 md:text-xl font-montserrat [overflow-wrap:anywhere]">
          {property.title}
        </h3>

        <p className="break-words text-sm leading-relaxed text-dark-500 font-montserrat [overflow-wrap:anywhere]">
          {property.location}
        </p>

        <div className="flex flex-wrap items-start gap-x-5 gap-y-3 text-sm leading-snug text-dark-500 font-montserrat">
          {property.bedrooms != null && property.bedrooms > 0 ? (
            <>
              <span className="flex min-w-0 max-w-full items-start gap-1.5 break-words">
                <Bed size={16} className="mt-0.5 shrink-0 opacity-85" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{property.bedrooms} Beds</span>
              </span>
              <span className="flex min-w-0 max-w-full items-start gap-1.5 break-words">
                <Bath size={16} className="mt-0.5 shrink-0 opacity-85" />
                <span className="min-w-0">—</span>
              </span>
              <span className="flex min-w-0 max-w-full items-start gap-1.5 break-words">
                <Square size={16} className="mt-0.5 shrink-0 opacity-85" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{property.size}</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex min-w-0 max-w-full items-start gap-1.5 break-words">
                <Square size={16} className="mt-0.5 shrink-0 opacity-85" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{property.size}</span>
              </span>
              <span className="flex min-w-0 max-w-full items-start gap-1.5 break-words">
                <Home size={16} className="mt-0.5 shrink-0 opacity-85" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{typeLabel}</span>
              </span>
              <span className="flex min-w-0 max-w-full items-start gap-1.5 break-words">
                <MapPin size={16} className="mt-0.5 shrink-0 opacity-85" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{property.location}</span>
              </span>
            </>
          )}
        </div>

        <div className="pt-2">
          <Link
            href={`/for-sale/${property.id}`}
            className={`block w-full rounded-lg border py-3 text-center text-sm font-bold transition font-montserrat ${
              isSold
                ? "border-dark-300 bg-dark-50 text-dark-600 hover:bg-dark-100"
                : "border-dark-200 bg-white text-dark-900 hover:bg-dark-50"
            }`}
          >
            {isSold ? "Project details" : "View Details"}
          </Link>
        </div>
      </div>
    </article>
  );
}
