"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Download, Star } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import ImageUpload from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import type { ClientTestimonial } from "@/lib/supabase/types";
import { useWebsiteImport } from "@/lib/admin/useWebsiteImport";

const empty: Partial<ClientTestimonial> = {
  name: "",
  location: "",
  property: "",
  rating: 5,
  text: "",
  image: "",
  sort_order: 0,
  published: true,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<ClientTestimonial[]>([]);
  const [editing, setEditing] = useState<Partial<ClientTestimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("client_testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as ClientTestimonial[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { importing, importMessage, runImport } = useWebsiteImport(
    "/api/admin/import-testimonials",
    "Import all client testimonials from the public website? Existing items with the same ID will be updated."
  );

  const openNew = () => setEditing({ ...empty, sort_order: items.length + 1 });

  const openEdit = (item: ClientTestimonial) => setEditing(item);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: editing.name,
      location: editing.location,
      property: editing.property,
      rating: Number(editing.rating) || 5,
      text: editing.text,
      image: editing.image,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("client_testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("client_testimonials").insert(payload);
    setSaving(false);
    if (!error) { setEditing(null); load(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const supabase = createClient();
    await supabase.from("client_testimonials").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Client Testimonials" subtitle="Manage testimonials shown on the public site">
      {!editing ? (
        <>
          <div className="mb-6 flex flex-wrap justify-end gap-2">
            <AdminButton variant="secondary" loading={importing} onClick={() => runImport(load)}>
              <Download size={16} /> Import from website
            </AdminButton>
            <AdminButton onClick={openNew}><Plus size={16} /> Add Testimonial</AdminButton>
          </div>
          {importMessage && (
            <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${importMessage.toLowerCase().includes("failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {importMessage}
            </div>
          )}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
              <p className="text-dark-500">No testimonials yet</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <AdminButton size="sm" variant="secondary" loading={importing} onClick={() => runImport(load)}>
                  <Download size={14} /> Import from website
                </AdminButton>
                <AdminButton size="sm" onClick={openNew}>Add first testimonial</AdminButton>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-dark-200/60 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <h3 className="mt-1 font-bold text-dark-900 font-montserrat">{item.name}</h3>
                      <p className="text-xs text-dark-500">{item.property} • {item.location}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-dark-600 italic">&ldquo;{item.text}&rdquo;</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <AdminButton variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /></AdminButton>
                    <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold font-montserrat">{editing.id ? "Edit Testimonial" : "New Testimonial"}</h3>
          <AdminInput label="Name" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <AdminInput label="Location" value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
          <AdminInput label="Property" value={editing.property || ""} onChange={(e) => setEditing({ ...editing, property: e.target.value })} />
          <AdminInput label="Rating (1-5)" type="number" min={1} max={5} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
          <AdminInput label="Image URL" value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
          <ImageUpload label="Or upload photo" value={editing.image || ""} onChange={(url) => setEditing({ ...editing, image: url })} folder="testimonials" />
          <AdminTextarea label="Testimonial text" value={editing.text || ""} onChange={(e) => setEditing({ ...editing, text: e.target.value })} rows={4} />
          <AdminInput label="Sort order" type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
          <AdminToggle label="Published" checked={editing.published ?? true} onChange={(v) => setEditing({ ...editing, published: v })} />
          <div className="flex gap-3">
            <AdminButton onClick={handleSave} loading={saving}>Save</AdminButton>
            <AdminButton variant="outline" onClick={() => setEditing(null)}>Cancel</AdminButton>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
