import { NextResponse } from "next/server";
import { listRecentSignals } from "@/lib/notifications/signals";

export const dynamic = "force-dynamic";

export async function GET() {
  const signals = await listRecentSignals();
  return NextResponse.json({ signals }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
