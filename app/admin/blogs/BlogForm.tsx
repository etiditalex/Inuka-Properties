"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/AdminForm";
import ImageUpload from "@/components/admin/ImageUpload";
import AdminButton from "@/components/admin/AdminButton";
import BlogPreview from "@/components/admin/preview/BlogPreview";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost, ContentStatus } from "@/lib/supabase/types";
import { slugify } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { MARKET_RESEARCH_CATEGORY } from "@/lib/market-research/catalog";
import { publishContentSignal } from "@/lib/notifications/publishClient";
import { Save } from "lucide-react";

const empty: Partial<BlogPost> = {
  title: "",
  excerpt: "",
  author: "IAPL Investment Team",
  published_at: new Date().toISOString().split("T")[0],
  image: "",
  category: "Investment",
  slug: "",
  content_html: "",
  status: "draft",
};

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

type BlogFormProps = {
  postId?: number;
  section?: "blog" | "market-research";
};

export default function BlogFormPage({ postId, section = "blog" }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const isResearch = section === "market-research";
  const listPath = isResearch ? "market-research" : "blogs";
  const publicPrefix = isResearch ? "/iapl-insider/market-research" : "/iapl-insider/blogs";
  const [form, setForm] = useState<Partial<BlogPost>>(() =>
    isResearch ? { ...empty, category: MARKET_RESEARCH_CATEGORY } : empty
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("blog_posts").select("*").eq("id", postId).single();
      if (data) setForm(data as BlogPost);
    }
    load();
  }, [postId]);

  const update = (key: keyof BlogPost, value: unknown) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !isEdit) {
        next.slug = slugify(value as string);
      }
      return next;
    });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...payload } = form;
    if (isResearch) payload.category = MARKET_RESEARCH_CATEGORY;
    const { error: saveError } = isEdit
      ? await supabase.from("blog_posts").update(payload).eq("id", postId!)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    if (payload.status === "published" && payload.slug && payload.title) {
      void publishContentSignal({
        kind: isResearch ? "market-research" : "blog",
        title: payload.title,
        summary: payload.excerpt,
        path: isResearch
          ? `/iapl-insider/market-research/${payload.slug}`
          : `/iapl-insider/blogs/${payload.slug}`,
      });
    }
    router.push(adminPath(listPath));
  };

  return (
    <AdminShell
      title={isEdit ? (isResearch ? "Edit Market Research" : "Edit Blog") : isResearch ? "New Market Research" : "New Blog"}
      subtitle={isResearch ? "This article appears on the Market Research page" : "Content will match the IAPL Insider blog layout"}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
          <AdminInput label="Title" value={form.title || ""} onChange={(e) => update("title", e.target.value)} />
          <AdminInput label="Slug" value={form.slug || ""} onChange={(e) => update("slug", e.target.value)} hint={`URL: ${publicPrefix}/[slug]`} />
          {isResearch ? (
            <AdminInput label="Category" value={MARKET_RESEARCH_CATEGORY} readOnly onChange={() => undefined} />
          ) : (
            <AdminInput label="Category" value={form.category || ""} onChange={(e) => update("category", e.target.value)} />
          )}
          <AdminInput label="Author" value={form.author || ""} onChange={(e) => update("author", e.target.value)} />
          <AdminInput label="Published Date" type="date" value={form.published_at || ""} onChange={(e) => update("published_at", e.target.value)} />
          <AdminInput label="Hero Image URL" value={form.image || ""} onChange={(e) => update("image", e.target.value)} />
          <ImageUpload label="Or upload hero image" value={form.image || ""} onChange={(url) => update("image", url)} folder="blogs" />
          <AdminTextarea label="Excerpt" value={form.excerpt || ""} onChange={(e) => update("excerpt", e.target.value)} rows={3} />
          <AdminTextarea
            label="Article Content (HTML)"
            value={form.content_html || ""}
            onChange={(e) => update("content_html", e.target.value)}
            rows={12}
            hint="Leave a blank line between paragraphs. A short line on its own becomes a heading. You can still use HTML."
          />
          <AdminSelect label="Status" options={statusOptions} value={form.status || "draft"} onChange={(e) => update("status", e.target.value as ContentStatus)} />
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="flex gap-3">
            <AdminButton onClick={handleSave} loading={saving}><Save size={16} /> {isResearch ? "Save Article" : "Save Blog"}</AdminButton>
            <AdminButton variant="outline" onClick={() => router.back()}>Cancel</AdminButton>
          </div>
        </div>
        <BlogPreview post={form} />
      </div>
    </AdminShell>
  );
}
