import type { Property } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://www.inukaproperties.co.ke";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildPropertyDetailsEmail(params: {
  leadName: string;
  property: Pick<Property, "id" | "title" | "location" | "price" | "size" | "description" | "image">;
}): { subject: string; html: string } {
  const { leadName, property } = params;
  const propertyUrl = `${siteUrl()}/for-sale/${property.id}`;
  const description = property.description
    ? escapeHtml(property.description.slice(0, 600)) + (property.description.length > 600 ? "…" : "")
    : "Contact us for full project details and to book a site visit.";

  const subject = `Property Details: ${property.title} — Inuka Afrika Properties`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827">
      <div style="background:linear-gradient(135deg,#0284c7,#075985);padding:28px 24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Your Property Details</h1>
        <p style="color:#e0f2fe;margin:8px 0 0;font-size:14px">Inuka Afrika Properties Limited</p>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:16px;line-height:1.6">Dear ${escapeHtml(leadName)},</p>
        <p style="font-size:15px;line-height:1.6;color:#374151">
          Thank you for your interest. Here are the details for the project you enquired about:
        </p>
        ${property.image ? `<img src="${escapeHtml(property.image)}" alt="${escapeHtml(property.title)}" style="width:100%;max-height:280px;object-fit:cover;border-radius:10px;margin:16px 0" />` : ""}
        <h2 style="font-size:20px;color:#0369a1;margin:20px 0 8px">${escapeHtml(property.title)}</h2>
        <p style="margin:4px 0;color:#4b5563"><strong>Location:</strong> ${escapeHtml(property.location)}</p>
        <p style="margin:4px 0;color:#4b5563"><strong>Price:</strong> ${escapeHtml(property.price)}</p>
        <p style="margin:4px 0;color:#4b5563"><strong>Size:</strong> ${escapeHtml(property.size)}</p>
        <p style="margin:16px 0;font-size:14px;line-height:1.7;color:#374151;white-space:pre-line">${description}</p>
        <a href="${propertyUrl}" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 8px 8px 0">View Full Listing</a>
        <a href="https://wa.me/254711082084?text=${encodeURIComponent(`Hi, I enquired about ${property.title}. I would like to book a site visit.`)}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 0">Chat on WhatsApp</a>
        <p style="margin-top:24px;font-size:13px;color:#6b7280">
          Call us: <a href="tel:+254711082084" style="color:#0284c7">0711 082 084</a> ·
          Email: <a href="mailto:info@inukaproperties.co.ke" style="color:#0284c7">info@inukaproperties.co.ke</a>
        </p>
      </div>
      <p style="text-align:center;font-size:11px;color:#9ca3af;padding:16px">© Inuka Afrika Properties Limited</p>
    </div>
  `;

  return { subject, html };
}

export function buildAdminLeadAlertEmail(params: {
  type: "lead" | "inquiry";
  name: string;
  email: string;
  phone?: string | null;
  propertyTitle?: string | null;
  propertyId?: number | null;
  message?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  subject?: string | null;
  whatsAppLeadUrl?: string | null;
}): { subject: string; html: string } {
  const subject =
    params.type === "inquiry"
      ? `🔔 New Inquiry: ${params.name}`
      : `🔔 New Lead: ${params.propertyTitle || params.name}`;

  const rows = [
    ["Name", params.name],
    ["Email", params.email],
    params.phone ? ["Phone", params.phone] : null,
    params.subject ? ["Subject", params.subject] : null,
    params.propertyTitle ? ["Property", params.propertyTitle] : null,
    params.preferredDate ? ["Preferred Date", params.preferredDate] : null,
    params.preferredTime ? ["Preferred Time", params.preferredTime] : null,
    params.message ? ["Message", params.message] : null,
  ].filter(Boolean) as [string, string][];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#0369a1;border-bottom:1px solid #e5e7eb;width:140px">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const dashboardUrl = `${siteUrl()}${adminPath(params.type === "inquiry" ? "inquiries" : "leads")}`;
  const whatsAppBlock = params.whatsAppLeadUrl
    ? `<a href="${params.whatsAppLeadUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">Reply to lead on WhatsApp</a>`
    : "";

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#0284c7,#075985);padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">New ${params.type === "inquiry" ? "Inquiry" : "Lead"} — Action Required</h1>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <p style="color:#374151;margin:0 0 16px">A new ${params.type} was captured from the website (e.g. Facebook ad or contact form).</p>
        <table style="width:100%;border-collapse:collapse">${body}</table>
        ${whatsAppBlock}
        <p style="margin-top:20px;font-size:13px;color:#6b7280">
          <a href="${dashboardUrl}" style="color:#0284c7;font-weight:600">Open in admin dashboard →</a>
        </p>
      </div>
    </div>
  `;

  return { subject, html };
}
