import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export type SmsAutomationSettings = {
  auto_send_property_details_sms: boolean;
  notify_admin_sms: boolean;
  admin_sms_number: string;
  sender_id: string;
  property_template: string;
  admin_template: string;
  default_property_id: number | null;
  facebook_landing_property_id: number | null;
};

export const SMS_TEMPLATE_VARIABLES = [
  { key: "{{name}}", label: "Client name", sample: "John" },
  { key: "{{property}}", label: "Property title", sample: "Tulivu Haven" },
  { key: "{{price}}", label: "Price", sample: "KES 850,000" },
  { key: "{{location}}", label: "Location", sample: "Kikambala" },
  { key: "{{link}}", label: "Property link", sample: "inukaproperties.co.ke/for-sale/14" },
  { key: "{{whatsapp}}", label: "WhatsApp", sample: "0711 082 084" },
] as const;

export const DEFAULT_PROPERTY_SMS_TEMPLATE =
  "Hi {{name}}, thanks for your interest in {{property}} ({{price}}) at {{location}}. View details: {{link}}. Call/WhatsApp {{whatsapp}} - Inuka Afrika Properties";

export const DEFAULT_ADMIN_SMS_TEMPLATE =
  "New {{type}}: {{name}} | {{phone}} | Property: {{property}}. Check admin dashboard.";

export const DEFAULT_SMS_AUTOMATION: SmsAutomationSettings = {
  auto_send_property_details_sms: false,
  notify_admin_sms: false,
  admin_sms_number: WHATSAPP_NUMBER,
  sender_id: "INUKA",
  property_template: DEFAULT_PROPERTY_SMS_TEMPLATE,
  admin_template: DEFAULT_ADMIN_SMS_TEMPLATE,
  default_property_id: null,
  facebook_landing_property_id: null,
};
