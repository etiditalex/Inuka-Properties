import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getPublicClient();
  if (!supabase) return NextResponse.json({ items: [] });

  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[content/news]", error.message);
    return NextResponse.json({ items: [] }, { status: 500 });
  }

  return NextResponse.json(
    { items: data || [] },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
