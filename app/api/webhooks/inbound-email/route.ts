import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createTicketFromInboundEmail } from "@/lib/ticketing/create-ticket";
import { sendAdminNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Inbound email webhook (Resend Inbound).
 *
 * Configure in Resend Dashboard → Domains → Inbound (weugei.resend.app):
 *   Clients can email anything@weugei.resend.app — all addresses route to your webhook.
 *   Webhook URL: https://your-site.com/api/webhooks/inbound-email
 *   Header: Authorization: Bearer YOUR_WEBHOOK_SECRET
 *
 * Set env vars:
 *   RESEND_WEBHOOK_SECRET — verify Resend webhook signature (optional but recommended)
 *   WEBHOOK_SECRET / SUPHOOK_SECRET — Bearer token for Authorization header
 *   TICKETS_INBOUND_EMAIL — e.g. tickets@weugei.resend.app (Resend inbound domain)
 */
export async function POST(request: Request) {
  const secret = process.env.WEBHOOK_SECRET || process.env.SUPHOOK_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const raw = await request.json();
    const payload = parseResendInbound(raw);

    if (!payload.messageId || !payload.from || !payload.to) {
      return NextResponse.json({ error: "Invalid inbound email payload" }, { status: 400 });
    }

    const { ticket, duplicate, error } = await createTicketFromInboundEmail(supabase, payload);

    if (duplicate) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    if (error || !ticket) {
      await supabase.from("ticket_inbound_emails").insert({
        provider: "resend",
        provider_message_id: payload.messageId,
        from_email: payload.from,
        to_email: payload.to,
        subject: payload.subject,
        status: "failed",
        error_message: error || "Unknown error",
        raw_payload: raw,
      });
      return NextResponse.json({ error: error || "Failed to create ticket" }, { status: 500 });
    }

    await sendAdminNotification({
      type: "ticket",
      name: ticket.requester_name,
      email: ticket.requester_email,
      subject: ticket.subject,
      message: ticket.description,
      ticketNumber: ticket.number,
    });

    return NextResponse.json({ success: true, ticket_id: ticket.id, ticket_number: ticket.number });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

type ParsedInbound = {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  text?: string | null;
  html?: string | null;
};

function parseResendInbound(body: Record<string, unknown>): ParsedInbound {
  // Resend email.received webhook shape
  const data = (body.data as Record<string, unknown>) || body;
  const email = (data.email as Record<string, unknown>) || data;

  return {
    messageId: String(email.message_id || email.id || data.id || `resend-${Date.now()}`),
    from: String(email.from || data.from || ""),
    to: extractToAddress(email.to || data.to),
    subject: String(email.subject || data.subject || "No subject"),
    text: (email.text as string) || (data.text as string) || null,
    html: (email.html as string) || (data.html as string) || null,
  };
}

function extractToAddress(to: unknown): string {
  if (typeof to === "string") return to;
  if (Array.isArray(to) && to.length > 0) {
    const first = to[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "email" in first) {
      return String((first as { email: string }).email);
    }
  }
  return process.env.TICKETS_INBOUND_EMAIL || "tickets@weugei.resend.app";
}
