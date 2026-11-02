import type { SupabaseClient } from "@supabase/supabase-js";

export function normalizeEmailAddress(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/<([^>]+)>/);
  return (match ? match[1] : trimmed).trim().toLowerCase();
}

export async function senderIsSpam(supabase: SupabaseClient, email: string) {
  const normalized = normalizeEmailAddress(email);
  if (!normalized.includes("@")) return false;
  const { data, error } = await supabase.from("spam_senders").select("email").eq("email", normalized).maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export async function rememberSpamSender(supabase: SupabaseClient, email: string) {
  const normalized = normalizeEmailAddress(email);
  if (!normalized.includes("@")) return "Enter a valid email address.";
  const { error } = await supabase.from("spam_senders").upsert({ email: normalized }, { onConflict: "email" });
  return error?.message || null;
}

export async function forgetSpamSender(supabase: SupabaseClient, email: string) {
  const normalized = normalizeEmailAddress(email);
  const { error } = await supabase.from("spam_senders").delete().eq("email", normalized);
  return error?.message || null;
}
