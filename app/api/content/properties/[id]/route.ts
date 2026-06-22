import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { fetchPropertyDetail } from "@/lib/properties/getProperties";

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

  return NextResponse.json({ property });
}
