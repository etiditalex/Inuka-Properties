import type { SupabaseClient } from "@supabase/supabase-js";
import { formatPhoneKenyaE164 } from "@/lib/phone/kenya";
import type { PropertyLead } from "@/lib/supabase/types";

const PLACEHOLDER_EMAIL_DOMAIN = "@noemail.inukaproperties.co.ke";
const GENERIC_NAMES = new Set(["website visitor", "visitor"]);

const STATUS_RANK: Record<string, number> = {
  converted: 5,
  qualified: 4,
  contacted: 3,
  new: 2,
  lost: 1,
};

export type LeadIdentity = {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string;
  created_at?: string;
};

export function normalizeLeadEmail(email: string | null | undefined): string {
  return (email || "").trim().toLowerCase();
}

export function isPlaceholderLeadEmail(email: string | null | undefined): boolean {
  return normalizeLeadEmail(email).endsWith(PLACEHOLDER_EMAIL_DOMAIN);
}

export function isGenericLeadName(name: string | null | undefined): boolean {
  return GENERIC_NAMES.has((name || "").trim().toLowerCase());
}

export function leadPhoneKey(phone: string | null | undefined): string {
  return formatPhoneKenyaE164(phone || "");
}

export function emailsIdentifySameLead(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const left = normalizeLeadEmail(a);
  const right = normalizeLeadEmail(b);
  if (!left || !right) return false;
  if (isPlaceholderLeadEmail(left) || isPlaceholderLeadEmail(right)) return false;
  return left === right;
}

export function phonesIdentifySameLead(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const left = leadPhoneKey(a);
  const right = leadPhoneKey(b);
  return Boolean(left && right && left === right);
}

export function isSameLead(a: LeadIdentity, b: LeadIdentity): boolean {
  return phonesIdentifySameLead(a.phone, b.phone) || emailsIdentifySameLead(a.email, b.email);
}

function completenessScore(lead: LeadIdentity): number {
  let score = 0;
  if (lead.email && !isPlaceholderLeadEmail(lead.email)) score += 2;
  if (lead.name && !isGenericLeadName(lead.name)) score += 1;
  return score;
}

function pickCanonicalLead<T extends LeadIdentity>(group: T[]): T {
  return [...group].sort((a, b) => {
    const statusDiff = (STATUS_RANK[b.status || ""] || 0) - (STATUS_RANK[a.status || ""] || 0);
    if (statusDiff !== 0) return statusDiff;
    const completeDiff = completenessScore(b) - completenessScore(a);
    if (completeDiff !== 0) return completeDiff;
    const createdA = a.created_at ? Date.parse(a.created_at) : 0;
    const createdB = b.created_at ? Date.parse(b.created_at) : 0;
    return createdA - createdB;
  })[0];
}

/** Collapse repeat rows so each person appears once (same phone or same real email). */
export function uniquePropertyLeads<T extends LeadIdentity>(leads: T[]): T[] {
  if (leads.length <= 1) return leads;

  const parent = leads.map((_, index) => index);
  const find = (index: number): number => {
    let current = index;
    while (parent[current] !== current) {
      parent[current] = parent[parent[current]];
      current = parent[current];
    }
    return current;
  };
  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  };

  const byEmail = new Map<string, number>();
  const byPhone = new Map<string, number>();

  leads.forEach((lead, index) => {
    const email = normalizeLeadEmail(lead.email);
    const phone = leadPhoneKey(lead.phone);
    if (email && !isPlaceholderLeadEmail(email)) {
      const previous = byEmail.get(email);
      if (previous != null) union(previous, index);
      byEmail.set(email, index);
    }
    if (phone) {
      const previous = byPhone.get(phone);
      if (previous != null) union(previous, index);
      byPhone.set(phone, index);
    }
  });

  const buckets = new Map<number, T[]>();
  leads.forEach((lead, index) => {
    const root = find(index);
    const group = buckets.get(root) || [];
    group.push(lead);
    buckets.set(root, group);
  });

  return [...buckets.values()]
    .map((group) => pickCanonicalLead(group))
    .sort((a, b) => {
      const createdA = a.created_at ? Date.parse(a.created_at) : 0;
      const createdB = b.created_at ? Date.parse(b.created_at) : 0;
      return createdB - createdA;
    });
}

export async function findExistingPropertyLead(
  supabase: SupabaseClient,
  email: string,
  phone: string
): Promise<PropertyLead | null> {
  const { data, error } = await supabase.from("property_leads").select("id, email, phone");
  if (error || !data?.length) return null;

  const incoming = { email, phone };
  const match = data.find((row) => isSameLead(incoming, row));
  if (!match?.id) return null;

  const { data: full, error: fullError } = await supabase
    .from("property_leads")
    .select("*")
    .eq("id", match.id)
    .single();

  if (fullError || !full) return null;
  return full as PropertyLead;
}

type IncomingLead = {
  name: string;
  email: string;
  phone: string;
  property_id?: number | null;
  property_name?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  source?: string | null;
};

function isAutoCaptureMessage(message: string | null | undefined): boolean {
  return (message || "").trim().toLowerCase().startsWith("auto-captured");
}

export function buildLeadEnrichment(
  existing: PropertyLead,
  incoming: IncomingLead
): Partial<PropertyLead> | null {
  const updates: Partial<PropertyLead> = {};

  if (isGenericLeadName(existing.name) && incoming.name && !isGenericLeadName(incoming.name)) {
    updates.name = incoming.name.trim();
  }

  if (isPlaceholderLeadEmail(existing.email) && incoming.email && !isPlaceholderLeadEmail(incoming.email)) {
    updates.email = incoming.email.trim();
  }

  const incomingPropertyId = incoming.property_id || null;
  if (incomingPropertyId && incomingPropertyId !== existing.property_id) {
    updates.property_id = incomingPropertyId;
    updates.property_name = incoming.property_name || existing.property_name;
  } else if (!existing.property_name && incoming.property_name) {
    updates.property_name = incoming.property_name;
  }

  if (incoming.preferred_date && !existing.preferred_date) {
    updates.preferred_date = incoming.preferred_date;
  }
  if (incoming.preferred_time && !existing.preferred_time) {
    updates.preferred_time = incoming.preferred_time;
  }

  const incomingMessage = incoming.message?.trim() || "";
  const shouldNoteRepeat =
    Boolean(incomingPropertyId && incomingPropertyId !== existing.property_id) ||
    Boolean(incomingMessage && !isAutoCaptureMessage(incomingMessage) && incomingMessage !== (existing.message || ""));

  if (shouldNoteRepeat) {
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const detail = [
      incoming.property_name || existing.property_name,
      incoming.source,
    ]
      .filter(Boolean)
      .join(" · ");
    const line = `Repeat interest ${stamp}${detail ? `: ${detail}` : ""}`;
    updates.notes = [existing.notes, line].filter(Boolean).join("\n");
  }

  return Object.keys(updates).length > 0 ? updates : null;
}
