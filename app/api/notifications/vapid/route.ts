import { NextResponse } from "next/server";
import { vapidPublicKey } from "@/lib/notifications/signals";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ publicKey: vapidPublicKey() });
}
