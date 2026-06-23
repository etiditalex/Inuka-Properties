import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  DEFAULT_EMAIL_AUTOMATION,
  type EmailAutomationSettings,
} from "@/lib/email/automation";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  if (!service) return NextResponse.json({ settings: DEFAULT_EMAIL_AUTOMATION, logs: [] });

  const [{ data: settingsRow }, { data: logs }, { data: properties }] = await Promise.all([
    service.from("site_settings").select("value").eq("key", "email_automation").single(),
    service
      .from("email_automation_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    service
      .from("properties")
      .select("id, title, location, price, status, published")
      .eq("published", true)
      .order("created_at", { ascending: false }),
  ]);

  const settings: EmailAutomationSettings = settingsRow?.value
    ? { ...DEFAULT_EMAIL_AUTOMATION, ...(settingsRow.value as EmailAutomationSettings) }
    : DEFAULT_EMAIL_AUTOMATION;

  return NextResponse.json({ settings, logs: logs || [], properties: properties || [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  if (!service) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const body = await request.json();
  const settings: EmailAutomationSettings = {
    ...DEFAULT_EMAIL_AUTOMATION,
    ...body,
    default_property_id: body.default_property_id ? Number(body.default_property_id) : null,
    facebook_landing_property_id: body.facebook_landing_property_id
      ? Number(body.facebook_landing_property_id)
      : null,
  };

  const { error } = await service.from("site_settings").upsert({
    key: "email_automation",
    value: settings,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, settings });
}
