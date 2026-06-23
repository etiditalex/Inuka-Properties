"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea, AdminSelect, AdminToggle } from "@/components/admin/AdminForm";
import ImageUpload from "@/components/admin/ImageUpload";
import NewsPreview from "@/components/admin/preview/NewsPreview";
import { createClient } from "@/lib/supabase/client";
import type { NewsItem, ContentStatus } from "@/lib/supabase/types";
import { formatIsoDate } from "@/lib/admin/utils";
import { useWebsiteImport } from "@/lib/admin/useWebsiteImport";

const empty: Partial<NewsItem> = {
  title: "",
  excerpt: "",
  published_at: new Date().toISOString().split("T")[0],
  category: "Company News",
  image: "",
  featured: false,
  details: [],
  status: "published",
};

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [detailsText, setDetailsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("news_items").select("*").order("published_at", { ascending: false });
    setItems((data as NewsItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { importing, importMessage, runImport } = useWebsiteImport(
    "/api/admin/import-news",
    "Import all news updates from the public website? Existing items with the same ID will be updated."
  );

  const openNew = () => {
    setEditing({ ...empty });
    setDetailsText("");
  };

  const openEdit = (item: NewsItem) => {
    setEditing(item);
    setDetailsText(item.details.join("\n"));
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...editing,
      details: detailsText.split("\n").map((d) => d.trim()).filter(Boolean),
    };
    const { error } = editing.id
      ? await supabase.from("news_items").update(payload).eq("id", editing.id)
      : await supabase.from("news_items").insert(payload);
    setSaving(false);
    if (!error) { setEditing(null); load(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news item?")) return;
    const supabase = createClient();
    await supabase.from("news_items").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="News Update" subtitle="Manage IAPL Insider news — matches frontend layout">
      {!editing ? (
        <>
          <div className="mb-6 flex flex-wrap justify-end gap-2">
            <AdminButton variant="secondary" loading={importing} onClick={() => runImport(load)}>
              <Download size={16} /> Import from website
            </AdminButton>
            <AdminButton onClick={openNew}><Plus size={16} /> Add News</AdminButton>
          </div>
          {importMessage && (
            <div
              className={`mb-6 rounded-xl px-4 py-3 text-sm ${importMessage.toLowerCase().includes("failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
            >
              {importMessage}
            </div>
          )}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-dark-200/60 bg-white p-4 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-bold text-white">{item.category}</span>
                      {item.featured && <span className="rounded-full bg-secondary-500 px-2 py-0.5 text-[10px] font-bold text-white">FEATURED</span>}
                    </div>
                    <h3 className="mt-1 font-bold text-dark-900 font-montserrat">{item.title}</h3>
                    <p className="text-xs text-dark-400">{formatIsoDate(item.published_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <AdminButton variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /></AdminButton>
                    <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold font-montserrat">{editing.id ? "Edit News" : "New News"}</h3>
            <AdminInput label="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <AdminInput label="Category" value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            <AdminInput label="Date" type="date" value={editing.published_at || ""} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} />
            <AdminInput label="Image URL" value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            <ImageUpload label="Or upload image" value={editing.image || ""} onChange={(url) => setEditing({ ...editing, image: url })} folder="news" />
            <AdminTextarea label="Excerpt" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={3} />
            <AdminTextarea label="Details (one per line)" value={detailsText} onChange={(e) => setDetailsText(e.target.value)} rows={5} />
            <AdminToggle label="Featured" checked={editing.featured ?? false} onChange={(v) => setEditing({ ...editing, featured: v })} />
            <AdminSelect
              label="Status"
              options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]}
              value={editing.status || "published"}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as ContentStatus })}
            />
            <div className="flex gap-3">
              <AdminButton onClick={handleSave} loading={saving}>Save</AdminButton>
              <AdminButton variant="outline" onClick={() => setEditing(null)}>Cancel</AdminButton>
            </div>
          </div>
          <NewsPreview item={{ ...editing, details: detailsText.split("\n").filter(Boolean) }} />
        </div>
      )}
    </AdminShell>
  );
}
