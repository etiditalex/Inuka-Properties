import { NextResponse } from "next/server";
import {
  isValidVisitorId,
  parsePropertyId,
  togglePropertyLike,
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
  try {
    const body = await request.json();
    visitorId = body?.visitorId;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isValidVisitorId(visitorId)) {
    return NextResponse.json({ error: "A visitor id is required" }, { status: 400 });
  }

  try {
    const engagement = await togglePropertyLike(propertyId, visitorId);
    if (!engagement) {
      return NextResponse.json({ error: "Likes are temporarily unavailable" }, { status: 503 });
    }
    return NextResponse.json({ success: true, engagement });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save like";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
