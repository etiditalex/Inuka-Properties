import type { SupabaseClient } from "@supabase/supabase-js";
import { adminPath } from "@/lib/admin/path";

type NotificationPayload = {
  type: "inquiry" | "lead" | "ticket";
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  propertyName?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  ticketNumber?: number;
};

type EmailConfig = {
  resendApiKey?: string;
  notifyEmail?: string;
  fromEmail?: string;
};

function getEmailConfig(): EmailConfig {
  return {
    resendApiKey: process.env.RESEND_API_KEY,
    notifyEmail: process.env.NOTIFY_EMAIL || process.env.ADMIN_NOTIFY_EMAIL,
    fromEmail: process.env.EMAIL_FROM || "IAPL Admin <notifications@inukaproperties.co.ke>",
  };
}

export async function shouldNotify(
  supabase: SupabaseClient,
  key: "notify_new_inquiries" | "notify_new_leads"
): Promise<boolean> {
  const { data } = await supabase.from("site_settings").select("value").eq("key", "general").single();
  const settings = data?.value as Record<string, boolean> | undefined;
  if (!settings) return true;
  return settings[key] !== false;
}

export async function sendAdminNotification(payload: NotificationPayload): Promise<boolean> {
  const { resendApiKey, notifyEmail, fromEmail } = getEmailConfig();
  if (!notifyEmail) return false;

  const subject =
    payload.type === "inquiry"
      ? `New Inquiry from ${payload.name}`
      : payload.type === "ticket"
        ? `New Ticket #${payload.ticketNumber || ""} from ${payload.name}`
        : `New Lead: ${payload.propertyName || payload.name}`;

  const html = buildHtml(payload);

  if (resendApiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        subject,
        html,
      }),
    });
    return res.ok;
  }

  // Fallback: log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[notification]", subject, payload);
  }
  return false;
}

function buildHtml(payload: NotificationPayload): string {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    payload.phone ? ["Phone", payload.phone] : null,
    payload.subject ? ["Subject", payload.subject] : null,
    payload.propertyName ? ["Property", payload.propertyName] : null,
    payload.preferredDate ? ["Preferred Date", payload.preferredDate] : null,
    payload.preferredTime ? ["Preferred Time", payload.preferredTime] : null,
    payload.message ? ["Message", payload.message] : null,
  ].filter(Boolean) as [string, string][];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#0369a1;border-bottom:1px solid #e5e7eb">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#0284c7,#075985);padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">IAPL Admin — ${
          payload.type === "inquiry"
            ? "New Inquiry"
            : payload.type === "ticket"
              ? `New Ticket #${payload.ticketNumber || ""}`
              : "New Lead"
        }</h1>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse">${body}</table>
        <p style="margin-top:20px;font-size:13px;color:#6b7280">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://www.inukaproperties.co.ke"}${adminPath(
            payload.type === "inquiry"
              ? "inquiries"
              : payload.type === "ticket"
                ? "ticketing"
                : "leads"
          )}" style="color:#0284c7">View in dashboard →</a>
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
