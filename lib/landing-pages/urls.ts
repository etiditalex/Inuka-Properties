import type { LandingPage, LandingPageChannel } from "@/lib/supabase/types";
import { slugify } from "@/lib/admin/utils";
import { SITE_ORIGIN } from "@/lib/site";
import { landingPagePath } from "./path";

export const LANDING_PAGE_CHANNELS: {
  value: LandingPageChannel;
  label: string;
  utmSource: string;
  utmMedium: string;
  leadSource: string;
  usesPixel: boolean;
}[] = [
  {
    value: "facebook",
    label: "Facebook Ads",
    utmSource: "facebook",
    utmMedium: "paid_social",
    leadSource: "facebook_ad",
    usesPixel: true,
  },
  {
    value: "instagram",
    label: "Instagram Ads",
    utmSource: "instagram",
    utmMedium: "paid_social",
    leadSource: "instagram_ad",
    usesPixel: true,
  },
  {
    value: "google",
    label: "Google Ads",
    utmSource: "google",
    utmMedium: "cpc",
    leadSource: "google_ad",
    usesPixel: false,
  },
  {
    value: "tiktok",
    label: "TikTok Ads",
    utmSource: "tiktok",
    utmMedium: "paid_social",
    leadSource: "tiktok_ad",
    usesPixel: false,
  },
  {
    value: "whatsapp",
    label: "WhatsApp campaign",
    utmSource: "whatsapp",
    utmMedium: "social",
    leadSource: "whatsapp_campaign",
    usesPixel: false,
  },
  {
    value: "email",
    label: "Email campaign",
    utmSource: "email",
    utmMedium: "email",
    leadSource: "email_campaign",
    usesPixel: false,
  },
  {
    value: "other",
    label: "Other / direct",
    utmSource: "landing",
    utmMedium: "referral",
    leadSource: "landing_page",
    usesPixel: false,
  },
];

export function channelConfig(channel?: string | null) {
  return LANDING_PAGE_CHANNELS.find((item) => item.value === channel) || LANDING_PAGE_CHANNELS[0];
}

const CHANNEL_UTM_SUFFIX: Record<LandingPageChannel, string> = {
  facebook: "fb",
  instagram: "ig",
  google: "google",
  tiktok: "tiktok",
  whatsapp: "wa",
  email: "email",
  other: "lp",
};

/** Builds utm_campaign from the page slug + channel, e.g. tulivu-haven-fb */
export function autoUtmCampaign(slug: string, channel?: string | null): string {
  const config = channelConfig(channel);
  const suffix = CHANNEL_UTM_SUFFIX[config.value];
  let base = slugify(slug);
  if (!base) return "";

  const suffixes = Object.values(CHANNEL_UTM_SUFFIX).sort((a, b) => b.length - a.length);
  for (const item of suffixes) {
    if (base.endsWith(`-${item}`)) {
      base = base.slice(0, -(item.length + 1));
      break;
    }
  }

  return base ? `${base}-${suffix}` : suffix;
}

export function landingPageAbsoluteUrl(slug: string): string {
  return `${SITE_ORIGIN}${landingPagePath(slug)}`;
}

export function campaignLandingUrl(
  slug: string,
  utmCampaign?: string | null,
  channel?: string | null
): string {
  const config = channelConfig(channel);
  const campaign = utmCampaign?.trim() || autoUtmCampaign(slug, channel) || slug;
  const params = new URLSearchParams({
    utm_source: config.utmSource,
    utm_medium: config.utmMedium,
    utm_campaign: campaign,
  });
  return `${landingPageAbsoluteUrl(slug)}?${params.toString()}`;
}

/** @deprecated Use campaignLandingUrl */
export function facebookLandingUrl(slug: string, utmCampaign?: string | null): string {
  return campaignLandingUrl(slug, utmCampaign, "facebook");
}

export function duplicateLandingCopy(page: LandingPage): Partial<LandingPage> {
  const stamp = Date.now().toString().slice(-4);
  return {
    name: `${page.name} (copy)`,
    slug: `${page.slug}-copy-${stamp}`,
    property_id: page.property_id,
    campaign_name: page.campaign_name,
    utm_campaign: autoUtmCampaign(`${page.slug}-copy-${stamp}`, page.channel || "facebook"),
    channel: page.channel || "facebook",
    template: page.template,
    headline: page.headline,
    subheadline: page.subheadline,
    badge_text: page.badge_text,
    cta_text: page.cta_text,
    form_heading: page.form_heading,
    form_subheading: page.form_subheading,
    thank_you_message: page.thank_you_message,
    hero_image: page.hero_image,
    highlights: page.highlights,
    body_html: page.body_html,
    offer_price: page.offer_price,
    offer_size: page.offer_size,
    payment_plan_note: page.payment_plan_note,
    show_price: page.show_price,
    show_plots_remaining: page.show_plots_remaining,
    show_whatsapp: page.show_whatsapp,
    show_call: page.show_call,
    show_testimonials: page.show_testimonials,
    pixel_enabled: page.pixel_enabled,
    published: false,
  };
}
