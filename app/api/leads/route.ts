import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runLeadAutomation } from "@/lib/email/automation";
import { runLeadSmsAutomation } from "@/lib/sms/automation";
import { buildLeadEnrichment, findExistingPropertyLead, isAutoCaptureMessage } from "@/lib/leads/dedupe";

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
      landing_page_id,
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

    const existing = await findExistingPropertyLead(supabase, email, phone);
    if (existing) {
      const enrichment = buildLeadEnrichment(existing, {
        name,
        email,
        phone,
        property_id,
        property_name,
        landing_page_id,
        preferred_date,
        preferred_time,
        message,
        source,
      });

      if (enrichment) {
        await supabase.from("property_leads").update(enrichment).eq("id", existing.id);
      }

      // Repeat form submissions still get the property-details email immediately.
      // Silent auto-capture visits should not re-mail the client.
      if (isAutoCaptureMessage(message)) {
        return NextResponse.json({ success: true, duplicate: true, id: existing.id });
      }

      const repeatInput = {
        leadType: "lead" as const,
        leadId: existing.id,
        name,
        email,
        phone,
        propertyId: property_id || existing.property_id || null,
        propertyName: property_name || existing.property_name || null,
        message,
        preferredDate: preferred_date,
        preferredTime: preferred_time,
        source: source || "site_visit",
        landingPageId: landing_page_id || existing.landing_page_id || null,
      };

      const automation = await runLeadAutomation(supabase, repeatInput, { notifyAdmin: false });
      const smsAutomation = await runLeadSmsAutomation(supabase, repeatInput, { notifyAdmin: false });

      return NextResponse.json({
        success: true,
        duplicate: true,
        id: existing.id,
        automation,
        smsAutomation,
      });
    }

    const { data: inserted, error } = await supabase
      .from("property_leads")
      .insert({
        name,
        email,
        phone,
        property_id: property_id || null,
        property_name: property_name || null,
        landing_page_id: landing_page_id || null,
        preferred_date: preferred_date || null,
        preferred_time: preferred_time || null,
        message: message || null,
        source: source || "site_visit",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const automationInput = {
      leadType: "lead" as const,
      leadId: inserted?.id,
      name,
      email,
      phone,
      propertyId: property_id || null,
      propertyName: property_name || null,
      message,
      preferredDate: preferred_date,
      preferredTime: preferred_time,
      source: source || "site_visit",
      landingPageId: landing_page_id || null,
    };

    const automation = await runLeadAutomation(supabase, automationInput);
    const smsAutomation = await runLeadSmsAutomation(supabase, automationInput);

    return NextResponse.json({ success: true, automation, smsAutomation });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
