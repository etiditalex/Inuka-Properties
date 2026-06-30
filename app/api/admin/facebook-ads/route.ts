import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID } from "@/lib/facebook/pixel";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  event_name: string;
  property_id: number | null;
  property_name: string | null;
  page_path: string | null;
  event_data: Record<string, unknown>;
  created_at: string;
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({
      propertyId: FACEBOOK_CAMPAIGN_PROPERTY_ID,
      stats: {},
      recentEvents: [],
      recentLeads: [],
    });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = Number(searchParams.get("property_id") || FACEBOOK_CAMPAIGN_PROPERTY_ID);
  const days = Number(searchParams.get("days") || 30);
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const [{ data: events }, { data: leads }, { data: property }] = await Promise.all([
    service
      .from("facebook_pixel_events")
      .select("*")
      .eq("property_id", propertyId)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(200),
    service
      .from("property_leads")
      .select("id, name, email, phone, property_name, source, status, created_at")
      .eq("property_id", propertyId)
      .eq("source", "facebook_ad")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(20),
    service.from("properties").select("id, title, location, price").eq("id", propertyId).single(),
  ]);

  const rows = (events as EventRow[]) || [];
  const stats: Record<string, number> = {
    PageView: 0,
    ViewContent: 0,
    Contact: 0,
    Lead: 0,
    Schedule: 0,
  };

  for (const row of rows) {
    if (row.event_name in stats) {
      stats[row.event_name] += 1;
    }
  }

  return NextResponse.json({
    propertyId,
    property: property || null,
    days,
    stats,
    totalEvents: rows.length,
    recentEvents: rows.slice(0, 50),
    recentLeads: leads || [],
  });
}
