import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("ticket_notes")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notes: data || [] });
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { body: noteBody, is_internal = true } = body;

  if (!noteBody?.trim()) {
    return NextResponse.json({ error: "Note body is required" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data, error } = await supabase
    .from("ticket_notes")
    .insert({
      ticket_id: id,
      author_id: user.id,
      author_name: profile?.full_name || "Admin",
      body: noteBody.trim(),
      is_internal,
      source: "admin",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("tickets").update({ is_unread: false }).eq("id", id);

  return NextResponse.json({ note: data });
}
