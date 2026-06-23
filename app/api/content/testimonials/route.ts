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
  if (!supabase) return NextResponse.json({ items: [] });

  const { data } = await supabase
    .from("client_testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return NextResponse.json({ items: data || [] });
}
