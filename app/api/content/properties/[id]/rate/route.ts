import { NextResponse } from "next/server";
import {
  isValidVisitorId,
  parsePropertyId,
  parseRating,
  setPropertyRating,
} from "@/lib/properties/engagement";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const propertyId = parsePropertyId(params.id);
  if (!propertyId) {
    return NextResponse.json({ error: "Invalid property" }, { status: 400 });
  }

  let visitorId = "";
  let rating: unknown;
  try {
    const body = await request.json();
    visitorId = body?.visitorId;
    rating = body?.rating;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isValidVisitorId(visitorId)) {
    return NextResponse.json({ error: "A visitor id is required" }, { status: 400 });
  }

  const parsedRating = parseRating(rating);
  if (!parsedRating) {
    return NextResponse.json({ error: "Rating must be between 1 and 5 stars" }, { status: 400 });
  }

  try {
    const engagement = await setPropertyRating(propertyId, visitorId, parsedRating);
    if (!engagement) {
      return NextResponse.json({ error: "Ratings are temporarily unavailable" }, { status: 503 });
    }
    return NextResponse.json({ success: true, engagement });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save rating";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
