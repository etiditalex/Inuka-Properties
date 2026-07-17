export const WHATSAPP_NUMBER = "254711082084";

export function whatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled message when booking a visit for a specific property. */
export function propertySiteVisitWhatsAppUrl(propertyTitle: string): string {
  return whatsAppUrl(
    `Hi, I am interested in ${propertyTitle}. How do I book a site visit?`
  );
}

/** Pre-filled message when no specific property is selected. */
export function generalSiteVisitWhatsAppUrl(): string {
  return whatsAppUrl(
    "Hi, I am interested in a property. How do I book a site visit?"
  );
}

/** In-site booking form URL — captures the lead before WhatsApp. */
export function bookSiteVisitHref(options?: {
  propertyId?: number | null;
  source?: string;
}): string {
  const params = new URLSearchParams();
  if (options?.propertyId) params.set("property_id", String(options.propertyId));
  if (options?.source) params.set("source", options.source);
  const query = params.toString();
  return query ? `/book-site-visit?${query}` : "/book-site-visit";
}

export function siteVisitWhatsAppMessage(details: {
  name: string;
  email: string;
  phone: string;
  property: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}): string {
  const lines = [
    "Hello! I would like to book a site visit:",
    "",
    `*Name:* ${details.name}`,
    `*Phone:* ${details.phone}`,
    `*Email:* ${details.email}`,
    `*Property of Interest:* ${details.property}`,
  ];
  if (details.preferredDate) lines.push(`*Preferred Date:* ${details.preferredDate}`);
  if (details.preferredTime) lines.push(`*Preferred Time:* ${details.preferredTime}`);
  if (details.message) lines.push(`*Additional Notes:* ${details.message}`);
  lines.push("", "Thank you!");
  return lines.join("\n");
}
