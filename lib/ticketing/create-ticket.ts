import type { SupabaseClient } from "@supabase/supabase-js";
import type { TicketPriority, TicketRow, TicketSource } from "@/lib/supabase/types";

export type CreateTicketInput = {
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string | null;
  requestType: string;
  requestCategory: string;
  subject: string;
  description: string;
  priority?: TicketPriority;
  department?: string | null;
  source?: TicketSource;
  sourceReference?: string | null;
  inboundEmailId?: string | null;
  initialNote?: string | null;
  authorId?: string | null;
  authorName?: string | null;
};

function parseNameFromEmail(from: string): { name: string; email: string } {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].replace(/"/g, "").trim(), email: match[2].trim() };
  return { name: from.split("@")[0], email: from.trim() };
}

export function guessCategoryFromSubject(subject: string): { requestType: string; requestCategory: string } {
  const lower = subject.toLowerCase();
  if (lower.includes("legal") || lower.includes("title") || lower.includes("deed")) {
    return { requestType: "Legal Dept Request", requestCategory: "General Inquiry" };
  }
  if (lower.includes("payment") || lower.includes("refund") || lower.includes("deposit")) {
    return { requestType: "Finance Request", requestCategory: "Payment Confirmation" };
  }
  if (lower.includes("visit") || lower.includes("plot") || lower.includes("property")) {
    return { requestType: "Property Inquiry", requestCategory: "General Inquiry" };
  }
  return { requestType: "Property Inquiry", requestCategory: "General Inquiry" };
}

export async function createTicket(
  supabase: SupabaseClient,
  input: CreateTicketInput
): Promise<{ ticket: TicketRow | null; error: string | null }> {
  const { data: ticket, error } = await supabase
    .from("tickets")
    .insert({
      requester_name: input.requesterName,
      requester_email: input.requesterEmail,
      requester_phone: input.requesterPhone || null,
      request_type: input.requestType,
      request_category: input.requestCategory,
      subject: input.subject,
      description: input.description,
      priority: input.priority || "medium",
      department: input.department || null,
      source: input.source || "manual",
      source_reference: input.sourceReference || null,
      inbound_email_id: input.inboundEmailId || null,
      alert_level: "not_completed",
      is_unread: true,
    })
    .select("*, assignee:profiles!assignee_id(full_name)")
    .single();

  if (error || !ticket) {
    return { ticket: null, error: error?.message || "Failed to create ticket" };
  }

  if (input.initialNote) {
    await supabase.from("ticket_notes").insert({
      ticket_id: ticket.id,
      author_id: input.authorId || null,
      author_name: input.authorName || "System",
      body: input.initialNote,
      is_internal: true,
      source: input.source === "email" ? "email" : "system",
    });
  }

  const { data: refreshed } = await supabase
    .from("tickets")
    .select("*, assignee:profiles!assignee_id(full_name)")
    .eq("id", ticket.id)
    .single();

  return { ticket: (refreshed || ticket) as TicketRow, error: null };
}

export type InboundEmailPayload = {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  text?: string | null;
  html?: string | null;
};

export async function createTicketFromInboundEmail(
  supabase: SupabaseClient,
  payload: InboundEmailPayload
): Promise<{ ticket: TicketRow | null; duplicate: boolean; error: string | null }> {
  const { data: existing } = await supabase
    .from("ticket_inbound_emails")
    .select("id, ticket_id")
    .eq("provider_message_id", payload.messageId)
    .maybeSingle();

  if (existing) {
    return { ticket: null, duplicate: true, error: null };
  }

  const { name, email } = parseNameFromEmail(payload.from);
  const { requestType, requestCategory } = guessCategoryFromSubject(payload.subject || "");
  const description = (payload.text || stripHtml(payload.html || "") || payload.subject || "No content").trim();

  const { data: inboundLog, error: logError } = await supabase
    .from("ticket_inbound_emails")
    .insert({
      provider: "resend",
      provider_message_id: payload.messageId,
      from_email: email,
      to_email: payload.to,
      subject: payload.subject,
      body_text: payload.text || null,
      body_html: payload.html || null,
      status: "processed",
    })
    .select("id")
    .single();

  if (logError) {
    return { ticket: null, duplicate: false, error: logError.message };
  }

  const { ticket, error } = await createTicket(supabase, {
    requesterName: name,
    requesterEmail: email,
    requestType,
    requestCategory,
    subject: payload.subject || "Email inquiry",
    description: description.slice(0, 8000),
    source: "email",
    sourceReference: payload.messageId,
    inboundEmailId: inboundLog?.id || null,
    initialNote: `Ticket created from inbound email to ${payload.to}`,
    authorName: "Email System",
  });

  if (ticket && inboundLog) {
    await supabase
      .from("ticket_inbound_emails")
      .update({ ticket_id: ticket.id })
      .eq("id", inboundLog.id);
  }

  return { ticket, duplicate: false, error };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
