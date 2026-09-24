import { createClient } from "@supabase/supabase-js";
import { isMarketResearchPost } from "@/lib/market-research/catalog";
import { propertyDetailPath } from "@/lib/propertySeo";
import { getSupabaseAnonKey, getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";
import { SITE_ORIGIN } from "@/lib/site";

export type SignalKind = "blog" | "market-research" | "property";

export type ContentSignal = {
  id: string;
  kind: SignalKind;
  title: string;
  summary: string;
  path: string;
  updatedAt: string;
};

type PushSubscriptionRow = {
  visitor_id: string;
  endpoint: string | null;
  p256dh: string | null;
  auth_key: string | null;
  enabled: boolean;
};

function publicClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function serviceClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function listRecentSignals(): Promise<ContentSignal[]> {
  const supabase = publicClient();
  if (!supabase) return [];

  const [{ data: posts }, { data: properties }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id, title, excerpt, slug, category, updated_at, status")
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("properties")
      .select("id, title, location, price, updated_at, published")
      .eq("published", true)
      .order("updated_at", { ascending: false })
      .limit(8),
  ]);

  const articles: ContentSignal[] = (posts || []).map((post) => {
    const research = isMarketResearchPost(post.category);
    return {
      id: `${research ? "market-research" : "blog"}:${post.slug}:${post.updated_at}`,
      kind: research ? "market-research" : "blog",
      title: post.title,
      summary: post.excerpt || "",
      path: research
        ? `/iapl-insider/market-research/${post.slug}`
        : `/iapl-insider/blogs/${post.slug}`,
      updatedAt: post.updated_at,
    };
  });

  const listings: ContentSignal[] = (properties || []).map((property) => ({
    id: `property:${property.id}:${property.updated_at}`,
    kind: "property",
    title: property.title,
    summary: [property.location, property.price].filter(Boolean).join(" · "),
    path: propertyDetailPath(property.id),
    updatedAt: property.updated_at,
  }));

  return [...articles, ...listings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 12);
}

export async function saveSubscription(input: {
  visitorId: string;
  enabled: boolean;
  endpoint?: string | null;
  p256dh?: string | null;
  authKey?: string | null;
}) {
  const supabase = serviceClient();
  if (!supabase) return { saved: false as const, reason: "notifications-not-configured" };

  const { error } = await supabase.from("notification_subscriptions").upsert(
    {
      visitor_id: input.visitorId,
      enabled: input.enabled,
      endpoint: input.endpoint || null,
      p256dh: input.p256dh || null,
      auth_key: input.authKey || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "visitor_id" }
  );

  if (error) return { saved: false as const, reason: error.message };
  return { saved: true as const };
}

function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function recentlySignaled(path: string) {
  const supabase = serviceClient();
  if (!supabase) return false;
  const { data } = await supabase
    .from("content_signals")
    .select("created_at")
    .eq("path", path)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data?.created_at) return false;
  return Date.now() - new Date(data.created_at).getTime() < 10 * 60 * 1000;
}

async function rememberSignal(signal: { kind: SignalKind; title: string; summary: string; path: string }) {
  const supabase = serviceClient();
  if (!supabase) return;
  await supabase.from("content_signals").insert({
    kind: signal.kind,
    title: signal.title,
    summary: signal.summary,
    path: signal.path,
  });
}

async function audienceEmails(): Promise<string[]> {
  const supabase = serviceClient();
  if (!supabase) return [];

  const [{ data: subscribers }, { data: inquiries }, { data: leads }] = await Promise.all([
    supabase.from("newsletter_subscribers").select("email").eq("status", "active"),
    supabase.from("inquiries").select("email"),
    supabase.from("property_leads").select("email"),
  ]);

  const emails = new Set<string>();
  for (const row of [...(subscribers || []), ...(inquiries || []), ...(leads || [])]) {
    const email = String(row.email || "").trim().toLowerCase();
    if (email.includes("@")) emails.add(email);
  }
  return [...emails];
}

async function sendUpdateEmail(signal: { title: string; summary: string; path: string; kind: SignalKind }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "IAPL Admin <notifications@inukaproperties.co.ke>";
  const inbox = process.env.NOTIFY_EMAIL || process.env.ADMIN_NOTIFY_EMAIL || "info@inukaproperties.co.ke";
  if (!apiKey) return 0;

  const recipients = await audienceEmails();
  if (!recipients.length) return 0;

  const label =
    signal.kind === "property" ? "Property update" : signal.kind === "market-research" ? "Market research update" : "Blog update";
  const url = absoluteUrl(signal.path);
  const html = `
    <p>${label} from Inuka Afrika Properties.</p>
    <h2>${escapeHtml(signal.title)}</h2>
    <p>${escapeHtml(signal.summary || "")}</p>
    <p><a href="${url}">Open the update</a></p>
  `;

  let sent = 0;
  for (let index = 0; index < recipients.length; index += 40) {
    const batch = recipients.slice(index, index + 40);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [inbox],
        bcc: batch,
        subject: `${label}: ${signal.title}`,
        html,
      }),
    });
    if (response.ok) sent += batch.length;
  }
  return sent;
}

async function sendBrowserPushes(signal: { title: string; summary: string; path: string }) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return 0;

  const supabase = serviceClient();
  if (!supabase) return 0;

  const { data } = await supabase
    .from("notification_subscriptions")
    .select("visitor_id, endpoint, p256dh, auth_key, enabled")
    .eq("enabled", true);

  const rows = ((data || []) as PushSubscriptionRow[]).filter((row) => row.endpoint && row.p256dh && row.auth_key);
  if (!rows.length) return 0;

  type WebPush = {
    setVapidDetails: (subject: string, publicKey: string, privateKey: string) => void;
    sendNotification: (
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
      payload: string
    ) => Promise<unknown>;
  };
  let webpush: WebPush;
  try {
    const imported = (await import("web-push")) as WebPush & { default?: WebPush };
    webpush = imported.default ?? imported;
    if (!webpush.setVapidDetails || !webpush.sendNotification) return 0;
  } catch {
    return 0;
  }

  webpush.setVapidDetails("mailto:info@inukaproperties.co.ke", publicKey, privateKey);
  const payload = JSON.stringify({
    title: signal.title,
    body: signal.summary || "There is an update on the Inuka Afrika Properties website.",
    url: absoluteUrl(signal.path),
  });

  let delivered = 0;
  await Promise.all(
    rows.map(async (row) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoint as string,
            keys: { p256dh: row.p256dh as string, auth: row.auth_key as string },
          },
          payload
        );
        delivered += 1;
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await supabase.from("notification_subscriptions").update({ enabled: false, endpoint: null }).eq("visitor_id", row.visitor_id);
        }
      }
    })
  );
  return delivered;
}

export async function publishContentSignal(signal: {
  kind: SignalKind;
  title: string;
  summary: string;
  path: string;
}) {
  if (await recentlySignaled(signal.path)) {
    return { skipped: true, emailed: 0, pushed: 0 };
  }

  await rememberSignal(signal);
  const [emailed, pushed] = await Promise.all([sendUpdateEmail(signal), sendBrowserPushes(signal)]);
  return { skipped: false, emailed, pushed };
}

export function vapidPublicKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || "";
}
