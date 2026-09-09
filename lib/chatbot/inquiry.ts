import { saveContact } from "@/lib/leads/contactAutofill";
import type { ChatbotInquiryDraft } from "./types";

const FALLBACK_EMAIL = "chatbot@inukaproperties.co.ke";

export async function submitChatbotInquiry(input: {
  draft: ChatbotInquiryDraft;
  name: string;
  email?: string;
  phone?: string;
}): Promise<boolean> {
  const name = input.name.trim();
  const email = input.email?.trim() || "";
  const phone = input.phone?.trim() || "";
  if (!name || (!email && !phone)) return false;

  const kind = input.draft.kind || "question";
  const propertyLabel = input.draft.propertyTitle || null;
  const subject =
    input.draft.subject ||
    (kind === "price"
      ? `Price inquiry — ${propertyLabel || "unpublished project"}`
      : `Chatbot question — ${input.draft.question.slice(0, 80)}`);

  const message = [
    kind === "price"
      ? "Chatbot price request — no published figure was available."
      : "Chatbot could not fully answer this visitor question from website data.",
    propertyLabel ? `Property: ${propertyLabel}` : null,
    input.draft.propertyId && input.draft.propertyId < 1000 ? `Property ID: ${input.draft.propertyId}` : null,
    `Visitor question: ${input.draft.question}`,
    "Please follow up with the client from the admin inquiries dashboard.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email: email || FALLBACK_EMAIL,
      phone: phone || null,
      subject,
      message,
      source: "chatbot",
      property_id: input.draft.propertyId && input.draft.propertyId < 1000 ? input.draft.propertyId : null,
      property_name: propertyLabel,
    }),
  });

  if (!response.ok) return false;

  saveContact({
    name,
    email: email || FALLBACK_EMAIL,
    phone,
  });
  return true;
}

/** @deprecated Use submitChatbotInquiry */
export const submitChatbotPriceInquiry = submitChatbotInquiry;
