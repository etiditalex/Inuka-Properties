import { NextResponse } from "next/server";
import { fetchPublishedProperties } from "@/lib/properties/getProperties";

export async function GET() {
  const properties = await fetchPublishedProperties();
  return NextResponse.json({ properties });
}
