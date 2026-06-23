import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property } from "@/lib/supabase/types";
import { formatPhoneKenyaE164 } from "@/lib/phone/kenya";
import { sendSms } from "@/lib/sms/provider";
import {
  DEFAULT_SMS_AUTOMATION,
  type SmsAutomationSettings,
} from "@/lib/sms/settings";
import { buildAdminAlertSms, buildPropertyDetailsSms } from "@/lib/sms/templates";
import type { LeadAutomationInput } from "@/lib/email/automation";
import { getEmailAutomationSettings } from "@/lib/email/automation";

export type { SmsAutomationSettings };
export { DEFAULT_SMS_AUTOMATION };

export async function getSmsAutomationSettings(
  supabase: SupabaseClient
): Promise<SmsAutomationSettings> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "sms_automation")
    .single();

  if (!data?.value) return DEFAULT_SMS_AUTOMATION;
  return { ...DEFAULT_SMS_AUTOMATION, ...(data.value as SmsAutomationSettings) };
}

async function resolvePropertyForSms(
  supabase: SupabaseClient,
  propertyId: number | null | undefined,
  propertyName: string | null | undefined,
  settings: SmsAutomationSettings,
  source?: string | null
): Promise<Property | null> {
  if (propertyId) {
    const { data } = await supabase.from("properties").select("*").eq("id", propertyId).single();
    if (data) return data as Property;
  }

  if (propertyName) {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .ilike("title", `%${propertyName}%`)
      .eq("published", true)
      .limit(1)
      .maybeSingle();
    if (data) return data as Property;
  }

  if (source === "facebook_ad") {
    const fallbackId = settings.default_property_id ?? settings.facebook_landing_property_id;
    if (fallbackId) {
      const { data } = await supabase.from("properties").select("*").eq("id", fallbackId).single();
      if (data) return data as Property;
    }
  }

  return null;
}

async function logSms(
  supabase: SupabaseClient,
  entry: {
    leadType?: "lead" | "inquiry" | null;
    leadId?: string;
    recipientPhone: string;
    recipientName?: string;
    propertyId?: number | null;
    propertyTitle?: string | null;
    smsType: "property_details" | "admin_alert" | "bulk_campaign" | "manual";
    status: "sent" | "failed";
    messageBody: string;
    providerMessageId?: string;
    errorMessage?: string;
  }
) {
  await supabase.from("sms_automation_log").insert({
    lead_type: entry.leadType ?? null,
    lead_id: entry.leadId ?? null,
    recipient_phone: entry.recipientPhone,
    recipient_name: entry.recipientName ?? null,
    property_id: entry.propertyId ?? null,
    property_title: entry.propertyTitle ?? null,
    sms_type: entry.smsType,
    status: entry.status,
    message_body: entry.messageBody,
    provider_message_id: entry.providerMessageId ?? null,
    error_message: entry.errorMessage ?? null,
  });
}

export async function runLeadSmsAutomation(
  supabase: SupabaseClient,
  input: LeadAutomationInput
): Promise<{ propertySmsSent: boolean; adminSmsSent: boolean }> {
  const settings = await getSmsAutomationSettings(supabase);
  const emailSettings = await getEmailAutomationSettings(supabase);

  const property = await resolvePropertyForSms(
    supabase,
    input.propertyId,
    input.propertyName,
    {
      ...settings,
      default_property_id: settings.default_property_id ?? emailSettings.default_property_id,
      facebook_landing_property_id:
        settings.facebook_landing_property_id ?? emailSettings.facebook_landing_property_id,
    },
    input.source
  );

  let propertySmsSent = false;
  let adminSmsSent = false;

  if (settings.auto_send_property_details_sms && property && input.phone) {
    const message = buildPropertyDetailsSms({
      template: settings.property_template,
      leadName: input.name,
      property,
    });
    const result = await sendSms(input.phone, message, settings.sender_id);
    propertySmsSent = result.ok;
    await logSms(supabase, {
      leadType: input.leadType,
      leadId: input.leadId,
      recipientPhone: formatPhoneKenyaE164(input.phone),
      recipientName: input.name,
      propertyId: property.id,
      propertyTitle: property.title,
      smsType: "property_details",
      status: result.ok ? "sent" : "failed",
      messageBody: message,
      providerMessageId: result.providerMessageId,
      errorMessage: result.error,
    });
  }

  if (settings.notify_admin_sms && settings.admin_sms_number) {
    const message = buildAdminAlertSms({
      template: settings.admin_template,
      type: input.leadType,
      name: input.name,
      phone: input.phone,
      propertyTitle: property?.title ?? input.propertyName,
    });
    const result = await sendSms(settings.admin_sms_number, message, settings.sender_id);
    adminSmsSent = result.ok;
    await logSms(supabase, {
      leadType: input.leadType,
      leadId: input.leadId,
      recipientPhone: formatPhoneKenyaE164(settings.admin_sms_number),
      recipientName: "Admin",
      propertyId: property?.id ?? input.propertyId,
      propertyTitle: property?.title ?? input.propertyName,
      smsType: "admin_alert",
      status: result.ok ? "sent" : "failed",
      messageBody: message,
      providerMessageId: result.providerMessageId,
      errorMessage: result.error,
    });
  }

  return { propertySmsSent, adminSmsSent };
}

export async function getSmsInsights(supabase: SupabaseClient) {
  const { data: logs } = await supabase
    .from("sms_automation_log")
    .select("status, sms_type, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const all = logs || [];
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = all.filter((l) => l.created_at?.startsWith(today));
  const sent = all.filter((l) => l.status === "sent").length;
  const failed = all.filter((l) => l.status === "failed").length;
  const sentToday = todayLogs.filter((l) => l.status === "sent").length;
  const failedToday = todayLogs.filter((l) => l.status === "failed").length;

  const byType: Record<string, number> = {};
  for (const log of all) {
    byType[log.sms_type] = (byType[log.sms_type] || 0) + 1;
  }

  return {
    total: all.length,
    sent,
    failed,
    sentToday,
    failedToday,
    successRate: all.length ? Math.round((sent / all.length) * 100) : 0,
    byType,
  };
}
