import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAdminNotification, shouldNotify } from "@/lib/notifications";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      property_id,
      property_name,
      preferred_date,
      preferred_time,
      message,
      source,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ success: true, offline: true });
    }

    const { error } = await supabase.from("property_leads").insert({
      name,
      email,
      phone,
      property_id: property_id || null,
      property_name: property_name || null,
      preferred_date: preferred_date || null,
      preferred_time: preferred_time || null,
      message: message || null,
      source: source || "site_visit",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (await shouldNotify(supabase, "notify_new_leads")) {
      await sendAdminNotification({
        type: "lead",
        name,
        email,
        phone,
        propertyName: property_name,
        preferredDate: preferred_date,
        preferredTime: preferred_time,
        message,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
