import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property } from "@/lib/supabase/types";
import { buildAdminLeadAlertEmail, buildPropertyDetailsEmail } from "@/lib/email/templates";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export type EmailAutomationSettings = {
  auto_send_property_details: boolean;
  default_property_id: number | null;
  notify_admin_email: boolean;
  notify_admin_whatsapp: boolean;
  admin_whatsapp_number: string;
  facebook_landing_property_id: number | null;
};

export const DEFAULT_EMAIL_AUTOMATION: EmailAutomationSettings = {
  auto_send_property_details: true,
  default_property_id: null,
  notify_admin_email: true,
  notify_admin_whatsapp: false,
  admin_whatsapp_number: WHATSAPP_NUMBER,
  facebook_landing_property_id: null,
};

const PROPERTY_EMAIL_SOURCES = new Set([
  "facebook_ad",
  "homepage_email_widget",
  "homepage_sms_widget",
  "get_property_details",
]);

export type LeadAutomationInput = {
  leadType: "lead" | "inquiry";
  leadId?: string;
  name: string;
  email: string;
  phone?: string | null;
  propertyId?: number | null;
  propertyName?: string | null;
  message?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  subject?: string | null;
  source?: string | null;
};

function getEmailConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY,
    notifyEmail: process.env.NOTIFY_EMAIL || process.env.ADMIN_NOTIFY_EMAIL,
    fromEmail: process.env.EMAIL_FROM || "Inuka Afrika Properties <info@inukaproperties.co.ke>",
  };
}

export async function getEmailAutomationSettings(
  supabase: SupabaseClient
): Promise<EmailAutomationSettings> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "email_automation")
    .single();

  if (!data?.value) return DEFAULT_EMAIL_AUTOMATION;
  return { ...DEFAULT_EMAIL_AUTOMATION, ...(data.value as EmailAutomationSettings) };
}

async function resolveProperty(
  supabase: SupabaseClient,
  propertyId: number | null | undefined,
  propertyName: string | null | undefined,
  settings: EmailAutomationSettings,
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

  // Campaign / homepage widgets: use configured property or latest listing.
  if (source && PROPERTY_EMAIL_SOURCES.has(source)) {
    const fallbackId = settings.default_property_id ?? settings.facebook_landing_property_id;
    if (fallbackId) {
      const { data } = await supabase.from("properties").select("*").eq("id", fallbackId).single();
      if (data) return data as Property;
    }
    const { data: latest } = await supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest) return latest as Property;
  }

  return null;
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const { resendApiKey, fromEmail } = getEmailConfig();
  if (!resendApiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[email]", subject, "→", to);
      return true;
    }
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromEmail, to: [to], subject, html }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    if (process.env.NODE_ENV === "development") {
      console.error("[email] Resend failed:", res.status, errBody);
    }
    return false;
  }

  return true;
}

async function logEmail(
  supabase: SupabaseClient,
  entry: {
    leadType: "lead" | "inquiry";
    leadId?: string;
    recipientEmail: string;
    recipientName?: string;
    propertyId?: number | null;
    propertyTitle?: string | null;
    emailType: "property_details" | "admin_alert" | "manual_resend";
    status: "sent" | "failed";
    errorMessage?: string;
  }
) {
  await supabase.from("email_automation_log").insert({
    lead_type: entry.leadType,
    lead_id: entry.leadId ?? null,
    recipient_email: entry.recipientEmail,
    recipient_name: entry.recipientName ?? null,
    property_id: entry.propertyId ?? null,
    property_title: entry.propertyTitle ?? null,
    email_type: entry.emailType,
    status: entry.status,
    error_message: entry.errorMessage ?? null,
  });
}

function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

function buildWhatsAppLeadUrl(phone: string, propertyTitle?: string | null): string | null {
  const formatted = formatPhoneForWhatsApp(phone);
  if (formatted.length < 10) return null;
  const text = propertyTitle
    ? `Hi, thank you for your interest in ${propertyTitle} at Inuka Afrika Properties. How can we assist you with your site visit?`
    : "Hi, thank you for contacting Inuka Afrika Properties. How can we assist you today?";
  return `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
}

/** Notify admin team via WhatsApp Cloud API if configured, else webhook */
async function sendAdminWhatsAppAlert(
  settings: EmailAutomationSettings,
  payload: LeadAutomationInput & { propertyTitle?: string | null }
): Promise<void> {
  if (!settings.notify_admin_whatsapp) return;

  const adminNumber = settings.admin_whatsapp_number || WHATSAPP_NUMBER;
  const message = [
    `🆕 New ${payload.leadType === "inquiry" ? "Inquiry" : "Lead"} — Inuka Afrika Properties`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.propertyTitle ? `Property: ${payload.propertyTitle}` : null,
    payload.message ? `Message: ${payload.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (token && phoneNumberId) {
    try {
      await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formatPhoneForWhatsApp(adminNumber),
          type: "text",
          text: { body: message },
        }),
      });
      return;
    } catch {
      // fall through to webhook
    }
  }

  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: payload.leadType, admin_whatsapp: adminNumber, ...payload }),
      });
    } catch {
      // silent — email is primary channel
    }
  }
}

export async function runLeadAutomation(
  supabase: SupabaseClient,
  input: LeadAutomationInput
): Promise<{ propertyEmailSent: boolean; adminEmailSent: boolean }> {
  const settings = await getEmailAutomationSettings(supabase);
  const property = await resolveProperty(
    supabase,
    input.propertyId,
    input.propertyName,
    settings,
    input.source
  );

  let propertyEmailSent = false;
  let adminEmailSent = false;

  if (settings.auto_send_property_details && property) {
    const { subject, html } = buildPropertyDetailsEmail({
      leadName: input.name,
      property,
    });
    const ok = await sendResendEmail(input.email, subject, html);
    propertyEmailSent = ok;
    await logEmail(supabase, {
      leadType: input.leadType,
      leadId: input.leadId,
      recipientEmail: input.email,
      recipientName: input.name,
      propertyId: property.id,
      propertyTitle: property.title,
      emailType: "property_details",
      status: ok ? "sent" : "failed",
      errorMessage: ok ? undefined : "Resend send failed",
    });
  }

  if (settings.notify_admin_email) {
    const { notifyEmail } = getEmailConfig();
    if (notifyEmail) {
      const whatsAppLeadUrl = input.phone
        ? buildWhatsAppLeadUrl(input.phone, property?.title ?? input.propertyName)
        : null;
      const { subject, html } = buildAdminLeadAlertEmail({
        type: input.leadType,
        name: input.name,
        email: input.email,
        phone: input.phone,
        propertyTitle: property?.title ?? input.propertyName,
        propertyId: property?.id ?? input.propertyId,
        message: input.message,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        subject: input.subject,
        whatsAppLeadUrl,
      });
      const ok = await sendResendEmail(notifyEmail, subject, html);
      adminEmailSent = ok;
      await logEmail(supabase, {
        leadType: input.leadType,
        leadId: input.leadId,
        recipientEmail: notifyEmail,
        recipientName: "Admin",
        propertyId: property?.id ?? input.propertyId,
        propertyTitle: property?.title ?? input.propertyName,
        emailType: "admin_alert",
        status: ok ? "sent" : "failed",
      });
    }
  }

  await sendAdminWhatsAppAlert(settings, {
    ...input,
    propertyTitle: property?.title ?? input.propertyName,
  });

  return { propertyEmailSent, adminEmailSent };
}
