import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60 * 1000;
const RECIPIENT_LIMIT = 2;
const RECIPIENT_WINDOW_MS = 60 * 60 * 1000;
const SITE_LIMIT = 60;
const SITE_WINDOW_MS = 10 * 60 * 1000;

function prune(now: number) {
  if (buckets.size < 2000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();
  return ip || "unknown";
}

export function consumeLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { ok: true };
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many requests. Please wait and try again." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}

async function countRecent(
  supabase: SupabaseClient,
  table: string,
  windowMs: number,
  column?: string,
  value?: string
): Promise<number | null> {
  const since = new Date(Date.now() - windowMs).toISOString();
  let query = supabase.from(table).select("id", { count: "exact", head: true }).gte("created_at", since);
  if (column && value) query = query.eq(column, value);
  const { count, error } = await query;
  if (error) return null;
  return count ?? 0;
}

/** Per-IP cap. Holds for this server process; the database caps below cover other instances. */
export function limitIp(request: Request, scope: string, limit = IP_LIMIT, windowMs = IP_WINDOW_MS) {
  const result = consumeLimit(`${scope}:ip:${clientIp(request)}`, limit, windowMs);
  if (!result.ok) return tooManyRequests(result.retryAfterSec);
  return null;
}

/**
 * Per-recipient cap, plus a site-wide cap on the same table.
 * Stops one number (or a burst of new numbers) from spending SMS credit.
 */
export async function limitRecipient(
  scope: string,
  recipient: string | null | undefined,
  options?: {
    supabase?: SupabaseClient | null;
    table?: string;
    column?: string;
    limit?: number;
    windowMs?: number;
    siteLimit?: number;
    siteWindowMs?: number;
  }
) {
  const value = recipient?.trim();
  const limit = options?.limit ?? RECIPIENT_LIMIT;
  const windowMs = options?.windowMs ?? RECIPIENT_WINDOW_MS;

  if (value) {
    const result = consumeLimit(`${scope}:recipient:${value.toLowerCase()}`, limit, windowMs);
    if (!result.ok) return tooManyRequests(result.retryAfterSec);

    if (options?.supabase && options.table && options.column) {
      const recent = await countRecent(options.supabase, options.table, windowMs, options.column, value);
      if (recent !== null && recent >= limit) {
        return tooManyRequests(Math.ceil(windowMs / 1000));
      }
    }
  }

  if (options?.supabase && options.table) {
    const siteWindow = options.siteWindowMs ?? SITE_WINDOW_MS;
    const siteLimit = options.siteLimit ?? SITE_LIMIT;
    const recent = await countRecent(options.supabase, options.table, siteWindow);
    if (recent !== null && recent >= siteLimit) {
      return tooManyRequests(Math.ceil(siteWindow / 1000));
    }
  }

  return null;
}
