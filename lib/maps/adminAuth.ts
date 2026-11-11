import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { isAdminEmailAllowed } from "@/lib/admin/allowlist";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<{ user: User } | { response: NextResponse }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!isAdminEmailAllowed(user.email)) {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user };
}
