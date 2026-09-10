"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Save, Wand2, Copy } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminInput, AdminSelect, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import ImageUpload from "@/components/admin/ImageUpload";
import AdminButton from "@/components/admin/AdminButton";
import LandingPagePreview from "@/components/admin/preview/LandingPagePreview";
import { createClient } from "@/lib/supabase/client";
import type { ClientTestimonial, LandingPage, LandingPageChannel, LandingPageTemplate, Property } from "@/lib/supabase/types";
import { slugify, cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import {
  asStringList,
  copyFromProperty,
  emptyLandingPage,
  LANDING_PAGE_TEMPLATES,
} from "@/lib/landing-pages/defaults";
import { LANDING_PAGES_SETUP_MESSAGE, isMissingLandingPagesTable } from "@/lib/landing-pages/setup";
import {
  autoUtmCampaign,
  campaignLandingUrl,
  channelConfig,
  duplicateLandingCopy,
  LANDING_PAGE_CHANNELS,
} from "@/lib/landing-pages/urls";

type LandingPageFormProps = { pageId?: number; duplicateFromId?: number };

function toPayload(form: Partial<LandingPage>) {
  return {
    name: form.name?.trim() || "",
    slug: slugify(form.slug || form.name || ""),
    property_id: form.property_id || null,
    campaign_name: form.campaign_name?.trim() || null,
    utm_campaign:
      form.utm_campaign?.trim() ||
      autoUtmCampaign(slugify(form.slug || form.name || ""), form.channel) ||
      null,
    channel: (form.channel || "facebook") as LandingPageChannel,
    template: (form.template || "offer") as LandingPageTemplate,
    headline: form.headline?.trim() || "",
    subheadline: form.subheadline?.trim() || null,
    badge_text: form.badge_text?.trim() || null,
    cta_text: form.cta_text?.trim() || "Get Full Details Now",
    form_heading: form.form_heading?.trim() || null,
    form_subheading: form.form_subheading?.trim() || null,
    thank_you_message: form.thank_you_message?.trim() || null,
    hero_image: form.hero_image?.trim() || null,
    highlights: asStringList(form.highlights),
    body_html: form.body_html?.trim() || null,
    offer_price: form.offer_price?.trim() || null,
    offer_size: form.offer_size?.trim() || null,
    payment_plan_note: form.payment_plan_note?.trim() || null,
    show_price: form.show_price ?? true,
    show_plots_remaining: form.show_plots_remaining ?? true,
    show_whatsapp: form.show_whatsapp ?? true,
    show_call: form.show_call ?? true,
    show_testimonials: form.show_testimonials ?? false,
    pixel_enabled: form.pixel_enabled ?? true,
    published: form.published ?? false,
  };
}

export default function LandingPageFormPage({ pageId, duplicateFromId }: LandingPageFormProps) {
  const router = useRouter();
  const isEdit = Boolean(pageId);
  const [form, setForm] = useState<Partial<LandingPage>>(emptyLandingPage);
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [utmLocked, setUtmLocked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("properties")
      .select("*")
      .order("title", { ascending: true })
      .then(({ data }) => setProperties((data as Property[]) || []));
    supabase
      .from("client_testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(3)
      .then(({ data }) => setTestimonials((data as ClientTestimonial[]) || []));
  }, []);

  useEffect(() => {
    if (!pageId) return;
    async function load() {
      const supabase = createClient();
      const { data, error: loadError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", pageId)
        .single();
      if (loadError) {
        setError(loadError.message);
        return;
      }
      if (data) {
        const page = data as LandingPage;
        const slug = page.slug || "";
        const generated = autoUtmCampaign(slug, page.channel);
        setUtmLocked(Boolean(page.utm_campaign && page.utm_campaign !== generated && page.utm_campaign !== slug));
        setForm({
          ...page,
          highlights: asStringList(page.highlights),
          utm_campaign: page.utm_campaign || generated,
        });
      }
    }
    load();
  }, [pageId]);

  useEffect(() => {
    if (pageId || !duplicateFromId) return;
    async function loadCopy() {
      const supabase = createClient();
      const { data, error: loadError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", duplicateFromId)
        .single();
      if (loadError) {
        setError(loadError.message);
        return;
      }
      if (data) {
        const page = data as LandingPage;
        setUtmLocked(false);
        setForm({
          ...duplicateLandingCopy(page),
          highlights: asStringList(page.highlights),
        });
      }
    }
    loadCopy();
  }, [pageId, duplicateFromId]);

  const selectedProperty = useMemo(
    () => properties.find((item) => item.id === form.property_id) || null,
    [properties, form.property_id]
  );

  const update = (key: keyof LandingPage, value: unknown) =>
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !isEdit && !current.slug) {
        next.slug = slugify(String(value || ""));
      }
      if ((key === "name" || key === "slug") && !utmLocked) {
        const slug = slugify(String(next.slug || next.name || ""));
        next.utm_campaign = autoUtmCampaign(slug, next.channel);
      }
      if (key === "name" && !current.campaign_name) {
        next.campaign_name = String(value || "");
      }
      return next;
    });

  const fillFromListing = () => {
    if (!selectedProperty) return;
    const filled = copyFromProperty(selectedProperty);
    setUtmLocked(false);
    setForm((current) => ({
      ...current,
      ...filled,
      channel: current.channel || filled.channel,
      utm_campaign: autoUtmCampaign(
        filled.slug || current.slug || "",
        current.channel || filled.channel
      ),
    }));
  };

  const handlePropertyChange = (value: string) => {
    const propertyId = value ? Number(value) : null;
    const property = properties.find((item) => item.id === propertyId) || null;
    if (!property) {
      update("property_id", null);
      return;
    }
    setForm((current) => {
      const filled = copyFromProperty(property);
      if (!current.headline) {
        return {
          ...current,
          ...filled,
          channel: current.channel || filled.channel,
          utm_campaign: utmLocked
            ? current.utm_campaign
            : autoUtmCampaign(filled.slug || "", current.channel || filled.channel),
        };
      }
      return {
        ...current,
        property_id: property.id,
        hero_image: current.hero_image || property.image,
        offer_price: current.offer_price || property.price,
        offer_size: current.offer_size || property.size,
      };
    });
  };

  const handleSave = async (createAnother = false) => {
    setSaving(true);
    setError("");
    const payload = toPayload(form);
    if (!payload.name || !payload.slug || !payload.headline) {
      setSaving(false);
      setError("Name, URL slug, and headline are required.");
      return;
    }

    const supabase = createClient();
    const persist = (data: typeof payload) =>
      isEdit
        ? supabase.from("landing_pages").update(data).eq("id", pageId!)
        : supabase.from("landing_pages").insert(data);

    let { error: saveError } = await persist(payload);
    if (saveError?.message.toLowerCase().includes("channel")) {
      const { channel: _channel, ...withoutChannel } = payload;
      ({ error: saveError } = await persist(withoutChannel as typeof payload));
    }

    setSaving(false);
    if (saveError) {
      setError(
        isMissingLandingPagesTable(saveError)
          ? LANDING_PAGES_SETUP_MESSAGE
          : saveError.message
      );
      return;
    }
    if (createAnother) {
      setForm(emptyLandingPage);
      setUtmLocked(false);
      router.replace(adminPath("landing-pages/new"));
      return;
    }
    router.push(adminPath("landing-pages"));
  };

  const campaignUrl = form.slug
    ? campaignLandingUrl(form.slug, form.utm_campaign, form.channel)
    : "";

  const copyCampaignUrl = async () => {
    if (!campaignUrl) return;
    await navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChannelChange = (value: string) => {
    const next = value as LandingPageChannel;
    const config = channelConfig(next);
    setForm((current) => {
      const slug = slugify(current.slug || current.name || "");
      return {
        ...current,
        channel: next,
        pixel_enabled: config.usesPixel,
        utm_campaign: utmLocked ? current.utm_campaign : autoUtmCampaign(slug, next),
      };
    });
  };

  const propertyOptions = [
    { value: "", label: "No listing linked" },
    ...properties.map((item) => ({ value: String(item.id), label: `${item.title} — ${item.location}` })),
  ];

  return (
    <AdminShell
      title={
        isEdit
          ? "Edit landing page"
          : duplicateFromId
            ? "Duplicate landing page"
            : "New landing page"
      }
      subtitle="Create as many converting pages as you need. Start with Facebook today, add Google, WhatsApp, or email campaigns later."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-5">
          <section className="space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-dark-500">Campaign</h3>
            <AdminInput
              label="Internal name"
              value={form.name || ""}
              onChange={(e) => update("name", e.target.value)}
              hint="Only visible in the dashboard"
            />
            <AdminInput
              label="URL slug"
              value={form.slug || ""}
              onChange={(e) => update("slug", slugify(e.target.value))}
              hint="Public URL: /lp/your-slug — copy this into Ads Manager as the destination"
            />
            <AdminSelect
              label="Campaign channel"
              options={LANDING_PAGE_CHANNELS.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
              value={form.channel || "facebook"}
              onChange={(e) => handleChannelChange(e.target.value)}
            />
            <AdminInput
              label="Campaign name"
              value={form.campaign_name || ""}
              onChange={(e) => update("campaign_name", e.target.value)}
              hint="Internal label for this ad set"
            />
            <AdminInput
              label="UTM campaign"
              value={form.utm_campaign || ""}
              onChange={(e) => {
                setUtmLocked(true);
                update("utm_campaign", slugify(e.target.value));
              }}
              hint="Filled automatically from the slug and channel. Edit only if you need a custom tag."
            />
            {campaignUrl ? (
              <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-dark-800">Generated campaign URL</p>
                  <AdminButton variant="outline" size="sm" onClick={copyCampaignUrl}>
                    <Copy size={14} />
                    {copied ? "Copied" : "Copy URL"}
                  </AdminButton>
                </div>
                <p className="break-all font-mono text-xs text-dark-700">{campaignUrl}</p>
                <dl className="mt-3 grid gap-1 text-[11px] text-dark-600 sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold text-dark-800">utm_source</dt>
                    <dd>{channelConfig(form.channel).utmSource}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-dark-800">utm_medium</dt>
                    <dd>{channelConfig(form.channel).utmMedium}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-dark-800">utm_campaign</dt>
                    <dd>{form.utm_campaign || autoUtmCampaign(form.slug || "", form.channel)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-xs text-dark-500">
                Add a name or slug and pick a channel — the Facebook / Google UTM URL appears here automatically.
              </p>
            )}
            <AdminSelect
              label="Linked land listing"
              options={propertyOptions}
              value={form.property_id ? String(form.property_id) : ""}
              onChange={(e) => handlePropertyChange(e.target.value)}
            />
            {selectedProperty ? (
              <AdminButton variant="outline" size="sm" onClick={fillFromListing}>
                <Wand2 size={14} /> Fill copy from this listing
              </AdminButton>
            ) : null}
          </section>

          <section className="space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-dark-500">Layout</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {LANDING_PAGE_TEMPLATES.map((item) => {
                const active = (form.template || "offer") === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => update("template", item.value)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition",
                      active
                        ? "border-primary-500 bg-primary-50 ring-2 ring-primary-100"
                        : "border-dark-200 bg-white hover:border-primary-200"
                    )}
                  >
                    <p className="text-sm font-semibold text-dark-900">{item.label}</p>
                    <p className="mt-1 text-[11px] text-dark-500">{item.hint}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-dark-500">Ad copy</h3>
            <p className="text-xs text-dark-500">
              Match the Facebook ad headline so visitors feel they landed in the right place.
            </p>
            <AdminInput
              label="Headline"
              value={form.headline || ""}
              onChange={(e) => update("headline", e.target.value)}
            />
            <AdminTextarea
              label="Subheadline"
              value={form.subheadline || ""}
              onChange={(e) => update("subheadline", e.target.value)}
              rows={3}
            />
            <AdminInput
              label="Urgency badge"
              value={form.badge_text || ""}
              onChange={(e) => update("badge_text", e.target.value)}
              hint='Example: "Only 8 plots remaining"'
            />
            <AdminInput
              label="Hero image URL"
              value={form.hero_image || ""}
              onChange={(e) => update("hero_image", e.target.value)}
            />
            <ImageUpload
              label="Or upload hero image"
              value={form.hero_image || ""}
              onChange={(url) => update("hero_image", url)}
              folder="landing-pages"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="Price shown"
                value={form.offer_price || ""}
                onChange={(e) => update("offer_price", e.target.value)}
              />
              <AdminInput
                label="Size shown"
                value={form.offer_size || ""}
                onChange={(e) => update("offer_size", e.target.value)}
              />
            </div>
            <AdminTextarea
              label="Benefits (one per line)"
              value={asStringList(form.highlights).join("\n")}
              onChange={(e) => update("highlights", asStringList(e.target.value))}
              rows={6}
            />
            <AdminTextarea
              label="Payment plan note"
              value={form.payment_plan_note || ""}
              onChange={(e) => update("payment_plan_note", e.target.value)}
              rows={3}
              hint="Short offer: deposit, monthly amount, or cash price"
            />
            <AdminTextarea
              label="Extra copy (HTML, optional)"
              value={form.body_html || ""}
              onChange={(e) => update("body_html", e.target.value)}
              rows={5}
            />
          </section>

          <section className="space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-dark-500">Lead form</h3>
            <AdminInput
              label="Form heading"
              value={form.form_heading || ""}
              onChange={(e) => update("form_heading", e.target.value)}
            />
            <AdminTextarea
              label="Form subheading"
              value={form.form_subheading || ""}
              onChange={(e) => update("form_subheading", e.target.value)}
              rows={2}
            />
            <AdminInput
              label="Button text"
              value={form.cta_text || ""}
              onChange={(e) => update("cta_text", e.target.value)}
            />
            <AdminTextarea
              label="Thank-you message"
              value={form.thank_you_message || ""}
              onChange={(e) => update("thank_you_message", e.target.value)}
              rows={2}
            />
          </section>

          <section className="space-y-3 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-dark-500">Conversion options</h3>
            <AdminToggle
              label="Show price"
              checked={form.show_price ?? true}
              onChange={(checked) => update("show_price", checked)}
            />
            <AdminToggle
              label="Show plots remaining"
              description="Uses sold / total units from the linked listing"
              checked={form.show_plots_remaining ?? true}
              onChange={(checked) => update("show_plots_remaining", checked)}
            />
            <AdminToggle
              label="WhatsApp button"
              checked={form.show_whatsapp ?? true}
              onChange={(checked) => update("show_whatsapp", checked)}
            />
            <AdminToggle
              label="Call button"
              checked={form.show_call ?? true}
              onChange={(checked) => update("show_call", checked)}
            />
            <AdminToggle
              label="Show testimonials"
              checked={form.show_testimonials ?? false}
              onChange={(checked) => update("show_testimonials", checked)}
            />
            <AdminToggle
              label="Facebook Pixel"
              description="PageView, ViewContent, Contact, and Lead events"
              checked={form.pixel_enabled ?? true}
              onChange={(checked) => update("pixel_enabled", checked)}
            />
            <AdminToggle
              label="Published"
              description="Live at /lp/slug. Unpublished pages stay private until you are ready."
              checked={form.published ?? false}
              onChange={(checked) => update("published", checked)}
            />
          </section>

          {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="flex flex-wrap gap-3">
            <AdminButton onClick={() => handleSave(false)} loading={saving}>
              <Save size={16} /> Save landing page
            </AdminButton>
            {!isEdit ? (
              <AdminButton variant="secondary" onClick={() => handleSave(true)} loading={saving}>
                Save & create another
              </AdminButton>
            ) : null}
            <AdminButton variant="outline" onClick={() => router.push(adminPath("landing-pages"))}>
              Cancel
            </AdminButton>
            {campaignUrl ? (
              <>
                <AdminButton variant="outline" onClick={copyCampaignUrl}>
                  {copied ? "Copied" : "Copy campaign URL"}
                </AdminButton>
                {form.published ? (
                  <a href={campaignUrl} target="_blank" rel="noopener noreferrer">
                    <AdminButton variant="outline">
                      <ExternalLink size={16} /> Open live page
                    </AdminButton>
                  </a>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <LandingPagePreview
            page={form}
            property={selectedProperty}
            testimonials={form.show_testimonials ? testimonials : []}
          />
        </div>
      </div>
    </AdminShell>
  );
}
