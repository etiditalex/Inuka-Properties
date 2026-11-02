import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createTicket } from "@/lib/ticketing/create-ticket";
import type { TicketRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const TICKET_SELECT = "*, assignee:profiles!assignee_id(full_name)";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "group_tickets";
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const query = searchParams.get("q");

  let dbQuery = supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .order("updated_at", { ascending: false });

  if (view === "my_tickets") {
    dbQuery = dbQuery.eq("assignee_id", user.id);
  } else if (view === "flagged") {
    dbQuery = dbQuery.eq("is_flagged", true);
  } else if (view === "spam") {
    dbQuery = dbQuery.eq("is_spam", true);
  } else if (view === "approvals") {
    dbQuery = dbQuery.in("status", ["pending", "approved"]);
  }

  if (view !== "spam") {
    dbQuery = dbQuery.eq("is_spam", false);
  }

  if (status && status !== "all") {
    dbQuery = dbQuery.eq("status", status);
  }
  if (priority && priority !== "all") {
    dbQuery = dbQuery.eq("priority", priority);
  }
  if (query) {
    dbQuery = dbQuery.or(
      `subject.ilike.%${query}%,description.ilike.%${query}%,requester_name.ilike.%${query}%,request_type.ilike.%${query}%`
    );
  }

  let { data, error } = await dbQuery;
  if (error && view !== "spam" && /is_spam/.test(error.message)) {
    let fallback = supabase.from("tickets").select(TICKET_SELECT).order("updated_at", { ascending: false });
    if (view === "my_tickets") fallback = fallback.eq("assignee_id", user.id);
    else if (view === "flagged") fallback = fallback.eq("is_flagged", true);
    else if (view === "approvals") fallback = fallback.in("status", ["pending", "approved"]);
    if (status && status !== "all") fallback = fallback.eq("status", status);
    if (priority && priority !== "all") fallback = fallback.eq("priority", priority);
    if (query) {
      fallback = fallback.or(
        `subject.ilike.%${query}%,description.ilike.%${query}%,requester_name.ilike.%${query}%,request_type.ilike.%${query}%`
      );
    }
    const retry = await fallback;
    data = retry.data;
    error = retry.error;
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const service = createServiceClient();
  const counts = await getCounts(service || supabase, user.id);

  return NextResponse.json({ tickets: (data as TicketRow[]) || [], counts });
}

async function getCounts(supabase: SupabaseClient, userId: string) {
  const spamCounts = await Promise.all([
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("is_spam", false),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("assignee_id", userId).eq("is_spam", false),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("is_flagged", true).eq("is_spam", false),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("is_unread", true).eq("is_spam", false),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("is_spam", true),
  ]);

  if (!spamCounts.some((result) => result.error && /is_spam/.test(result.error.message))) {
    const [groupTickets, myTickets, flagged, unread, spam] = spamCounts;
    return {
      groupTickets: groupTickets.count || 0,
      myTickets: myTickets.count || 0,
      flagged: flagged.count || 0,
      messages: unread.count || 0,
      spam: spam.count || 0,
    };
  }

  const [groupTickets, myTickets, flagged, unread] = await Promise.all([
    supabase.from("tickets").select("*", { count: "exact", head: true }),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("assignee_id", userId),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("is_flagged", true),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("is_unread", true),
  ]);

  return {
    groupTickets: groupTickets.count || 0,
    myTickets: myTickets.count || 0,
    flagged: flagged.count || 0,
    messages: unread.count || 0,
    spam: 0,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  const db = service || supabase;

  const body = await request.json();
  const {
    requester_name,
    requester_email,
    requester_phone,
    request_type,
    request_category,
    subject,
    description,
    priority,
    department,
  } = body;

  if (!requester_name || !requester_email || !request_type || !request_category || !subject || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { ticket, error } = await createTicket(db, {
    requesterName: requester_name,
    requesterEmail: requester_email,
    requesterPhone: requester_phone,
    requestType: request_type,
    requestCategory: request_category,
    subject,
    description,
    priority,
    department,
    source: "manual",
    authorId: user.id,
    authorName: profile?.full_name || "Admin",
    initialNote: "Ticket created manually",
  });

  if (error || !ticket) {
    return NextResponse.json({ error: error || "Failed to create ticket" }, { status: 500 });
  }

  return NextResponse.json({ ticket });
}
