import { createClient } from "@supabase/supabase-js";
import type { ClientTestimonial, LandingPage, Property } from "@/lib/supabase/types";
import { asStringList } from "./defaults";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export type LandingPageWithProperty = LandingPage & {
  properties?: Property | null;
};

export function normalizeLandingPage(row: LandingPageWithProperty): LandingPageWithProperty {
  return {
    ...row,
    highlights: asStringList(row.highlights),
  };
}

export async function fetchPublishedLandingPage(slug: string) {
  const supabase = getPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("landing_pages")
    .select("*, properties(*)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeLandingPage(data as LandingPageWithProperty);
}

export async function fetchLandingTestimonials(): Promise<ClientTestimonial[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("client_testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  return (data as ClientTestimonial[]) || [];
}
