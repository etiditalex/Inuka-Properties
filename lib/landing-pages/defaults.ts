import { slugify } from "@/lib/admin/utils";
import type { LandingPage, LandingPageChannel, LandingPageTemplate, Property } from "@/lib/supabase/types";

export const LANDING_PAGE_TEMPLATES: { value: LandingPageTemplate; label: string; hint: string }[] =
  [
    {
      value: "offer",
      label: "Property offer",
      hint: "Hero photo, price, and a sticky lead form — best for plot sales ads",
    },
    {
      value: "lead_magnet",
      label: "Details magnet",
      hint: "Form-first layout for “get the brochure / payment plan” ads",
    },
    {
      value: "urgency",
      label: "Limited plots",
      hint: "Scarcity-focused layout for “few plots left” campaigns",
    },
  ];

export const DEFAULT_LANDING_HIGHLIGHTS = [
  "Ready title deed processing",
  "Flexible payment plan",
  "Free guided site visit",
  "Prime accessible location",
  "Ideal for a home or investment",
];

export function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export const emptyLandingPage: Partial<LandingPage> = {
  name: "",
  slug: "",
  property_id: null,
  campaign_name: "",
  utm_campaign: "",
  channel: "facebook" as LandingPageChannel,
  template: "offer",
  headline: "",
  subheadline: "",
  badge_text: "",
  cta_text: "Get Full Details Now",
  form_heading: "Reserve your interest today",
  form_subheading:
    "Enter your details and we will email you pricing, the payment plan, and plot availability.",
  thank_you_message: "",
  hero_image: "",
  highlights: [],
  body_html: "",
  offer_price: "",
  offer_size: "",
  payment_plan_note: "",
  show_price: true,
  show_plots_remaining: true,
  show_whatsapp: true,
  show_call: true,
  show_testimonials: false,
  pixel_enabled: true,
  published: false,
};

export function plotsRemaining(property?: Pick<Property, "total_units" | "sold_units"> | null) {
  if (!property?.total_units || property.total_units <= 0) return null;
  return Math.max(0, property.total_units - (property.sold_units || 0));
}

function paymentPlanNote(plan: Property["payment_plan"]): string {
  if (!plan) return "";
  if (typeof plan === "string") return plan;
  return Object.entries(plan)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

export function copyFromProperty(property: Property): Partial<LandingPage> {
  const remaining = plotsRemaining(property);
  const highlights =
    Array.isArray(property.features) && property.features.length > 0
      ? property.features.slice(0, 6)
      : DEFAULT_LANDING_HIGHLIGHTS;
  const slug = slugify(`${property.title}-fb`);

  return {
    name: `${property.title} — Facebook Ad`,
    slug,
    property_id: property.id,
    campaign_name: property.title,
    utm_campaign: slug,
    channel: "facebook",
    headline: property.h1 || property.title,
    subheadline: `Secure your plot in ${property.location}. Flexible payment plan. Title deed processing included.`,
    badge_text:
      remaining != null
        ? remaining > 0
          ? `Only ${remaining} plot${remaining === 1 ? "" : "s"} remaining`
          : "Now selling"
        : "Now selling",
    cta_text: "Get Full Details Now",
    form_heading: `Get ${property.title} details`,
    form_subheading:
      "Enter your name, email, and WhatsApp number. We will send pricing and the payment plan instantly.",
    hero_image: property.image,
    highlights,
    offer_price: property.price,
    offer_size: property.size,
    payment_plan_note: paymentPlanNote(property.payment_plan),
  };
}
