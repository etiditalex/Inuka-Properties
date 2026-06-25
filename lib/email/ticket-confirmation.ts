import { buildEmailLetterheadHtml } from "@/lib/email/letterhead";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildTicketReceivedEmail(params: {
  name: string;
  ticketNumber: number;
  subject: string;
  department: string;
  priority: string;
}): { subject: string; html: string } {
  const subject = `We received your request — Ticket #${params.ticketNumber}`;
  const letterhead = buildEmailLetterheadHtml();

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827;background:#f3f4f6;padding:16px 0">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:4px;overflow:hidden">
        ${letterhead}
        <div style="padding:28px 24px 32px">
          <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a">Your ticket has been received</h1>
          <p style="margin:0 0 20px;font-size:13px;color:#64748b">Support request confirmation</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Dear ${escapeHtml(params.name)},</p>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 20px">
            Thank you for contacting us. Your support request has been logged and our team will work on it shortly.
            You will receive updates by email as we progress.
          </p>
          <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <tr>
              <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;width:35%">Ticket number</td>
              <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#0369a1;border-bottom:1px solid #e2e8f0">#${params.ticketNumber}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0">Subject</td>
              <td style="padding:12px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0">${escapeHtml(params.subject)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0">Department</td>
              <td style="padding:12px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0">${escapeHtml(params.department)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#64748b">Priority</td>
              <td style="padding:12px 16px;font-size:14px;color:#1e293b;text-transform:capitalize">${escapeHtml(params.priority)}</td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#6b7280">
            Please keep this email for your records. If you need to add more information, reply to this message or contact us at
            <a href="mailto:info@inukaproperties.co.ke" style="color:#0284c7">info@inukaproperties.co.ke</a>.
          </p>
        </div>
      </div>
      <p style="text-align:center;font-size:11px;color:#9ca3af;padding:16px 8px 0">© Inuka Afrika Properties Limited</p>
    </div>
  `;

  return { subject, html };
}

export async function sendTicketConfirmationEmail(params: {
  to: string;
  name: string;
  ticketNumber: number;
  subject: string;
  department: string;
  priority: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Inuka Afrika Properties <info@inukaproperties.co.ke>";
  if (!apiKey) return false;

  const { subject, html } = buildTicketReceivedEmail({
    name: params.name,
    ticketNumber: params.ticketNumber,
    subject: params.subject,
    department: params.department,
    priority: params.priority,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject,
      html,
      reply_to: process.env.NOTIFY_EMAIL || process.env.ADMIN_NOTIFY_EMAIL || undefined,
    }),
  });

  return res.ok;
}
