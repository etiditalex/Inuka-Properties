"use client";

import PropertyLikeButton from "@/components/property/PropertyLikeButton";
import PropertyStarRating from "@/components/property/PropertyStarRating";
import { usePropertyEngagement } from "@/components/property/usePropertyEngagement";

export default function PropertyEngagementBar({
  propertyId,
}: {
  propertyId: number;
}) {
  const { error } = usePropertyEngagement(propertyId);

  return (
    <div className="space-y-3">
      <PropertyStarRating propertyId={propertyId} size="lg" />
      <PropertyLikeButton propertyId={propertyId} variant="inline" />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
