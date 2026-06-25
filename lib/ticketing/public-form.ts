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

export function generateSupportReference(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${date}-${rand}`;
}

export function resolveDepartment(value: string) {
  return DEPARTMENTS.find((d) => d.value === value) || DEPARTMENTS[0];
}
