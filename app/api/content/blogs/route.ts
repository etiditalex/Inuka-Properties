import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getPublicClient();
  if (!supabase) return NextResponse.json({ posts: [] });

  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, author, published_at, image, category, slug")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return NextResponse.json({ posts: data || [] });
}
