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
