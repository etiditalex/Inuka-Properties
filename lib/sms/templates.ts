import type { Property } from "@/lib/supabase/types";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://www.inukaproperties.co.ke";

export function renderSmsTemplate(
  template: string,
  variables: Record<string, string | null | undefined>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const token = key.startsWith("{{") ? key : `{{${key}}}`;
    result = result.split(token).join(value ?? "");
  }
  return result.replace(/\s+/g, " ").trim();
}

export function smsStats(message: string): {
  chars: number;
  segments: number;
  encoding: "GSM" | "Unicode";
} {
  const isUnicode = /[^\x00-\x7F]/.test(message);
  const singleLimit = isUnicode ? 70 : 160;
  const multiLimit = isUnicode ? 67 : 153;
  const chars = message.length;
  const segments = chars <= singleLimit ? 1 : Math.ceil(chars / multiLimit);
  return { chars, segments, encoding: isUnicode ? "Unicode" : "GSM" };
}

export function buildPropertyDetailsSms(params: {
  template: string;
  leadName: string;
  property: Pick<Property, "id" | "title" | "location" | "price">;
}): string {
  const { template, leadName, property } = params;
  const link = `${siteUrl().replace(/^https?:\/\//, "")}/for-sale/${property.id}`;
  return renderSmsTemplate(template, {
    name: leadName,
    property: property.title,
    price: property.price,
    location: property.location,
    link,
    whatsapp: "0711 082 084",
  });
}

export function buildAdminAlertSms(params: {
  template: string;
  type: "lead" | "inquiry";
  name: string;
  phone?: string | null;
  propertyTitle?: string | null;
}): string {
  return renderSmsTemplate(params.template, {
    type: params.type,
    name: params.name,
    phone: params.phone ?? "N/A",
    property: params.propertyTitle ?? "General",
  });
}
