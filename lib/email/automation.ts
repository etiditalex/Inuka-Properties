import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property } from "@/lib/supabase/types";
import {
  buildAdminLeadAlertEmail,
  buildInquiryAcknowledgmentEmail,
  buildPropertyDetailsEmail,
} from "@/lib/email/templates";
import { isPlaceholderLeadEmail } from "@/lib/leads/dedupe";
import { getStaticPropertyDetail } from "@/lib/properties/getProperties";
import { sendSms } from "@/lib/sms/provider";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { SILENT_WHATSAPP_LEAD_NUMBERS } from "@/lib/whatsapp-internal";
import type { PropertyDetail } from "@/lib/properties/mapProperty";

export type EmailAutomationSettings = {
  auto_send_property_details: boolean;
  auto_send_inquiry_acknowledgment: boolean;
  default_property_id: number | null;
  notify_admin_email: boolean;
  notify_admin_whatsapp: boolean;
  admin_whatsapp_number: string;
  facebook_landing_property_id: number | null;
};

export const DEFAULT_EMAIL_AUTOMATION: EmailAutomationSettings = {
  auto_send_property_details: true,
  auto_send_inquiry_acknowledgment: true,
  default_property_id: null,
  notify_admin_email: true,
  notify_admin_whatsapp: true,
  admin_whatsapp_number: WHATSAPP_NUMBER,
  facebook_landing_property_id: null,
};

const PROPERTY_EMAIL_SOURCES = new Set([
  "facebook_ad",
  "homepage_email_widget",
  "homepage_sms_widget",
  "get_property_details",
  "instagram_ad",
  "google_ad",
  "tiktok_ad",
  "whatsapp_campaign",
  "email_campaign",
  "landing_page",
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
  landingPageId?: number | null;
};

export type LeadAutomationOptions = {
  notifyAdmin?: boolean;
};

const UNSENDABLE_CLIENT_EMAILS = new Set([
  "chatbot@inukaproperties.co.ke",
]);

export function isSendableClientEmail(email: string | null | undefined): boolean {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) return false;
  if (isPlaceholderLeadEmail(normalized)) return false;
  if (UNSENDABLE_CLIENT_EMAILS.has(normalized)) return false;
  return true;
}

function isListedOnWebsite(property: Pick<Property, "published"> | null | undefined): boolean {
  return property?.published === true;
}

function propertyFromStaticDetail(detail: PropertyDetail): Property {
  return {
    id: detail.id,
    title: detail.title,
    location: detail.location,
    type: detail.type,
    price: detail.price,
    price_amount: null,
    size: detail.size,
    bedrooms: detail.bedrooms ?? null,
    image: detail.image,
    gallery: detail.gallery ?? [],
    status: (detail.status as Property["status"]) || "available",
    featured: false,
    features: detail.features ?? [],
    description: detail.description ?? null,
    h1: detail.h1 ?? null,
    map_link: detail.mapLink ?? null,
    pricing: detail.pricing ?? {},
    payment_plan: detail.paymentPlan ?? null,
    quick_info: detail.quickInfo ?? {},
    total_units: 0,
    sold_units: 0,
    auto_sold_out: false,
    published: true,
    created_at: "",
    updated_at: "",
  };
}

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

async function fetchListedProperty(
  supabase: SupabaseClient,
  propertyId: number
): Promise<Property | null> {
  const { data } = await supabase.from("properties").select("*").eq("id", propertyId).maybeSingle();
  if (data) {
    return isListedOnWebsite(data as Property) ? (data as Property) : null;
  }

  const staticDetail = getStaticPropertyDetail(propertyId);
  return staticDetail ? propertyFromStaticDetail(staticDetail) : null;
}

async function resolveProperty(
  supabase: SupabaseClient,
  propertyId: number | null | undefined,
  propertyName: string | null | undefined,
  settings: EmailAutomationSettings,
  source?: string | null
): Promise<Property | null> {
  if (propertyId) {
    const byId = await fetchListedProperty(supabase, propertyId);
    if (byId) return byId;
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
      const fallback = await fetchListedProperty(supabase, fallbackId);
      if (fallback) return fallback;
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

async function resolvePaymentPlanNote(
  supabase: SupabaseClient,
  landingPageId?: number | null
): Promise<string | null> {
  if (!landingPageId) return null;
  const { data } = await supabase
    .from("landing_pages")
    .select("payment_plan_note")
    .eq("id", landingPageId)
    .maybeSingle();
  const note = data?.payment_plan_note;
  return typeof note === "string" && note.trim() ? note.trim() : null;
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

function buildAdminAlertMessage(
  payload: LeadAutomationInput & { propertyTitle?: string | null; ticketNumber?: number }
): string {
  const label =
    payload.ticketNumber != null
      ? `Ticket #${payload.ticketNumber}`
      : payload.leadType === "inquiry"
        ? "Inquiry"
        : "Lead";

  return [
    `🆕 New ${label} — Inuka Afrika Properties`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.propertyTitle ? `Property: ${payload.propertyTitle}` : null,
    payload.subject ? `Subject: ${payload.subject}` : null,
    payload.message ? `Message: ${payload.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function getWhatsAppAlertRecipients(settings: EmailAutomationSettings): string[] {
  const configured = settings.notify_admin_whatsapp
    ? [settings.admin_whatsapp_number || WHATSAPP_NUMBER]
    : [];
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const raw of [...configured, ...SILENT_WHATSAPP_LEAD_NUMBERS]) {
    const formatted = formatPhoneForWhatsApp(raw);
    if (formatted.length < 10 || seen.has(formatted)) continue;
    seen.add(formatted);
    unique.push(formatted);
  }

  return unique;
}

async function sendWhatsAppAlertToNumber(
  adminNumber: string,
  message: string,
  payload: LeadAutomationInput & { propertyTitle?: string | null; ticketNumber?: number }
): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (token && phoneNumberId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: adminNumber,
          type: "text",
          text: { body: message },
        }),
      });
      if (res.ok) return true;
    } catch {
      // fall through
    }
  }

  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: payload.leadType, admin_whatsapp: adminNumber, ...payload }),
      });
      if (res.ok) return true;
    } catch {
      // fall through
    }
  }

  const smsResult = await sendSms(adminNumber, message.slice(0, 480));
  if (smsResult.ok) return true;

  if (process.env.NODE_ENV === "development") {
    console.log("[whatsapp-alert]", adminNumber, message);
    return true;
  }

  return false;
}

/** Notify admin team via WhatsApp Cloud API, webhook, or SMS fallback. */
export async function sendAdminWhatsAppAlert(
  settings: EmailAutomationSettings,
  payload: LeadAutomationInput & { propertyTitle?: string | null; ticketNumber?: number }
): Promise<boolean> {
  const recipients = getWhatsAppAlertRecipients(settings);
  if (recipients.length === 0) return false;

  const message = buildAdminAlertMessage(payload);
  const results = await Promise.all(
    recipients.map((number) => sendWhatsAppAlertToNumber(number, message, payload))
  );
  return results.some(Boolean);
}

async function sendClientAutoReply(
  supabase: SupabaseClient,
  settings: EmailAutomationSettings,
  input: LeadAutomationInput,
  property: Property | null,
  paymentPlanNote?: string | null
): Promise<boolean> {
  if (!isSendableClientEmail(input.email)) return false;

  if (settings.auto_send_property_details && property) {
    const { subject, html } = buildPropertyDetailsEmail({
      leadName: input.name,
      property,
      paymentPlanNote,
    });
    const ok = await sendResendEmail(input.email, subject, html);
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
    return ok;
  }

  if (!settings.auto_send_inquiry_acknowledgment) return false;

  const { subject, html } = buildInquiryAcknowledgmentEmail({
    leadName: input.name,
    propertyTitle: property?.title ?? input.propertyName,
    message: input.message,
    subject: input.subject,
  });
  const ok = await sendResendEmail(input.email, subject, html);
  await logEmail(supabase, {
    leadType: input.leadType,
    leadId: input.leadId,
    recipientEmail: input.email,
    recipientName: input.name,
    propertyId: property?.id ?? input.propertyId,
    propertyTitle: property?.title ?? input.propertyName,
    emailType: "property_details",
    status: ok ? "sent" : "failed",
    errorMessage: ok ? undefined : "Resend send failed",
  });
  return ok;
}

async function sendAdminEmailAlert(
  supabase: SupabaseClient,
  settings: EmailAutomationSettings,
  input: LeadAutomationInput,
  property: Property | null
): Promise<boolean> {
  if (!settings.notify_admin_email) return false;

  const { notifyEmail } = getEmailConfig();
  if (!notifyEmail) return false;

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
  return ok;
}

export async function runLeadAutomation(
  supabase: SupabaseClient,
  input: LeadAutomationInput,
  options?: LeadAutomationOptions
): Promise<{ clientEmailSent: boolean; adminEmailSent: boolean; whatsAppAlertSent: boolean }> {
  const notifyAdmin = options?.notifyAdmin !== false;
  const settings = await getEmailAutomationSettings(supabase);
  const [property, paymentPlanNote] = await Promise.all([
    resolveProperty(
      supabase,
      input.propertyId,
      input.propertyName,
      settings,
      input.source
    ),
    resolvePaymentPlanNote(supabase, input.landingPageId),
  ]);

  const propertyTitle = property?.title ?? input.propertyName;

  const [clientEmailSent, adminEmailSent, whatsAppAlertSent] = await Promise.all([
    sendClientAutoReply(supabase, settings, input, property, paymentPlanNote),
    notifyAdmin ? sendAdminEmailAlert(supabase, settings, input, property) : Promise.resolve(false),
    notifyAdmin ? sendAdminWhatsAppAlert(settings, { ...input, propertyTitle }) : Promise.resolve(false),
  ]);

  return { clientEmailSent, adminEmailSent, whatsAppAlertSent };
}
