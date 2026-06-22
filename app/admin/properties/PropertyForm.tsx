"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminInput, AdminTextarea, AdminSelect, AdminToggle } from "@/components/admin/AdminForm";
import ImageUpload from "@/components/admin/ImageUpload";
import AdminButton from "@/components/admin/AdminButton";
import PropertyPreview from "@/components/admin/preview/PropertyPreview";
import { createClient } from "@/lib/supabase/client";
import type { Property, PropertyStatus } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { Save } from "lucide-react";

const emptyProperty: Partial<Property> = {
  title: "",
  location: "",
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
  quick_info: {},
};

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!propertyId) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", propertyId).single();
      if (data) {
        setForm(data as Property);
        setFeaturesText((data.features as string[]).join("\n"));
      }
    }
    load();
  }, [propertyId]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createClient();

    const payload = {
      ...form,
      features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      gallery: form.gallery || [],
      pricing: form.pricing || {},
      quick_info: form.quick_info || {},
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
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect label="Type" options={typeOptions} value={form.type || "residential"} onChange={(e) => update("type", e.target.value)} />
            <AdminSelect label="Status" options={statusOptions} value={form.status || "available"} onChange={(e) => update("status", e.target.value as PropertyStatus)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="Price" value={form.price || ""} onChange={(e) => update("price", e.target.value)} placeholder="KES 450,000" />
            <AdminInput label="Size" value={form.size || ""} onChange={(e) => update("size", e.target.value)} placeholder="1/8 Acre" />
          </div>
          <AdminInput label="Hero Image URL" value={form.image || ""} onChange={(e) => update("image", e.target.value)} />
          <ImageUpload label="Or upload hero image" value={form.image || ""} onChange={(url) => update("image", url)} folder="properties" />
          <AdminTextarea label="Description" value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={4} />
          <AdminTextarea
            label="Features (one per line)"
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={5}
            hint="Each line becomes a bullet point on the listing"
          />

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
          <PropertyPreview property={form} />
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
