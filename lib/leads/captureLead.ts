import {
  contactFromCurrentVisit,
  getResolvedContact,
  isFacebookAdSession,
  joinFullName,
  markLeadCapturedThisSession,
  normalizeContactForLead,
  resolveContactFormPrefill,
  saveContact,
  wasLeadCapturedThisSession,
  type ContactDetails,
} from "@/lib/leads/contactAutofill";
import {
  bookSiteVisitHref,
  generalSiteVisitWhatsAppUrl,
  propertySiteVisitWhatsAppUrl,
  siteVisitWhatsAppMessage,
  whatsAppUrl,
} from "@/lib/whatsapp";
import { getPropertySeo } from "@/lib/propertySeo";

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  property_id?: number | null;
  property_name?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  source?: string;
};

export function resolveLeadSource(explicit?: string | null): string {
  if (explicit && explicit.trim()) return explicit.trim();
  if (typeof window !== "undefined" && isFacebookAdSession()) return "facebook_ad";
  return "site_visit";
}

export async function submitPropertyLead(payload: LeadPayload): Promise<boolean> {
  const source = resolveLeadSource(payload.source);
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source }),
  });
  if (res.ok) {
    const contact: ContactDetails = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    };
    saveContact(contact);
    markLeadCapturedThisSession(contact);
  }
  return res.ok;
}

/** Auto-save lead when the visit brings usable contact details (URL / Facebook). */
export async function autoCaptureLeadFromVisit(params: URLSearchParams): Promise<boolean> {
  const fromVisit = contactFromCurrentVisit(params);
  const normalized = normalizeContactForLead(fromVisit);
  if (!normalized) return false;
  if (wasLeadCapturedThisSession(normalized)) {
    saveContact(normalized);
    return true;
  }

  const source = isFacebookAdSession() || params.get("fbclid") ? "facebook_ad" : "auto_capture";
  const propertyId = Number(params.get("property_id") || "") || null;
  const propertyName =
    params.get("property_name") ||
    (propertyId ? getPropertySeo(propertyId)?.title : null) ||
    null;

  try {
    const saved = await submitPropertyLead({
      ...normalized,
      property_id: propertyId,
      property_name: propertyName,
      message: "Auto-captured from website visit",
      source,
    });
    return saved;
  } catch {
    return false;
  }
}

/** Save lead to the dashboard, then open WhatsApp with the booking details. */
export async function captureLeadThenOpenWhatsApp(
  payload: LeadPayload & { property: string }
): Promise<{ saved: boolean; whatsappOpened: boolean }> {
  const contact = normalizeContactForLead(payload);
  if (!contact) {
    return { saved: false, whatsappOpened: false };
  }

  let saved = false;
  if (!wasLeadCapturedThisSession(contact)) {
    try {
      saved = await submitPropertyLead({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        property_id: payload.property_id,
        property_name: payload.property_name || payload.property,
        preferred_date: payload.preferred_date,
        preferred_time: payload.preferred_time,
        message: payload.message,
        source: payload.source,
      });
    } catch {
      saved = false;
    }
  } else {
    saved = true;
  }

  const url = whatsAppUrl(
    siteVisitWhatsAppMessage({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      property: payload.property,
      preferredDate: payload.preferred_date || undefined,
      preferredTime: payload.preferred_time || undefined,
      message: payload.message || undefined,
    })
  );

  const win = window.open(url, "_blank");
  const whatsappOpened = Boolean(win && !win.closed);

  return { saved, whatsappOpened };
}

/**
 * If we already know the visitor, save lead (if needed) and open WhatsApp.
 * Otherwise send them to the booking form to collect details.
 */
export async function openBookSiteVisitSmart(options?: {
  propertyId?: number | null;
  propertyTitle?: string | null;
  source?: string;
}): Promise<"whatsapp" | "form"> {
  const params =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined;
  const resolved = getResolvedContact(params);
  const contact = normalizeContactForLead(resolved);

  const propertyTitle =
    options?.propertyTitle ||
    (options?.propertyId ? getPropertySeo(options.propertyId)?.title : null) ||
    "a property";

  if (contact) {
    await captureLeadThenOpenWhatsApp({
      ...contact,
      property: propertyTitle,
      property_id: options?.propertyId ?? null,
      property_name: propertyTitle,
      message: `Booked site visit via ${options?.source || "website"}`,
      source: options?.source || "whatsapp_click",
    });
    return "whatsapp";
  }

  const href = bookSiteVisitHref({
    propertyId: options?.propertyId,
    source: options?.source,
  });
  window.location.href = href;
  return "form";
}

export function prefillFromStoredContact(): {
  name: string;
  email: string;
  phone: string;
} {
  const fields = resolveContactFormPrefill(
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined
  );
  return {
    name: joinFullName(fields.firstName, fields.lastName),
    email: fields.email,
    phone: fields.phone,
  };
}

export function fallbackWhatsAppUrl(propertyTitle?: string | null) {
  return propertyTitle
    ? propertySiteVisitWhatsAppUrl(propertyTitle)
    : generalSiteVisitWhatsAppUrl();
}
