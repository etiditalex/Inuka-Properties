import { createClient } from "@supabase/supabase-js";
import type { ClientTestimonial } from "@/lib/supabase/types";
import {
  getLandingPageById,
  getPublishedLandingPageBySlug,
  type LandingPageWithProperty,
} from "@/lib/landing-pages/store";

export type { LandingPageWithProperty };

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function fetchPublishedLandingPage(slug: string) {
  return getPublishedLandingPageBySlug(slug);
}

export async function fetchLandingPageById(id: number) {
  return getLandingPageById(id);
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
