import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { FacebookEventName, FacebookPixelEventPayload } from "@/lib/facebook/pixel";

const VALID_EVENTS: FacebookEventName[] = [
  "PageView",
  "ViewContent",
  "Contact",
  "Lead",
  "Schedule",
];

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FacebookPixelEventPayload;
    const eventName = body.event_name;

    if (!eventName || !VALID_EVENTS.includes(eventName)) {
      return NextResponse.json({ error: "Invalid event name" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ success: true, offline: true });
    }

    const userAgent = request.headers.get("user-agent");

    const { error } = await supabase.from("facebook_pixel_events").insert({
      event_name: eventName,
      property_id: body.property_id ?? null,
      property_name: body.property_name ?? null,
      page_path: body.page_path ?? null,
      event_data: body.event_data ?? {},
      user_agent: userAgent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
