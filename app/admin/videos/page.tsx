"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Download, Play } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminToggle } from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";
import type { GalleryVideo } from "@/lib/supabase/types";
import { useWebsiteImport } from "@/lib/admin/useWebsiteImport";

const empty: Partial<GalleryVideo> = {
  youtube_id: "",
  title: "",
  sort_order: 0,
  published: true,
};

export default function AdminVideosPage() {
  const [items, setItems] = useState<GalleryVideo[]>([]);
  const [editing, setEditing] = useState<Partial<GalleryVideo> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("gallery_videos")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as GalleryVideo[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { importing, importMessage, runImport } = useWebsiteImport(
    "/api/admin/import-videos",
    "Import all videos from the public website? Existing items with the same ID will be updated."
  );

  const openNew = () => setEditing({ ...empty, sort_order: items.length + 1 });
  const openEdit = (item: GalleryVideo) => setEditing(item);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      youtube_id: editing.youtube_id,
      title: editing.title,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("gallery_videos").update(payload).eq("id", editing.id)
      : await supabase.from("gallery_videos").insert(payload);
    setSaving(false);
    if (!error) { setEditing(null); load(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this video?")) return;
    const supabase = createClient();
    await supabase.from("gallery_videos").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Video Gallery" subtitle="Manage YouTube videos on the video gallery page">
      {!editing ? (
        <>
          <div className="mb-6 flex flex-wrap justify-end gap-2">
            <AdminButton variant="secondary" loading={importing} onClick={() => runImport(load)}>
              <Download size={16} /> Import from website
            </AdminButton>
            <AdminButton onClick={openNew}><Plus size={16} /> Add Video</AdminButton>
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
              <p className="text-dark-500">No videos yet</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <AdminButton size="sm" variant="secondary" loading={importing} onClick={() => runImport(load)}>
                  <Download size={14} /> Import from website
                </AdminButton>
                <AdminButton size="sm" onClick={openNew}>Add first video</AdminButton>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm">
                  <div className="relative aspect-video bg-dark-900">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${item.youtube_id}`}
                      title={item.title}
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-primary-600">
                        <Play size={14} />
                        <span className="text-xs font-mono">{item.youtube_id}</span>
                      </div>
                      <h3 className="mt-1 truncate font-bold text-dark-900 font-montserrat">{item.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <AdminButton variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /></AdminButton>
                      <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold font-montserrat">{editing.id ? "Edit Video" : "New Video"}</h3>
          <AdminInput label="YouTube video ID" value={editing.youtube_id || ""} onChange={(e) => setEditing({ ...editing, youtube_id: e.target.value })} hint="The ID from youtube.com/watch?v=ID" />
          <AdminInput label="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
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
