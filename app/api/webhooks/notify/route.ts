import { NextResponse } from "next/server";
import { sendAdminNotification } from "@/lib/notifications";

/**
 * Supabase Database Webhook endpoint.
 * Configure in Supabase Dashboard → Database → Webhooks:
 *   Table: inquiries | property_leads
 *   Events: INSERT
 *   URL: https://your-site.com/api/webhooks/notify
 *   HTTP Headers: Authorization: Bearer YOUR_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
  const secret = process.env.SUPHOOK_SECRET || process.env.WEBHOOK_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const record = body.record ?? body;
    const table = body.table ?? record?.table;

    if (table === "inquiries" || record?.message) {
      await sendAdminNotification({
        type: "inquiry",
        name: record.name,
        email: record.email,
        phone: record.phone,
        subject: record.subject,
        message: record.message,
      });
    } else if (table === "property_leads" || record?.property_name !== undefined) {
      await sendAdminNotification({
        type: "lead",
        name: record.name,
        email: record.email,
        phone: record.phone,
        propertyName: record.property_name,
        preferredDate: record.preferred_date,
        preferredTime: record.preferred_time,
        message: record.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
