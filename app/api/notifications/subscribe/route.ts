import { NextResponse } from "next/server";
import { saveSubscription } from "@/lib/notifications/signals";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const visitorId = String(body?.visitorId || "").trim();
  if (!visitorId) {
    return NextResponse.json({ error: "A visitor id is required" }, { status: 400 });
  }

  const subscription = body?.subscription;
  const endpoint = subscription?.endpoint ? String(subscription.endpoint) : null;
  if (endpoint && !endpoint.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid push endpoint" }, { status: 400 });
  }

  const result = await saveSubscription({
    visitorId,
    enabled: body?.enabled !== false,
    endpoint,
    p256dh: subscription?.keys?.p256dh ? String(subscription.keys.p256dh) : null,
    authKey: subscription?.keys?.auth ? String(subscription.keys.auth) : null,
  });

  if (!result.saved) {
    return NextResponse.json({ saved: false, reason: result.reason }, { status: 202 });
  }
  return NextResponse.json({ saved: true });
}
