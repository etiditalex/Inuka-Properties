"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { usePropertyEngagement } from "@/components/property/usePropertyEngagement";

const STARS = [1, 2, 3, 4, 5] as const;

function StarFill({
  fill,
  size,
}: {
  fill: number;
  size: number;
}) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <Star size={size} strokeWidth={1.5} className="fill-none text-amber-300" />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <Star size={size} strokeWidth={1.5} className="fill-amber-400 text-amber-400" />
      </span>
    </span>
  );
}

export default function PropertyStarRating({
  propertyId,
  size = "md",
  showLabel = true,
}: {
  propertyId: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const { ratingAvg, ratingCount, myRating, busy, setRating } = usePropertyEngagement(propertyId);
  const [hover, setHover] = useState<number | null>(null);
  const iconSize = size === "lg" ? 28 : size === "sm" ? 16 : 20;
  const display = hover ?? myRating ?? ratingAvg;
  const usingHover = hover != null || myRating != null;

  return (
    <div className={size === "lg" ? "space-y-1.5" : ""}>
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center"
          onMouseLeave={() => setHover(null)}
          role="radiogroup"
          aria-label="Rate this property"
        >
          {STARS.map((value) => {
            const fill = usingHover
              ? value <= Number(display)
                ? 1
                : 0
              : Math.max(0, Math.min(1, Number(display) - (value - 1)));
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={(myRating ?? 0) === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                disabled={busy}
                onMouseEnter={() => setHover(value)}
                onFocus={() => setHover(value)}
                onBlur={() => setHover(null)}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void setRating(value);
                }}
                className="rounded p-0.5 transition hover:scale-110 disabled:opacity-60"
              >
                <StarFill fill={fill} size={iconSize} />
              </button>
            );
          })}
        </div>
        {showLabel && (
          <span
            className={`text-dark-500 font-montserrat ${
              size === "lg" ? "text-sm" : "text-xs"
            }`}
          >
            {ratingCount > 0 ? (
              <>
                <span className="font-semibold text-dark-800">{ratingAvg.toFixed(1)}</span>
                {` (${ratingCount} rating${ratingCount === 1 ? "" : "s"})`}
              </>
            ) : (
              "Rate this property"
            )}
          </span>
        )}
      </div>
      {size === "lg" && (
        <p className="text-xs text-dark-500 font-montserrat">
          {myRating
            ? `You rated this ${myRating} star${myRating === 1 ? "" : "s"}.`
            : "Tap a star to share how you rate this listing."}
        </p>
      )}
    </div>
  );
}
