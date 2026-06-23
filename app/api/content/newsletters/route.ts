import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getPublicClient();
  if (!supabase) return NextResponse.json({ issues: [] });

  const { data } = await supabase
    .from("newsletter_issues")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return NextResponse.json({ issues: data || [] });
}

export async function POST(request: Request) {
  const supabase = getPublicClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, status: "active" }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
