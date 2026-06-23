"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, FileText } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminToggle } from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";
import type { DownloadItem } from "@/lib/supabase/types";
import { useWebsiteImport } from "@/lib/admin/useWebsiteImport";

const empty: Partial<DownloadItem> = {
  title: "",
  file_url: "#",
  parent_id: null,
  sort_order: 0,
  published: true,
};

export default function AdminDownloadsPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [editing, setEditing] = useState<Partial<DownloadItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("download_items")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as DownloadItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { importing, importMessage, runImport } = useWebsiteImport(
    "/api/admin/import-downloads",
    "Import all download items from the public website? Existing items with the same ID will be updated."
  );

  const parents = useMemo(() => items.filter((i) => i.parent_id == null), [items]);

  const openNew = (parentId: number | null = null) => {
    const siblings = items.filter((i) => i.parent_id === parentId);
    setEditing({ ...empty, parent_id: parentId, sort_order: siblings.length + 1 });
  };

  const openEdit = (item: DownloadItem) => setEditing(item);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: editing.title,
      file_url: editing.file_url || "#",
      parent_id: editing.parent_id ?? null,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("download_items").update(payload).eq("id", editing.id)
      : await supabase.from("download_items").insert(payload);
    setSaving(false);
    if (!error) { setEditing(null); load(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this download item? Child items will also be removed.")) return;
    const supabase = createClient();
    await supabase.from("download_items").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Downloads" subtitle="Manage PDFs and property maps on the downloads page">
      {!editing ? (
        <>
          <div className="mb-6 flex flex-wrap justify-end gap-2">
            <AdminButton variant="secondary" loading={importing} onClick={() => runImport(load)}>
              <Download size={16} /> Import from website
            </AdminButton>
            <AdminButton onClick={() => openNew(null)}><Plus size={16} /> Add Top-Level Item</AdminButton>
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
          ) : (
            <div className="space-y-6">
              {parents.map((parent) => {
                const children = items.filter((i) => i.parent_id === parent.id);
                return (
                  <div key={parent.id} className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-1 shrink-0 text-primary-600" size={20} />
                        <div>
                          <h3 className="font-bold text-dark-900 font-montserrat">{parent.title}</h3>
                          <p className="text-xs text-dark-400 break-all">{parent.file_url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <AdminButton variant="outline" size="sm" onClick={() => openEdit(parent)}><Pencil size={14} /></AdminButton>
                        <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(parent.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                      </div>
                    </div>
                    {children.length > 0 && (
                      <ul className="mt-4 ml-8 space-y-2 border-l-2 border-primary-100 pl-4">
                        {children.map((child) => (
                          <li key={child.id} className="flex items-center justify-between gap-4 rounded-lg bg-dark-50/50 px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-dark-800">{child.title}</p>
                              <p className="text-xs text-dark-400 truncate">{child.file_url}</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <AdminButton variant="outline" size="sm" onClick={() => openEdit(child)}><Pencil size={12} /></AdminButton>
                              <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(child.id)}><Trash2 size={12} className="text-red-500" /></AdminButton>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 ml-8">
                      <AdminButton size="sm" variant="secondary" onClick={() => openNew(parent.id)}>
                        <Plus size={14} /> Add sub-item
                      </AdminButton>
                    </div>
                  </div>
                );
              })}
              {parents.length === 0 && (
                <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
                  <p className="text-dark-500">No download items yet</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <AdminButton size="sm" variant="secondary" loading={importing} onClick={() => runImport(load)}>
                      <Download size={14} /> Import from website
                    </AdminButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold font-montserrat">{editing.id ? "Edit Download" : "New Download"}</h3>
          <AdminInput label="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <AdminInput label="File URL" value={editing.file_url || ""} onChange={(e) => setEditing({ ...editing, file_url: e.target.value })} hint="Use # for coming soon, or /downloads/filename.pdf" />
          <AdminSelect
            label="Parent section (optional)"
            options={[
              { value: "", label: "Top-level item" },
              ...parents.filter((p) => p.id !== editing.id).map((p) => ({ value: String(p.id), label: p.title })),
            ]}
            value={editing.parent_id ? String(editing.parent_id) : ""}
            onChange={(e) => setEditing({ ...editing, parent_id: e.target.value ? Number(e.target.value) : null })}
          />
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
