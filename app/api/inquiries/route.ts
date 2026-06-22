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
    const { name, email, phone, subject, message, source } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ success: true, offline: true });
    }

    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      source: source || "contact_form",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (await shouldNotify(supabase, "notify_new_inquiries")) {
      await sendAdminNotification({
        type: "inquiry",
        name,
        email,
        phone,
        subject,
        message,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
