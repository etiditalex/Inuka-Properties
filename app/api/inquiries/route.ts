import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runLeadAutomation } from "@/lib/email/automation";
import { runLeadSmsAutomation } from "@/lib/sms/automation";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, source, property_id, property_name } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ success: true, offline: true });
    }

    const { data: inserted, error } = await supabase
      .from("inquiries")
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        source: source || "contact_form",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const isPropertyInquiry =
      subject === "property-inquiry" || source === "facebook_ad" || Boolean(property_id);

    const automation = await runLeadAutomation(supabase, {
      leadType: "inquiry",
      leadId: inserted?.id,
      name,
      email,
      phone,
      propertyId: property_id || null,
      propertyName: property_name || null,
      message,
      subject,
      source: source || "contact_form",
    });

    const smsAutomation = phone
      ? await runLeadSmsAutomation(supabase, {
          leadType: "inquiry",
          leadId: inserted?.id,
          name,
          email,
          phone,
          propertyId: property_id || null,
          propertyName: property_name || null,
          message,
          subject,
          source: source || "contact_form",
        })
      : { propertySmsSent: false, adminSmsSent: false };

    return NextResponse.json({ success: true, automation, smsAutomation, propertyInquiry: isPropertyInquiry });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
