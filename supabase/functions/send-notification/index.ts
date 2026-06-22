// Supabase Edge Function — deploy with: supabase functions deploy send-notification
// Trigger via Database Webhook on inquiries / property_leads INSERT

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL");
const FROM_EMAIL = Deno.env.get("EMAIL_FROM") ?? "IAPL Admin <notifications@inukaproperties.co.ke>";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://www.inukaproperties.co.ke";

serve(async (req) => {
  try {
    const body = await req.json();
    const record = body.record;
    const table = body.table;

    if (!record || !NOTIFY_EMAIL) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const isInquiry = table === "inquiries";
    const subject = isInquiry
      ? `New Inquiry from ${record.name}`
      : `New Lead: ${record.property_name || record.name}`;

    const html = `
      <h2>${subject}</h2>
      <p><strong>Name:</strong> ${record.name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      ${record.phone ? `<p><strong>Phone:</strong> ${record.phone}</p>` : ""}
      ${record.subject ? `<p><strong>Subject:</strong> ${record.subject}</p>` : ""}
      ${record.property_name ? `<p><strong>Property:</strong> ${record.property_name}</p>` : ""}
      ${record.message ? `<p><strong>Message:</strong> ${record.message}</p>` : ""}
      <p><a href="${SITE_URL}/admin/${isInquiry ? "inquiries" : "leads"}">View in dashboard</a></p>
    `;

    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [NOTIFY_EMAIL],
          subject,
          html,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
