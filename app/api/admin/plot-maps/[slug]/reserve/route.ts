import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/maps/adminAuth";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = (await request.json()) as { plotNumber?: string };
  const plotNumber = body.plotNumber?.trim();
  if (!plotNumber) return NextResponse.json({ error: "Choose a plot." }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured on this server." }, { status: 503 });
  }
  const map = await supabase.from("plot_maps").select("id").eq("slug", params.slug).maybeSingle();
  if (map.error) {
    return NextResponse.json(
      { error: "Run supabase/migrations/plot_maps.sql in the Supabase SQL editor, then try again." },
      { status: 503 }
    );
  }
  if (!map.data) return NextResponse.json({ error: "Save the map before reserving a plot." }, { status: 404 });

  const reserved = await supabase.rpc("reserve_plot_parcel", {
    p_map: map.data.id,
    p_number: plotNumber,
    p_actor: auth.user.id,
  });
  if (reserved.error) {
    const taken = /already/i.test(reserved.error.message);
    return NextResponse.json({ error: reserved.error.message }, { status: taken ? 409 : 500 });
  }
  return NextResponse.json(reserved.data);
}
