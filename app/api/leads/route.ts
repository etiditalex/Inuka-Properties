import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { runLeadAutomation } from "@/lib/email/automation";
import { runLeadSmsAutomation } from "@/lib/sms/automation";
import { buildLeadEnrichment, findExistingPropertyLead, isAutoCaptureMessage } from "@/lib/leads/dedupe";
import type { LeadAutomationInput } from "@/lib/email/automation";

function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function runAutomationsSafely(
  supabase: SupabaseClient,
  input: LeadAutomationInput,
  notifyAdmin = true
) {
  const options = { notifyAdmin };
  const emptyEmail = { clientEmailSent: false, adminEmailSent: false, whatsAppAlertSent: false };
  const emptySms = { propertySmsSent: false, adminSmsSent: false };

  const [automation, smsAutomation] = await Promise.all([
    runLeadAutomation(supabase, input, options).catch((error) => {
      console.error("[leads] email automation failed", error);
      return emptyEmail;
    }),
    runLeadSmsAutomation(supabase, input, options).catch((error) => {
      console.error("[leads] sms automation failed", error);
      return emptySms;
    }),
  ]);

  return { automation, smsAutomation };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[leads] invalid JSON body", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const property_id = typeof body.property_id === "number" ? body.property_id : Number(body.property_id) || null;
    const property_name = typeof body.property_name === "string" ? body.property_name : null;
    const landing_page_id =
      typeof body.landing_page_id === "number" ? body.landing_page_id : Number(body.landing_page_id) || null;
    const preferred_date = typeof body.preferred_date === "string" ? body.preferred_date : null;
    const preferred_time = typeof body.preferred_time === "string" ? body.preferred_time : null;
    const message = typeof body.message === "string" ? body.message : null;
    const source = typeof body.source === "string" ? body.source : "site_visit";

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

      const { automation, smsAutomation } = await runAutomationsSafely(
        supabase,
        {
          leadType: "lead",
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
        },
        false
      );

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

    const { automation, smsAutomation } = await runAutomationsSafely(supabase, {
      leadType: "lead",
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
    });

    return NextResponse.json({ success: true, automation, smsAutomation });
  } catch (error) {
    console.error("[leads] submit failed", error);
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }
}
