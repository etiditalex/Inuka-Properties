"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Download, Mail, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";
import type { NewsletterIssue, NewsletterSubscriber } from "@/lib/supabase/types";
import { formatIsoDate, formatAdminDate } from "@/lib/admin/utils";
import { useWebsiteImport } from "@/lib/admin/useWebsiteImport";

const emptyIssue: Partial<NewsletterIssue> = {
  title: "",
  description: "",
  file_url: "",
  published_at: new Date().toISOString().split("T")[0],
  sort_order: 0,
  published: true,
};

export default function AdminNewslettersPage() {
  const [tab, setTab] = useState<"issues" | "subscribers">("issues");
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [editing, setEditing] = useState<Partial<NewsletterIssue> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const [{ data: issueData }, { data: subData }] = await Promise.all([
      supabase.from("newsletter_issues").select("*").order("published_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
    ]);
    setIssues((issueData as NewsletterIssue[]) || []);
    setSubscribers((subData as NewsletterSubscriber[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { importing, importMessage, runImport } = useWebsiteImport(
    "/api/admin/import-newsletters",
    "Import newsletter issues from the public website catalog? Existing items with the same ID will be updated."
  );

  const openNew = () => setEditing({ ...emptyIssue, sort_order: issues.length + 1 });
  const openEdit = (item: NewsletterIssue) => setEditing(item);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: editing.title,
      description: editing.description || null,
      file_url: editing.file_url || null,
      published_at: editing.published_at,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("newsletter_issues").update(payload).eq("id", editing.id)
      : await supabase.from("newsletter_issues").insert(payload);
    setSaving(false);
    if (!error) { setEditing(null); load(); }
  };

  const handleDeleteIssue = async (id: number) => {
    if (!confirm("Delete this newsletter issue?")) return;
    const supabase = createClient();
    await supabase.from("newsletter_issues").delete().eq("id", id);
    load();
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    const supabase = createClient();
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Newsletters" subtitle="Manage newsletter issues and view subscribers">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-xl border border-dark-200 bg-white p-1">
          <button
            type="button"
            onClick={() => { setTab("issues"); setEditing(null); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "issues" ? "bg-primary-600 text-white" : "text-dark-600 hover:bg-dark-50"}`}
          >
            <Mail size={16} /> Issues
          </button>
          <button
            type="button"
            onClick={() => { setTab("subscribers"); setEditing(null); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "subscribers" ? "bg-primary-600 text-white" : "text-dark-600 hover:bg-dark-50"}`}
          >
            <Users size={16} /> Subscribers ({subscribers.length})
          </button>
        </div>
        {tab === "issues" && !editing && (
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" loading={importing} onClick={() => runImport(load)}>
              <Download size={16} /> Import from website
            </AdminButton>
            <AdminButton onClick={openNew}><Plus size={16} /> Add Issue</AdminButton>
          </div>
        )}
      </div>

      {importMessage && tab === "issues" && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${importMessage.toLowerCase().includes("failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {importMessage}
        </div>
      )}

      {tab === "issues" && editing ? (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold font-montserrat">{editing.id ? "Edit Newsletter Issue" : "New Newsletter Issue"}</h3>
          <AdminInput label="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <AdminTextarea label="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
          <AdminInput label="PDF / file URL (optional)" value={editing.file_url || ""} onChange={(e) => setEditing({ ...editing, file_url: e.target.value })} />
          <AdminInput label="Published date" type="date" value={editing.published_at || ""} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} />
          <AdminInput label="Sort order" type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
          <AdminToggle label="Published" checked={editing.published ?? true} onChange={(v) => setEditing({ ...editing, published: v })} />
          <div className="flex gap-3">
            <AdminButton onClick={handleSave} loading={saving}>Save</AdminButton>
            <AdminButton variant="outline" onClick={() => setEditing(null)}>Cancel</AdminButton>
          </div>
        </div>
      ) : tab === "issues" ? (
        loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : issues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
            <p className="text-dark-500">No newsletter issues yet. Subscribers can still sign up on the public page.</p>
            <div className="mt-4">
              <AdminButton size="sm" onClick={openNew}>Add first issue</AdminButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-dark-200/60 bg-white p-4 shadow-sm">
                <div>
                  <h3 className="font-bold text-dark-900 font-montserrat">{item.title}</h3>
                  <p className="text-xs text-dark-400">{formatIsoDate(item.published_at)}</p>
                  {item.description && <p className="mt-1 text-sm text-dark-600 line-clamp-1">{item.description}</p>}
                </div>
                <div className="flex gap-2">
                  <AdminButton variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /></AdminButton>
                  <AdminButton variant="ghost" size="sm" onClick={() => handleDeleteIssue(item.id)}><Trash2 size={14} className="text-red-500" /></AdminButton>
                </div>
              </div>
            ))}
          </div>
        )
      ) : loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
          <p className="text-dark-500">No subscribers yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-dark-100 bg-dark-50/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-dark-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-dark-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-dark-700">Subscribed</th>
                <th className="px-4 py-3 text-right font-semibold text-dark-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-dark-50">
                  <td className="px-4 py-3 text-dark-900">{sub.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-dark-100 text-dark-500"}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-500">{formatAdminDate(sub.subscribed_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <AdminButton variant="ghost" size="sm" onClick={() => handleDeleteSubscriber(sub.id)}>
                      <Trash2 size={14} className="text-red-500" />
                    </AdminButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
