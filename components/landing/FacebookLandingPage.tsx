"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
} from "lucide-react";
import FacebookPixel from "@/components/FacebookPixel";
import FacebookAdLandingCapture from "@/components/FacebookAdLandingCapture";
import PropertyDetailsForm from "@/components/property/PropertyDetailsForm";
import { DEFAULT_OG_IMAGE, SITE_SHORT_NAME } from "@/lib/seo";
import { trackFacebookEvent } from "@/lib/facebook/trackClient";
import { asStringList, plotsRemaining } from "@/lib/landing-pages/defaults";
import { landingPagePath } from "@/lib/landing-pages/path";
import type { ClientTestimonial, LandingPage, Property } from "@/lib/supabase/types";
import { whatsAppUrl } from "@/lib/whatsapp";
import { channelConfig } from "@/lib/landing-pages/urls";
import { isPosterListingImage, listingImageFitClass } from "@/lib/images";

const SALES_PHONE_DISPLAY = "0711 082 084";
const SALES_PHONE_TEL = "+254711082084";

export type FacebookLandingPageProps = {
  page: Partial<LandingPage>;
  property?: Property | null;
  testimonials?: ClientTestimonial[];
  preview?: boolean;
};

function scrollToForm() {
  document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function FacebookLandingPage({
  page,
  property,
  testimonials = [],
  preview = false,
}: FacebookLandingPageProps) {
  const template = page.template || "offer";
  const isUrgency = template === "urgency";
  const isMagnet = template === "lead_magnet";
  const title = page.headline || property?.title || "Land for sale";
  const propertyTitle = property?.title || title;
  const propertyId = page.property_id || property?.id || 0;
  const hero = page.hero_image || property?.image || DEFAULT_OG_IMAGE;
  const posterHero = isPosterListingImage({
    id: page.property_id || property?.id,
    title: property?.title || page.headline,
    image: hero,
    hero_image: page.hero_image,
  });
  const heroFitClass = listingImageFitClass({
    id: page.property_id || property?.id,
    title: property?.title || page.headline,
    image: hero,
    hero_image: page.hero_image,
  });
  const location = property?.location || "";
  const price = page.offer_price || property?.price || "";
  const size = page.offer_size || property?.size || "";
  const remaining = plotsRemaining(property);
  const highlights = asStringList(page.highlights);
  const pagePath = page.slug ? landingPagePath(page.slug) : "/lp/preview";
  const channel = channelConfig(page.channel);
  const waUrl = whatsAppUrl(
    `Hi, I am interested in ${propertyTitle}. I would like more details and the payment plan.`
  );

  const trackMeta = useMemo(
    () => ({
      property_id: propertyId || null,
      property_name: propertyTitle,
      page_path: pagePath,
      event_data: {
        landing_page_id: page.id ?? null,
        landing_page_slug: page.slug ?? null,
        template,
      },
    }),
    [page.id, page.slug, pagePath, propertyId, propertyTitle, template]
  );

  useEffect(() => {
    if (preview || !page.pixel_enabled) return;
    trackFacebookEvent("ViewContent", trackMeta, {
      customData: {
        content_name: propertyTitle,
        content_ids: propertyId ? [String(propertyId)] : undefined,
        content_type: "product",
        value: undefined,
      },
    });
  }, [preview, page.pixel_enabled, propertyId, propertyTitle, trackMeta]);

  const trackContact = (action: string) => {
    if (preview || !page.pixel_enabled) return;
    trackFacebookEvent(
      "Contact",
      { ...trackMeta, event_data: { ...trackMeta.event_data, action } },
      { customData: { content_name: propertyTitle } }
    );
  };

  const ctaClass = isUrgency
    ? "w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3.5 rounded-lg font-bold hover:from-secondary-600 hover:to-secondary-700 transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
    : "w-full bg-primary-600 text-white py-3.5 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg";

  const leadForm = (
    <div id="lead-form" className="scroll-mt-24">
      <div
        className={
          isUrgency
            ? "rounded-2xl border-2 border-secondary-400 bg-white p-5 shadow-xl sm:p-6"
            : "rounded-2xl border border-dark-100 bg-white p-5 shadow-xl sm:p-6"
        }
      >
        {page.badge_text ? (
          <p
            className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              isUrgency ? "bg-secondary-100 text-secondary-800" : "bg-primary-50 text-primary-800"
            }`}
          >
            {page.badge_text}
          </p>
        ) : null}
        <PropertyDetailsForm
          propertyId={propertyId || 0}
          propertyTitle={propertyTitle}
          source={channelConfig(page.channel).leadSource}
          landingPageId={page.id ?? null}
          message={`Requested details from landing page (${page.name || page.slug || "untitled"})`}
          trackLead={Boolean(page.pixel_enabled) && channelConfig(page.channel).usesPixel}
          heading={page.form_heading || "Get full details now"}
          subheading={
            page.form_subheading ||
            "Enter your details and we will email you pricing, the payment plan, and plot availability."
          }
          ctaText={page.cta_text || "Get Full Details Now"}
          thankYouMessage={page.thank_you_message || undefined}
          whatsAppAfterSubmit={
            page.show_whatsapp
              ? { url: waUrl, label: "Continue on WhatsApp" }
              : undefined
          }
          submitClassName={ctaClass}
        />
        <p className="mt-3 text-center text-[11px] text-dark-400">
          Instant email. No spam. Our sales team follows up on WhatsApp.
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isUrgency ? "bg-amber-50/40" : "bg-neutral-50"}`}>
      {!preview ? <FacebookAdLandingCapture /> : null}
      {!preview && page.pixel_enabled ? (
        <FacebookPixel propertyId={propertyId || undefined} pagePath={pagePath} />
      ) : null}

      <header className={`${preview ? "relative" : "sticky top-0"} z-30 border-b border-dark-100 bg-white/95 backdrop-blur`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white ring-1 ring-dark-100">
              <Image src={DEFAULT_OG_IMAGE} alt={SITE_SHORT_NAME} fill className="object-contain p-0.5" unoptimized />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-dark-900 font-montserrat">{SITE_SHORT_NAME}</p>
              <p className="text-[10px] text-dark-500">Licensed · Title deeds · Coastal Kenya</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {page.show_call ? (
              <a
                href={`tel:${SALES_PHONE_TEL}`}
                onClick={() => trackContact("phone")}
                className="hidden items-center gap-1.5 rounded-full border border-dark-200 px-3 py-1.5 text-xs font-semibold text-dark-800 sm:inline-flex"
              >
                <Phone size={14} className="text-primary-600" />
                {SALES_PHONE_DISPLAY}
              </a>
            ) : null}
            {page.show_whatsapp ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("whatsapp")}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {!isMagnet ? (
        <section className="relative">
          <div className={posterHero ? "bg-neutral-100" : ""}>
            <div
              className={
                posterHero
                  ? "relative mx-auto h-[340px] w-full max-w-lg sm:h-[400px] lg:h-[440px]"
                  : "relative h-[420px] w-full sm:h-[480px] lg:h-[520px]"
              }
            >
              <Image
                src={hero}
                alt={title}
                fill
                className={posterHero ? `${heroFitClass} p-4 sm:p-6` : "object-cover"}
                priority={!preview}
                unoptimized
              />
              {!posterHero ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/55 to-dark-950/20" />
                  <div className="absolute inset-0 flex items-end">
                    <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-24">
                      {page.badge_text ? (
                        <span className="mb-3 inline-block rounded-full bg-secondary-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                          {page.badge_text}
                        </span>
                      ) : null}
                      <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white font-montserrat sm:text-4xl lg:text-5xl">
                        {title}
                      </h1>
                      {page.subheadline ? (
                        <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">{page.subheadline}</p>
                      ) : null}
                      {location ? (
                        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80">
                          <MapPin size={16} /> {location}
                        </p>
                      ) : null}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {page.show_price && price ? (
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-800">
                            {price}
                          </span>
                        ) : null}
                        {size ? (
                          <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30">
                            {size}
                          </span>
                        ) : null}
                        {page.show_plots_remaining && remaining != null ? (
                          <span className="rounded-full bg-secondary-500 px-4 py-2 text-sm font-bold text-white">
                            {remaining} plot{remaining === 1 ? "" : "s"} remaining
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={scrollToForm}
                        className={`mt-6 hidden rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg sm:inline-flex ${
                          isUrgency ? "bg-secondary-500 hover:bg-secondary-600" : "bg-primary-600 hover:bg-primary-700"
                        }`}
                      >
                        {page.cta_text || "Get Full Details Now"}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            {posterHero ? (
              <div className="mx-auto max-w-5xl px-4 py-8 text-center">
                {page.badge_text ? (
                  <span className="mb-3 inline-block rounded-full bg-secondary-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {page.badge_text}
                  </span>
                ) : null}
                <h1 className="text-3xl font-bold leading-tight text-dark-900 font-montserrat sm:text-4xl">
                  {title}
                </h1>
                {page.subheadline ? (
                  <p className="mx-auto mt-3 max-w-2xl text-base text-dark-600 sm:text-lg">{page.subheadline}</p>
                ) : null}
                {location ? (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-dark-500">
                    <MapPin size={16} /> {location}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <main className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:py-10">
        {isMagnet ? (
          <div className="mb-8 text-center">
            {page.badge_text ? (
              <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase text-primary-800">
                {page.badge_text}
              </span>
            ) : null}
            <h1 className="text-3xl font-bold text-dark-900 font-montserrat sm:text-4xl">{title}</h1>
            {page.subheadline ? (
              <p className="mx-auto mt-3 max-w-2xl text-dark-600">{page.subheadline}</p>
            ) : null}
          </div>
        ) : null}

        <div className={`grid gap-8 ${isMagnet ? "lg:grid-cols-[1fr_1.1fr]" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
          <div className={isMagnet ? "order-2 lg:order-1" : "order-2 lg:order-1"}>
            {isMagnet ? (
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className={`relative h-64 ${posterHero ? "bg-neutral-100" : ""}`}>
                  <Image
                    src={hero}
                    alt={title}
                    fill
                    className={posterHero ? `${heroFitClass} p-3` : "object-cover"}
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-dark-900 font-montserrat">{propertyTitle}</h2>
                  {location ? (
                    <p className="mt-1 flex items-center gap-1 text-sm text-dark-600">
                      <MapPin size={14} className="text-primary-600" /> {location}
                    </p>
                  ) : null}
                  {page.show_price && price ? (
                    <p className="mt-3 text-2xl font-bold text-primary-700">{price}</p>
                  ) : null}
                  {size ? <p className="text-sm text-dark-500">{size}</p> : null}
                </div>
              </div>
            ) : null}

            {highlights.length > 0 ? (
              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-dark-900 font-montserrat">Why buyers choose this project</h2>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-dark-700">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {page.payment_plan_note ? (
              <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/60 p-6">
                <h2 className="mb-2 text-lg font-bold text-dark-900 font-montserrat">Payment plan</h2>
                <p className="whitespace-pre-line text-sm text-dark-700">{page.payment_plan_note}</p>
              </div>
            ) : null}

            {page.body_html ? (
              <div
                className="prose prose-sm mt-6 max-w-none rounded-2xl bg-white p-6 text-dark-700 shadow-sm"
                dangerouslySetInnerHTML={{ __html: page.body_html }}
              />
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Shield, label: "10+ years", detail: "Coastal Kenya developer" },
                { icon: BadgeCheck, label: "Title deeds", detail: "Processed for buyers" },
                { icon: Star, label: "Site visits", detail: "See the land first" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white p-4 text-center shadow-sm">
                  <item.icon size={20} className="mx-auto text-primary-600" />
                  <p className="mt-2 text-sm font-bold text-dark-900">{item.label}</p>
                  <p className="text-xs text-dark-500">{item.detail}</p>
                </div>
              ))}
            </div>

            {page.show_testimonials && testimonials.length > 0 ? (
              <div className="mt-6 space-y-4">
                <h2 className="text-lg font-bold text-dark-900 font-montserrat">What buyers say</h2>
                {testimonials.map((item) => (
                  <blockquote key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-dark-700">“{item.text}”</p>
                    <footer className="mt-3 text-xs font-semibold text-dark-900">
                      {item.name}
                      {item.location ? ` · ${item.location}` : ""}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`${isMagnet ? "order-1 lg:order-2" : "order-1 lg:order-2"} ${preview ? "" : "lg:sticky lg:top-20 lg:self-start"}`}>
            {leadForm}
          </div>
        </div>
      </main>

      <footer className={`border-t border-dark-100 bg-white py-6 text-center text-xs text-dark-500 ${preview ? "" : "pb-24"}`}>
        <p className="font-semibold text-dark-700">{SITE_SHORT_NAME}</p>
        <p className="mt-1">Nyali, Mombasa · {SALES_PHONE_DISPLAY}</p>
      </footer>

      {!preview ? (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-dark-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl gap-2">
          <button
            type="button"
            onClick={scrollToForm}
            className={`flex-1 rounded-xl py-3 text-sm font-bold text-white ${
              isUrgency ? "bg-secondary-500" : "bg-primary-600"
            }`}
          >
            {page.cta_text || "Get Details"}
          </button>
          {page.show_whatsapp ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact("whatsapp_sticky")}
              className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
      ) : null}
    </div>
  );
}
