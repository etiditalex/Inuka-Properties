import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TicketStatus, TicketPriority, TicketAlertLevel } from "@/lib/supabase/types";
import { forgetSpamSender, normalizeEmailAddress, rememberSpamSender } from "@/lib/ticketing/spam";

export const dynamic = "force-dynamic";

const TICKET_SELECT = "*, assignee:profiles!assignee_id(full_name)";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ ticket: data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.status !== undefined) updates.status = body.status as TicketStatus;
  if (body.priority !== undefined) updates.priority = body.priority as TicketPriority;
  if (body.alert_level !== undefined) updates.alert_level = body.alert_level as TicketAlertLevel;
  if (body.is_flagged !== undefined) updates.is_flagged = Boolean(body.is_flagged);
  if (body.is_unread !== undefined) updates.is_unread = Boolean(body.is_unread);

  let spamEmail = "";
  if (body.is_spam !== undefined) {
    const { data: current, error: currentError } = await supabase
      .from("tickets")
      .select("requester_email")
      .eq("id", id)
      .maybeSingle();
    if (currentError) return NextResponse.json({ error: currentError.message }, { status: 500 });
    if (!current) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

    spamEmail = normalizeEmailAddress(String(current.requester_email || ""));
    const markSpam = Boolean(body.is_spam);
    const saved = markSpam ? await rememberSpamSender(supabase, spamEmail) : await forgetSpamSender(supabase, spamEmail);
    if (saved) return NextResponse.json({ error: saved }, { status: 500 });

    updates.is_spam = markSpam;
    updates.is_unread = false;
    if (markSpam) {
      updates.status = "closed";
      const { data: siblings } = await supabase.from("tickets").select("id, requester_email").neq("id", id).eq("is_spam", false);
      const related = (siblings || [])
        .filter((row) => normalizeEmailAddress(String(row.requester_email || "")) === spamEmail)
        .map((row) => row.id);
      if (related.length) {
        await supabase.from("tickets").update({ is_spam: true, status: "closed", is_unread: false }).in("id", related);
      }
    } else if (body.status === undefined) {
      updates.status = "new";
    }
  }
  if (body.assignee_id !== undefined) updates.assignee_id = body.assignee_id;
  if (body.department !== undefined) updates.department = body.department;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  if (body.status === "assigned" && updates.assignee_id === undefined) {
    updates.assignee_id = user.id;
  }

  const { data, error } = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", id)
    .select(TICKET_SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.is_spam === true && data) {
    await supabase.from("ticket_notes").insert({
      ticket_id: id,
      author_id: user.id,
      author_name: "Admin",
      body: `Marked ${spamEmail} as spam. Later email from this address is filed under Spam and does not alert the team.`,
      is_internal: true,
      source: "admin",
    });
  }

  return NextResponse.json({ ticket: data });
}
