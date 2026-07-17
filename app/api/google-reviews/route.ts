import { NextResponse } from "next/server";

/** Public Place ID used in the site's "Write a Review" link. */
const DEFAULT_PLACE_ID = "ChIJh7mWVCcTQBgRz0n0qhSMn1Q";

// Near real-time: refresh at most every 2 minutes server-side
export const dynamic = "force-dynamic";
export const revalidate = 0;

type GoogleReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  time?: number;
  relative_time_description?: string;
};

type CacheEntry = {
  expiresAt: number;
  payload: {
    reviews: Array<{
      authorName: string;
      authorPhoto: string | null;
      rating: number;
      text: string;
      time: number;
      relativeTimeDescription: string;
    }>;
    rating: number;
    totalReviews: number;
    placeName: string;
    mapsUrl: string;
    writeReviewUrl: string;
    source: "google";
    fetchedAt: string;
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __iaplGoogleReviewsCache: CacheEntry | undefined;
}

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

function mapsUrlForPlace(placeId: string) {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

function writeReviewUrlForPlace(placeId: string) {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  try {
    const placeId = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          reviews: [],
          rating: 0,
          totalReviews: 0,
          configured: false,
          mapsUrl: mapsUrlForPlace(placeId),
          writeReviewUrl: writeReviewUrlForPlace(placeId),
          error:
            "Google Places API key missing. Add GOOGLE_PLACES_API_KEY in environment variables.",
        },
        { status: 503 }
      );
    }

    const cached = globalThis.__iaplGoogleReviewsCache;
    if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({
        ...cached.payload,
        cached: true,
      });
    }

    const fields = "name,rating,user_ratings_total,reviews,url";
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=${encodeURIComponent(fields)}` +
      `&reviews_sort=newest` +
      `&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Google Places HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      const message =
        data.error_message ||
        (data.status === "REQUEST_DENIED"
          ? "Google Places API denied the request. Enable Billing and Places API on your Google Cloud project."
          : `Google Places API error: ${data.status}`);

      return NextResponse.json(
        {
          reviews: [],
          rating: 0,
          totalReviews: 0,
          configured: true,
          mapsUrl: mapsUrlForPlace(placeId),
          writeReviewUrl: writeReviewUrlForPlace(placeId),
          error: message,
          googleStatus: data.status,
        },
        { status: 502 }
      );
    }

    const reviews = ((data.result?.reviews || []) as GoogleReview[])
      .map((review) => ({
        authorName: review.author_name || "Google user",
        authorPhoto: review.profile_photo_url || null,
        rating: review.rating || 0,
        text: review.text || "",
        time: review.time || 0,
        relativeTimeDescription: review.relative_time_description || "",
      }))
      .filter((review) => review.text.trim().length > 0)
      .sort((a, b) => b.time - a.time);

    const payload = {
      reviews,
      rating: data.result?.rating || 0,
      totalReviews: data.result?.user_ratings_total || reviews.length,
      placeName: data.result?.name || "Inuka Afrika Properties",
      mapsUrl: data.result?.url || mapsUrlForPlace(placeId),
      writeReviewUrl: writeReviewUrlForPlace(placeId),
      source: "google" as const,
      fetchedAt: new Date().toISOString(),
    };

    globalThis.__iaplGoogleReviewsCache = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      payload,
    };

    return NextResponse.json({
      ...payload,
      cached: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    console.error("Error fetching Google Reviews:", error);
    return NextResponse.json(
      {
        reviews: [],
        rating: 0,
        totalReviews: 0,
        mapsUrl: mapsUrlForPlace(DEFAULT_PLACE_ID),
        writeReviewUrl: writeReviewUrlForPlace(DEFAULT_PLACE_ID),
        error: message,
      },
      { status: 500 }
    );
  }
}
