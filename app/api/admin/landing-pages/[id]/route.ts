import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteLandingPage, getLandingPageById, saveLandingPage } from "@/lib/landing-pages/store";
import { asStringList } from "@/lib/landing-pages/defaults";
import type { LandingPageChannel, LandingPageTemplate } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function payloadFromBody(body: Record<string, unknown>) {
  return {
    name: String(body.name || "").trim(),
    slug: String(body.slug || "").trim(),
    property_id: body.property_id ? Number(body.property_id) : null,
    campaign_name: body.campaign_name ? String(body.campaign_name) : null,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign) : null,
    channel: (body.channel || "facebook") as LandingPageChannel,
    template: (body.template || "offer") as LandingPageTemplate,
    headline: String(body.headline || "").trim(),
    subheadline: body.subheadline ? String(body.subheadline) : null,
    badge_text: body.badge_text ? String(body.badge_text) : null,
    cta_text: String(body.cta_text || "Get Full Details Now"),
    form_heading: body.form_heading ? String(body.form_heading) : null,
    form_subheading: body.form_subheading ? String(body.form_subheading) : null,
    thank_you_message: body.thank_you_message ? String(body.thank_you_message) : null,
    hero_image: body.hero_image ? String(body.hero_image) : null,
    highlights: asStringList(body.highlights),
    body_html: body.body_html ? String(body.body_html) : null,
    offer_price: body.offer_price ? String(body.offer_price) : null,
    offer_size: body.offer_size ? String(body.offer_size) : null,
    payment_plan_note: body.payment_plan_note ? String(body.payment_plan_note) : null,
    show_price: body.show_price !== false,
    show_plots_remaining: body.show_plots_remaining !== false,
    show_whatsapp: body.show_whatsapp !== false,
    show_call: body.show_call !== false,
    show_testimonials: Boolean(body.show_testimonials),
    pixel_enabled: body.pixel_enabled !== false,
    published: Boolean(body.published),
  };
}

async function adminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, user } = await adminClient();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const page = await getLandingPageById(id, supabase);
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load landing page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, user } = await adminClient();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = payloadFromBody(body);
    if (!payload.name || !payload.slug || !payload.headline) {
      return NextResponse.json({ error: "Name, URL slug, and headline are required." }, { status: 400 });
    }
    const page = await saveLandingPage(payload, id, supabase);
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save landing page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { supabase, user } = await adminClient();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await deleteLandingPage(id, supabase);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete landing page" },
      { status: 500 }
    );
  }
}
