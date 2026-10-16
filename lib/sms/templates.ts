import type { Property } from "@/lib/supabase/types";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://www.inukaproperties.co.ke";

/** Remove template braces so a recipient sees "Alex Etidit", not "{{Alex Etidit}}". */
export function deliverableSmsText(message: string): string {
  return message
    .replace(/\{\{+\s*([^{}]+?)\s*\}+\}/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderSmsTemplate(
  template: string,
  variables: Record<string, string | null | undefined>
): string {
  let result = template.replace(/\{+\s*([a-zA-Z0-9_]+)\s*\}+/g, "{{$1}}");
  for (const [key, value] of Object.entries(variables)) {
    const token = key.startsWith("{{") ? key : `{{${key}}}`;
    const clean = deliverableSmsText(value ?? "");
    result = result.split(token).join(clean);
  }
  return deliverableSmsText(result);
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
