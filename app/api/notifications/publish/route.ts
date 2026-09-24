import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publishContentSignal, type SignalKind } from "@/lib/notifications/signals";

export const dynamic = "force-dynamic";

const KINDS = new Set<SignalKind>(["blog", "market-research", "property"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const kind = body?.kind as SignalKind;
  const title = String(body?.title || "").trim();
  const summary = String(body?.summary || "").trim();
  const path = String(body?.path || "").trim();

  if (!KINDS.has(kind) || !title || !path.startsWith("/")) {
    return NextResponse.json({ error: "A published title and path are required" }, { status: 400 });
  }

  const result = await publishContentSignal({ kind, title, summary, path });
  return NextResponse.json(result);
}
