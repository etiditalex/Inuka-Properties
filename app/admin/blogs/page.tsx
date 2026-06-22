"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";
import { formatIsoDate } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog post?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Blogs" subtitle="Manage IAPL Insider blog articles">
      <div className="mb-6 flex justify-end">
        <Link href={adminPath("blogs/new")}>
          <AdminButton><Plus size={16} /> New Blog Post</AdminButton>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
          <p className="text-dark-500">No blog posts yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="group overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative h-40">
                <Image src={post.image} alt={post.title} fill className="object-cover" unoptimized />
                <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${post.status === "published" ? "bg-emerald-500 text-white" : "bg-dark-500 text-white"}`}>
                  {post.status}
                </span>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-primary-600">{post.category}</span>
                <h3 className="mt-1 font-bold text-dark-900 line-clamp-2 font-montserrat">{post.title}</h3>
                <p className="mt-1 text-xs text-dark-400">{formatIsoDate(post.published_at)} · {post.author}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={adminPath(`blogs/${post.id}`)} className="flex-1">
                    <AdminButton variant="outline" size="sm" className="w-full"><Pencil size={14} /> Edit</AdminButton>
                  </Link>
                  <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 size={14} className="text-red-500" />
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
