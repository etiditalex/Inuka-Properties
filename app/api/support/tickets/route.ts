import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createTicket } from "@/lib/ticketing/create-ticket";
import { resolveDepartment } from "@/lib/ticketing/public-form";
import { sendTicketConfirmationEmail } from "@/lib/email/ticket-confirmation";
import { sendAdminNotification } from "@/lib/notifications";
import { getEmailAutomationSettings, sendAdminWhatsAppAlert } from "@/lib/email/automation";
import type { TicketPriority } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      subject,
      message,
      department = "support",
      priority = "medium",
      related_service,
    } = body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }

    const dept = resolveDepartment(department);
    const description = [
      message.trim(),
      related_service && related_service !== "none"
        ? `\n\nRelated service: ${related_service}`
        : "",
      phone ? `\n\nPhone: ${phone}` : "",
    ]
      .filter(Boolean)
      .join("");

    const { ticket, error } = await createTicket(supabase, {
      requesterName: name.trim(),
      requesterEmail: email.trim(),
      requesterPhone: phone?.trim() || null,
      requestType: dept.requestType,
      requestCategory: dept.requestCategory,
      subject: subject.trim(),
      description: description.slice(0, 8000),
      priority: (priority as TicketPriority) || "medium",
      department: dept.label,
      source: "contact_form",
      initialNote: "Submitted via public support form",
      authorName: "Public Form",
    });

    if (error || !ticket) {
      return NextResponse.json({ error: error || "Could not create ticket." }, { status: 500 });
    }

    const settings = await getEmailAutomationSettings(supabase);

    const [confirmationSent, , whatsAppAlertSent] = await Promise.all([
      sendTicketConfirmationEmail({
        to: email.trim(),
        name: name.trim(),
        ticketNumber: ticket.number,
        subject: subject.trim(),
        department: dept.label,
        priority: priority || "medium",
      }),
      sendAdminNotification({
        type: "ticket",
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        subject: subject.trim(),
        message: message.trim(),
        ticketNumber: ticket.number,
      }),
      sendAdminWhatsAppAlert(settings, {
        leadType: "inquiry",
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        message: message.trim(),
        subject: subject.trim(),
        ticketNumber: ticket.number,
      }),
    ]);

    return NextResponse.json({
      success: true,
      ticket_number: ticket.number,
      ticket_id: ticket.id,
      confirmation_email_sent: confirmationSent,
      whatsapp_alert_sent: whatsAppAlertSent,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
