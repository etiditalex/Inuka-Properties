import type { TicketPriority } from "@/lib/supabase/types";

export const SUPPORT_FORM_PATH = "/support";

export function getPublicSupportUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.inukaproperties.co.ke";
  return `${base.replace(/\/$/, "")}${SUPPORT_FORM_PATH}`;
}

export const DEPARTMENTS = [
  { value: "support", label: "Support", requestType: "Property Inquiry", requestCategory: "General Inquiry" },
  { value: "sales", label: "Sales", requestType: "Property Inquiry", requestCategory: "Site Visit Request" },
  { value: "legal", label: "Legal", requestType: "Legal Dept Request", requestCategory: "General Inquiry" },
  { value: "finance", label: "Finance", requestType: "Finance Request", requestCategory: "Payment Confirmation" },
  { value: "it", label: "Technical", requestType: "IT Request", requestCategory: "Software Support" },
] as const;

export const PRIORITIES: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const RELATED_SERVICES = [
  { value: "wifi_issue", label: "Wifi Issue" },
  { value: "laptop_computer_failure", label: "Laptop/Computer Failure" },
  { value: "emails", label: "Emails" },
  { value: "system_issue", label: "System Issue" },
  { value: "crm_app", label: "CRM App" },
  { value: "others", label: "Others" },
] as const;

export function resolveRelatedServiceLabel(value: string, otherText?: string): string | null {
  if (!value || value === "none") return null;
  if (value === "others") {
    const detail = otherText?.trim();
    return detail ? `Others: ${detail}` : "Others";
  }
  return RELATED_SERVICES.find((s) => s.value === value)?.label || value;
}

export function resolveDepartment(value: string) {
  return DEPARTMENTS.find((d) => d.value === value) || DEPARTMENTS[0];
}
