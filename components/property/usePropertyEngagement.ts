"use client";

import { useEffect, useState } from "react";
import { EMPTY_ENGAGEMENT, type PropertyEngagementStats } from "@/lib/properties/engagementTypes";
import {
  setPropertyRatingClient,
  subscribePropertyEngagement,
  togglePropertyLikeClient,
} from "@/lib/properties/engagementClient";

export function usePropertyEngagement(propertyId: number) {
  const [stats, setStats] = useState<PropertyEngagementStats>(EMPTY_ENGAGEMENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return subscribePropertyEngagement(propertyId, setStats);
  }, [propertyId]);

  const toggleLike = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await togglePropertyLikeClient(propertyId);
    } catch {
      setError("Could not save your like. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const setRating = async (rating: number) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await setPropertyRatingClient(propertyId, rating);
    } catch {
      setError("Could not save your rating. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return { ...stats, busy, error, toggleLike, setRating };
}
