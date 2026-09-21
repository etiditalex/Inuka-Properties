import { NextResponse } from "next/server";
import { fetchPropertyDetail } from "@/lib/properties/getProperties";
import { fetchPropertyEngagement } from "@/lib/properties/engagement";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const property = await fetchPropertyDetail(id);
  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const engagement = await fetchPropertyEngagement(property.id, null).catch(() => null);

  return NextResponse.json({ property, engagement });
}
