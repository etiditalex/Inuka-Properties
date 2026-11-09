import { NextResponse } from "next/server";
import { cleanVisitorId, getPlayDay } from "@/lib/play/daily";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const visitorId = cleanVisitorId(new URL(request.url).searchParams.get("visitorId"));
  const { publicPlay } = await getPlayDay(visitorId);
  return NextResponse.json(publicPlay, { headers: { "Cache-Control": "no-store" } });
}
