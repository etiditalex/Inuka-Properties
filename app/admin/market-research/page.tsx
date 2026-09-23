"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/AdminForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { BlogPost, MarketResearchInsight } from "@/lib/supabase/types";
import { formatIsoDate } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { isMarketResearchPost } from "@/lib/market-research/catalog";

const iconOptions = [
  { value: "TrendingUp", label: "Trending Up" },
  { value: "MapPin", label: "Map Pin" },
  { value: "BarChart3", label: "Bar Chart" },
];

export default function AdminMarketResearchPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [insights, setInsights] = useState<MarketResearchInsight[]>([]);
  const [tab, setTab] = useState<"posts" | "insights">("posts");
  const [editingInsight, setEditingInsight] = useState<Partial<MarketResearchInsight> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const [{ data: blogRows }, { data: insightRows }] = await Promise.all([
      supabase.from("blog_posts").select("*").order("published_at", { ascending: false }),
      supabase.from("market_research_insights").select("*").order("sort_order"),
    ]);
    setPosts(((blogRows as BlogPost[]) || []).filter((post) => isMarketResearchPost(post.category)));
    setInsights((insightRows as MarketResearchInsight[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deletePost = async (id: number) => {
    if (!confirm("Delete this market research article?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  const saveInsight = async () => {
    if (!editingInsight) return;
    const supabase = createClient();
    if (editingInsight.id) {
      await supabase.from("market_research_insights").update(editingInsight).eq("id", editingInsight.id);
    } else {
      await supabase.from("market_research_insights").insert(editingInsight);
    }
    setEditingInsight(null);
    load();
  };

  const deleteInsight = async (id: number) => {
    if (!confirm("Delete insight?")) return;
    const supabase = createClient();
    await supabase.from("market_research_insights").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Market Research" subtitle="Write articles the same way as blog posts">
      <div className="mb-6 flex flex-wrap justify-end gap-2">
        <Link href={adminPath("market-research/new")}>
          <AdminButton>
            <Plus size={16} /> New Article
          </AdminButton>
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <AdminButton variant={tab === "posts" ? "primary" : "outline"} size="sm" onClick={() => setTab("posts")}>
          Articles
        </AdminButton>
        <AdminButton variant={tab === "insights" ? "primary" : "outline"} size="sm" onClick={() => setTab("insights")}>
          Insights
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : tab === "posts" ? (
        posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
            <p className="text-dark-500">No market research articles yet</p>
            <Link href={adminPath("market-research/new")} className="mt-4 inline-block">
              <AdminButton size="sm">Create first article</AdminButton>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm">
                <div className="relative h-40 bg-neutral-100">
                  {post.image ? (
                    <Image src={post.image} alt={post.title} fill className="object-cover" unoptimized />
                  ) : null}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      post.status === "published" ? "bg-emerald-500 text-white" : "bg-dark-500 text-white"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-bold text-dark-900 font-montserrat">{post.title}</h3>
                  <p className="mt-1 text-xs text-dark-400">
                    {formatIsoDate(post.published_at)} · {post.author}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link href={adminPath(`market-research/${post.id}`)} className="flex-1">
                      <AdminButton variant="outline" size="sm" className="w-full">
                        <Pencil size={14} /> Edit
                      </AdminButton>
                    </Link>
                    <AdminButton variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                      <Trash2 size={14} className="text-red-500" />
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <AdminButton
            size="sm"
            onClick={() =>
              setEditingInsight({ icon: "TrendingUp", title: "", value: "", description: "", sort_order: insights.length })
            }
          >
            <Plus size={14} /> Add Insight
          </AdminButton>
          {editingInsight && (
            <div className="space-y-4 rounded-2xl border border-dark-200 bg-white p-6">
              <AdminSelect
                label="Icon"
                options={iconOptions}
                value={editingInsight.icon || "TrendingUp"}
                onChange={(e) => setEditingInsight({ ...editingInsight, icon: e.target.value })}
              />
              <AdminInput
                label="Title"
                value={editingInsight.title || ""}
                onChange={(e) => setEditingInsight({ ...editingInsight, title: e.target.value })}
              />
              <AdminInput
                label="Value"
                value={editingInsight.value || ""}
                onChange={(e) => setEditingInsight({ ...editingInsight, value: e.target.value })}
                placeholder="15%"
              />
              <AdminTextarea
                label="Description"
                value={editingInsight.description || ""}
                onChange={(e) => setEditingInsight({ ...editingInsight, description: e.target.value })}
                rows={2}
              />
              <div className="flex gap-2">
                <AdminButton size="sm" onClick={saveInsight}>
                  Save
                </AdminButton>
                <AdminButton size="sm" variant="outline" onClick={() => setEditingInsight(null)}>
                  Cancel
                </AdminButton>
              </div>
            </div>
          )}
          {insights.map((insight) => (
            <div key={insight.id} className="flex items-center justify-between rounded-xl border border-dark-200 bg-white p-4">
              <div>
                <span className="text-2xl font-bold text-primary-700">{insight.value}</span>
                <h4 className="font-bold text-dark-900">{insight.title}</h4>
                <p className="text-xs text-dark-500">{insight.description}</p>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="outline" size="sm" onClick={() => setEditingInsight(insight)}>
                  <Pencil size={14} />
                </AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => deleteInsight(insight.id)}>
                  <Trash2 size={14} className="text-red-500" />
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
