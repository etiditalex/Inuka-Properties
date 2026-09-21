"use client";

import { Heart } from "lucide-react";
import { usePropertyEngagement } from "@/components/property/usePropertyEngagement";

function formatCount(count: number): string {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`;
}

export default function PropertyLikeButton({
  propertyId,
  variant = "overlay",
}: {
  propertyId: number;
  variant?: "overlay" | "inline";
}) {
  const { liked, likeCount, busy, toggleLike } = usePropertyEngagement(propertyId);
  const label = liked ? "Unlike this property" : "Like this property";

  if (variant === "inline") {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={liked}
        disabled={busy}
        onClick={toggleLike}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition font-montserrat ${
          liked
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-dark-200 bg-white text-dark-800 hover:bg-dark-50"
        } disabled:opacity-60`}
      >
        <Heart
          size={18}
          strokeWidth={1.75}
          className={liked ? "fill-red-500 text-red-500" : "fill-none text-dark-800"}
        />
        {liked ? "Liked" : "Like"}
        <span className="text-dark-500">{formatCount(likeCount)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={liked}
      disabled={busy}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleLike();
      }}
      className="absolute right-3 top-3 z-10 flex min-w-[2.5rem] flex-col items-center justify-center rounded-full border border-dark-100/80 bg-white px-2 py-1.5 shadow-md transition hover:bg-dark-50 disabled:opacity-60 pointer-events-auto"
    >
      <Heart
        size={20}
        strokeWidth={1.5}
        className={liked ? "fill-red-500 text-red-500" : "fill-none text-dark-900"}
      />
      <span className="text-[10px] font-semibold leading-none text-dark-600">
        {formatCount(likeCount)}
      </span>
    </button>
  );
}
