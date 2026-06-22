import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = getPublicClient();
  if (!supabase) {
    return NextResponse.json({ post: null });
  }

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  return NextResponse.json({ post: data });
}
