"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminInput, AdminTextarea, AdminSelect, AdminToggle } from "@/components/admin/AdminForm";
import GalleryUpload from "@/components/admin/GalleryUpload";
import PropertyMapFields from "@/components/admin/PropertyMapFields";
import AdminButton from "@/components/admin/AdminButton";
import PropertyPreview from "@/components/admin/preview/PropertyPreview";
import { createClient } from "@/lib/supabase/client";
import type { Property, PropertyStatus } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { parseGalleryUrls } from "@/lib/images";
import { Save } from "lucide-react";

const emptyProperty: Partial<Property> = {
  title: "",
  location: "",
  map_link: "",
  type: "residential",
  price: "",
  size: "",
  image: "",
  gallery: [],
  status: "available",
  featured: false,
  features: [],
  description: "",
  total_units: 0,
  sold_units: 0,
  auto_sold_out: true,
  published: true,
  pricing: {},
  payment_plan: {},
  quick_info: {},
};

function parseRecordField(
  value: Record<string, string> | string | null | undefined
): Record<string, string> {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return {};
  }
}

function recordToLines(record: Record<string, string>) {
  return Object.entries(record)
    .map(([key, val]) => `${key}|${val}`)
    .join("\n");
}

function linesToRecord(text: string) {
  const result: Record<string, string> = {};
  text.split("\n").forEach((line) => {
    const pipe = line.indexOf("|");
    if (pipe === -1) return;
    const key = line.slice(0, pipe).trim();
    const value = line.slice(pipe + 1).trim();
    if (key && value) result[key] = value;
  });
  return result;
}

function paymentPlanFromForm(fields: {
  totalPrice: string;
  deposit: string;
  balance: string;
  installments: string;
  monthlyPayment: string;
}) {
  const plan: Record<string, string> = {};
  if (fields.totalPrice.trim()) plan["Total Price"] = fields.totalPrice.trim();
  if (fields.deposit.trim()) plan.Deposit = fields.deposit.trim();
  if (fields.balance.trim()) plan.Balance = fields.balance.trim();
  if (fields.installments.trim()) plan.Installments = fields.installments.trim();
  if (fields.monthlyPayment.trim()) plan["Monthly Payment"] = fields.monthlyPayment.trim();
  return plan;
}

function formFromPaymentPlan(plan: Record<string, string>) {
  return {
    totalPrice: plan["Total Price"] ?? "",
    deposit: plan.Deposit ?? plan.deposit ?? "",
    balance: plan.Balance ?? plan["Remaining Balance"] ?? "",
    installments: plan.Installments ?? plan["Monthly Installments"] ?? "",
    monthlyPayment: plan["Monthly Payment"] ?? "",
  };
}

function resolveGallery(form: Partial<Property>) {
  return parseGalleryUrls(form.gallery, form.image);
}

const typeOptions = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "beach", label: "Beach" },
  { value: "farm", label: "Farm" },
  { value: "affordable", label: "Affordable" },
];

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "ongoing", label: "Ongoing" },
  { value: "sold", label: "Sold Out" },
];

type PropertyFormPageProps = {
  propertyId?: number;
};

export default function PropertyFormPage({ propertyId }: PropertyFormPageProps) {
  const router = useRouter();
  const isEdit = Boolean(propertyId);
  const [form, setForm] = useState<Partial<Property>>(emptyProperty);
  const [featuresText, setFeaturesText] = useState("");
  const [pricingText, setPricingText] = useState("");
  const [quickInfoText, setQuickInfoText] = useState("");
  const [paymentFields, setPaymentFields] = useState({
    totalPrice: "",
    deposit: "",
    balance: "",
    installments: "",
    monthlyPayment: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!propertyId) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", propertyId).single();
      if (data) {
        const property = data as Property;
        const gallery = parseGalleryUrls(property.gallery, property.image);
        setForm({ ...property, gallery, image: gallery[0] ?? property.image });
        setFeaturesText((property.features as string[]).join("\n"));
        setPricingText(recordToLines(parseRecordField(property.pricing)));
        setQuickInfoText(recordToLines(parseRecordField(property.quick_info)));
        setPaymentFields(formFromPaymentPlan(parseRecordField(property.payment_plan)));
      }
    }
    load();
  }, [propertyId]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createClient();

    const gallery = resolveGallery(form).map((u) => u.trim()).filter(Boolean);

    const payload = {
      ...form,
      image: gallery[0] || form.image || "",
      features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      gallery,
      map_link: form.map_link?.trim() || null,
      pricing: linesToRecord(pricingText),
      payment_plan: paymentPlanFromForm(paymentFields),
      quick_info: linesToRecord(quickInfoText),
    };

    const { error: saveError } = isEdit
      ? await supabase.from("properties").update(payload).eq("id", propertyId!)
      : await supabase.from("properties").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push(adminPath("properties"));
  };

  const update = (key: keyof Property, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const galleryImages = resolveGallery(form);

  const updateGallery = (urls: string[]) => {
    setForm((f) => ({
      ...f,
      gallery: urls,
      image: urls[0] || "",
    }));
  };

  return (
    <AdminShell
      title={isEdit ? "Edit Property" : "Add Property"}
      subtitle="Configure listing details — sold out status updates automatically"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-dark-900 font-montserrat">Property Details</h3>

          <AdminInput label="Title" value={form.title || ""} onChange={(e) => update("title", e.target.value)} required />
          <AdminInput label="Location" value={form.location || ""} onChange={(e) => update("location", e.target.value)} required />
          <PropertyMapFields
            location={form.location || ""}
            mapLink={form.map_link || ""}
            onChange={(mapLink) => update("map_link", mapLink)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect label="Type" options={typeOptions} value={form.type || "residential"} onChange={(e) => update("type", e.target.value)} />
            <AdminSelect label="Status" options={statusOptions} value={form.status || "available"} onChange={(e) => update("status", e.target.value as PropertyStatus)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Price" value={form.price || ""} onChange={(e) => update("price", e.target.value)} placeholder="KES 450,000" />
            <AdminInput label="Size" value={form.size || ""} onChange={(e) => update("size", e.target.value)} placeholder="1/8 Acre" />
          </div>
          <GalleryUpload
            label="Property images"
            value={galleryImages}
            onChange={updateGallery}
            folder="properties"
            hint="First image is the cover on listings. Select multiple images at once when uploading. New listings go live immediately when Published is on."
          />
          <AdminTextarea label="Description" value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={4} />
          <AdminTextarea
            label="Features (one per line)"
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={5}
            hint="Each line becomes a bullet point on the listing"
          />

          <div className="space-y-4 rounded-xl border border-primary-100 bg-primary-50/40 p-4">
            <h4 className="font-bold text-dark-900 font-montserrat">Pricing & Payment</h4>
            <AdminTextarea
              label="Sizes & pricing (one per line)"
              value={pricingText}
              onChange={(e) => setPricingText(e.target.value)}
              rows={3}
              hint="Format: 1/8 Acre|KES 450,000"
              placeholder={"1/8 Acre|KES 450,000\n1/4 Acre|KES 950,000"}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="Total price"
                value={paymentFields.totalPrice}
                onChange={(e) => setPaymentFields((f) => ({ ...f, totalPrice: e.target.value }))}
                placeholder="KES 450,000"
              />
              <AdminInput
                label="Deposit"
                value={paymentFields.deposit}
                onChange={(e) => setPaymentFields((f) => ({ ...f, deposit: e.target.value }))}
                placeholder="KES 150,000"
              />
              <AdminInput
                label="Balance"
                value={paymentFields.balance}
                onChange={(e) => setPaymentFields((f) => ({ ...f, balance: e.target.value }))}
                placeholder="KES 300,000"
              />
              <AdminInput
                label="Installments"
                value={paymentFields.installments}
                onChange={(e) => setPaymentFields((f) => ({ ...f, installments: e.target.value }))}
                placeholder="12 months"
              />
              <AdminInput
                label="Monthly payment"
                value={paymentFields.monthlyPayment}
                onChange={(e) => setPaymentFields((f) => ({ ...f, monthlyPayment: e.target.value }))}
                placeholder="KES 25,000"
              />
            </div>
            <AdminTextarea
              label="Quick information (one per line)"
              value={quickInfoText}
              onChange={(e) => setQuickInfoText(e.target.value)}
              rows={4}
              hint="Format: Deposit|KES 150,000"
              placeholder={"Deposit|KES 150,000\nPayment Plan|12 monthly installments"}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="Total Units"
              type="number"
              value={form.total_units ?? 0}
              onChange={(e) => update("total_units", parseInt(e.target.value) || 0)}
              hint="Set to enable auto sold-out"
            />
            <AdminInput
              label="Sold Units"
              type="number"
              value={form.sold_units ?? 0}
              onChange={(e) => update("sold_units", parseInt(e.target.value) || 0)}
            />
          </div>

          <AdminToggle
            label="Auto mark as Sold Out"
            checked={form.auto_sold_out ?? true}
            onChange={(v) => update("auto_sold_out", v)}
            description="Automatically sets status to 'sold' when sold units reach total units"
          />
          <AdminToggle label="Featured Listing" checked={form.featured ?? false} onChange={(v) => update("featured", v)} />
          <AdminToggle label="Published" checked={form.published ?? true} onChange={(v) => update("published", v)} />

          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="flex gap-3">
            <AdminButton onClick={handleSave} loading={saving}><Save size={16} /> Save Property</AdminButton>
            <AdminButton variant="outline" onClick={() => router.back()}>Cancel</AdminButton>
          </div>
        </div>

        <div className="space-y-4">
          <PropertyPreview
            property={{
              ...form,
              image: galleryImages[0] || form.image || "",
              gallery: galleryImages,
              payment_plan: paymentPlanFromForm(paymentFields),
              pricing: linesToRecord(pricingText),
              quick_info: linesToRecord(quickInfoText),
            }}
          />
          {form.auto_sold_out && form.total_units && form.total_units > 0 && (
            <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-800">
              <strong>Auto Sold Out:</strong> When sold units reach {form.total_units}, this property
              will automatically be marked as &quot;sold&quot;.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
