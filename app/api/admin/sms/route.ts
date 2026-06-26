import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  DEFAULT_SMS_AUTOMATION,
  type SmsAutomationSettings,
  getSmsInsights,
} from "@/lib/sms/automation";
import { renderSmsTemplate, smsStats } from "@/lib/sms/templates";
import { sendBulkSms, sendSms, getOkaySmsMessage, listOkaySmsMessages } from "@/lib/sms/provider";
import { formatPhoneKenyaE164 } from "@/lib/phone/kenya";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({
      settings: DEFAULT_SMS_AUTOMATION,
      logs: [],
      insights: { total: 0, sent: 0, failed: 0, sentToday: 0, failedToday: 0, successRate: 0, byType: {} },
      recipientCounts: { leads: 0, inquiries: 0, all: 0 },
      properties: [],
    });
  }

  const [
    { data: settingsRow },
    { data: logs },
    insights,
    { data: leads },
    { data: inquiries },
    { data: properties },
  ] = await Promise.all([
    service.from("site_settings").select("value").eq("key", "sms_automation").single(),
    service
      .from("sms_automation_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    getSmsInsights(service),
    service.from("property_leads").select("phone, name"),
    service.from("inquiries").select("phone, name").not("phone", "is", null),
    service
      .from("properties")
      .select("id, title, location, price")
      .eq("published", true)
      .order("created_at", { ascending: false }),
  ]);

  const settings: SmsAutomationSettings = settingsRow?.value
    ? { ...DEFAULT_SMS_AUTOMATION, ...(settingsRow.value as SmsAutomationSettings) }
    : DEFAULT_SMS_AUTOMATION;

  const phones = new Set<string>();
  for (const row of leads || []) {
    if (row.phone) phones.add(formatPhoneKenyaE164(row.phone));
  }
  for (const row of inquiries || []) {
    if (row.phone) phones.add(formatPhoneKenyaE164(row.phone));
  }

  return NextResponse.json({
    settings,
    logs: logs || [],
    insights,
    recipientCounts: {
      leads: (leads || []).length,
      inquiries: (inquiries || []).length,
      all: phones.size,
    },
    properties: properties || [],
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  if (!service) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const body = await request.json();

  if (body.action === "send_bulk") {
    const { message, audience, phones: customPhones, property_id } = body;
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { data: settingsRow } = await service
      .from("site_settings")
      .select("value")
      .eq("key", "sms_automation")
      .single();
    const settings: SmsAutomationSettings = settingsRow?.value
      ? { ...DEFAULT_SMS_AUTOMATION, ...(settingsRow.value as SmsAutomationSettings) }
      : DEFAULT_SMS_AUTOMATION;

    let propertyVars: Record<string, string> = {};
    if (property_id) {
      const { data: property } = await service
        .from("properties")
        .select("id, title, location, price")
        .eq("id", Number(property_id))
        .single();
      if (property) {
        const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.inukaproperties.co.ke";
        propertyVars = {
          property: property.title,
          price: property.price,
          location: property.location,
          link: `${site.replace(/^https?:\/\//, "")}/for-sale/${property.id}`,
        };
      }
    }

    type Recipient = { phone: string; name: string };
    let recipients: Recipient[] = [];

    if (audience === "custom" && Array.isArray(customPhones)) {
      recipients = customPhones.map((p: string) => ({ phone: p, name: "Client" }));
    } else if (audience === "leads") {
      const { data } = await service.from("property_leads").select("phone, name");
      recipients = (data || []).filter((r) => r.phone) as Recipient[];
    } else if (audience === "inquiries") {
      const { data } = await service.from("inquiries").select("phone, name").not("phone", "is", null);
      recipients = (data || []) as Recipient[];
    } else {
      const [{ data: leadRows }, { data: inquiryRows }] = await Promise.all([
        service.from("property_leads").select("phone, name"),
        service.from("inquiries").select("phone, name").not("phone", "is", null),
      ]);
      const seen = new Set<string>();
      for (const row of [...(leadRows || []), ...(inquiryRows || [])]) {
        if (!row.phone) continue;
        const phone = formatPhoneKenyaE164(row.phone);
        if (seen.has(phone)) continue;
        seen.add(phone);
        recipients.push({ phone: row.phone, name: row.name });
      }
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found for this audience" }, { status: 400 });
    }

    const payload = recipients.map((r) => ({
      phone: r.phone,
      message: renderSmsTemplate(message, {
        name: r.name,
        whatsapp: "0711 082 084",
        ...propertyVars,
      }),
    }));

    const { sent, failed, results } = await sendBulkSms(payload, settings.sender_id);

    for (let i = 0; i < payload.length; i++) {
      const r = recipients[i];
      const result = results[i];
      await service.from("sms_automation_log").insert({
        recipient_phone: formatPhoneKenyaE164(r.phone),
        recipient_name: r.name,
        property_id: property_id ? Number(property_id) : null,
        sms_type: "bulk_campaign",
        status: result?.ok ? "sent" : "failed",
        message_body: payload[i].message,
        provider_message_id: result?.providerMessageId ?? null,
        error_message: result?.error ?? null,
      });
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: recipients.length,
      stats: smsStats(message),
    });
  }

  if (body.action === "message_status") {
    const { uid } = body;
    if (!uid?.trim()) {
      return NextResponse.json({ error: "Message uid is required" }, { status: 400 });
    }
    const result = await getOkaySmsMessage(String(uid).trim());
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: result.data });
  }

  if (body.action === "list_messages") {
    const result = await listOkaySmsMessages();
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: result.data });
  }

  if (body.action === "send_test") {
    const { phone, message } = body;
    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and message required" }, { status: 400 });
    }
    const { data: settingsRow } = await service
      .from("site_settings")
      .select("value")
      .eq("key", "sms_automation")
      .single();
    const settings: SmsAutomationSettings = settingsRow?.value
      ? { ...DEFAULT_SMS_AUTOMATION, ...(settingsRow.value as SmsAutomationSettings) }
      : DEFAULT_SMS_AUTOMATION;

    const result = await sendSms(phone, message, settings.sender_id);
    await service.from("sms_automation_log").insert({
      recipient_phone: formatPhoneKenyaE164(phone),
      sms_type: "manual",
      status: result.ok ? "sent" : "failed",
      message_body: message,
      provider_message_id: result.providerMessageId ?? null,
      error_message: result.error ?? null,
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error || "SMS send failed" }, { status: 502 });
    }
    return NextResponse.json({ success: true, provider_message_id: result.providerMessageId });
  }

  const settings: SmsAutomationSettings = {
    ...DEFAULT_SMS_AUTOMATION,
    ...body,
    default_property_id: body.default_property_id ? Number(body.default_property_id) : null,
    facebook_landing_property_id: body.facebook_landing_property_id
      ? Number(body.facebook_landing_property_id)
      : null,
  };

  const { error } = await service.from("site_settings").upsert({
    key: "sms_automation",
    value: settings,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, settings });
}
