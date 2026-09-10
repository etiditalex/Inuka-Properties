"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Copy,
  CopyPlus,
  ExternalLink,
  LayoutTemplate,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { createClient } from "@/lib/supabase/client";
import type { LandingPage } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { formatAdminDate } from "@/lib/admin/utils";
import { campaignLandingUrl, channelConfig } from "@/lib/landing-pages/urls";
import { LANDING_PAGE_TEMPLATES } from "@/lib/landing-pages/defaults";

const SETUP_SQL = `Run supabase/migrations/landing_pages.sql in the Supabase SQL Editor, then refresh this page.`;

function templateLabel(value: string) {
  return LANDING_PAGE_TEMPLATES.find((item) => item.value === value)?.label || value;
}

export default function AdminLandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [leadCounts, setLeadCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("landing_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const missing =
        error.message.toLowerCase().includes("landing_pages") ||
        error.code === "42P01" ||
        error.code === "PGRST205";
      setMissingTable(missing);
      setPages([]);
      setLoading(false);
      return;
    }

    setMissingTable(false);
    setPages((data as LandingPage[]) || []);

    const { data: leads } = await supabase
      .from("property_leads")
      .select("landing_page_id")
      .not("landing_page_id", "is", null);

    const counts: Record<number, number> = {};
    (leads || []).forEach((row: { landing_page_id?: number | null }) => {
      if (!row.landing_page_id) return;
      counts[row.landing_page_id] = (counts[row.landing_page_id] || 0) + 1;
    });
    setLeadCounts(counts);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this landing page? Leads already captured will be kept.")) return;
    const supabase = createClient();
    await supabase.from("landing_pages").delete().eq("id", id);
    load();
  };

  const copyUrl = async (page: LandingPage) => {
    await navigator.clipboard.writeText(
      campaignLandingUrl(page.slug, page.utm_campaign, page.channel)
    );
    setCopiedId(page.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminShell
      title="Landing Pages"
      subtitle="A library of converting pages you can keep adding to — Facebook now, Google, WhatsApp, or email later"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-dark-600">
          Each campaign gets its own page. Create one, duplicate it for the next ad, and paste the
          campaign URL into Ads Manager. Leads land in Lead Generation.
        </p>
        <Link href={adminPath("landing-pages/new")}>
          <AdminButton>
            <Plus size={16} /> Create landing page
          </AdminButton>
        </Link>
      </div>

      {missingTable ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-semibold">Database table not found</p>
          <p className="mt-2">{SETUP_SQL}</p>
        </div>
      ) : loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-white py-16 text-center">
          <LayoutTemplate className="mx-auto text-primary-500" size={36} />
          <p className="mt-4 text-lg font-semibold text-dark-900 font-montserrat">
            Create your first landing page
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-dark-500">
            This is a reusable builder. After this one, you can create as many others as you need —
            a new page per listing, ad, or channel.
          </p>
          <Link href={adminPath("landing-pages/new")} className="mt-6 inline-block">
            <AdminButton>
              <Plus size={16} /> Create landing page
            </AdminButton>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-dark-100 bg-dark-50/80 text-xs uppercase tracking-wide text-dark-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Page</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Channel</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Layout</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Leads</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const url = campaignLandingUrl(page.slug, page.utm_campaign, page.channel);
                return (
                  <tr key={page.id} className="border-b border-dark-50 last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-dark-900">{page.name}</p>
                      <p className="mt-0.5 text-xs text-dark-500">/lp/{page.slug}</p>
                      <p className="mt-0.5 text-[11px] text-dark-400">{formatAdminDate(page.updated_at)}</p>
                    </td>
                    <td className="hidden px-4 py-4 text-dark-600 md:table-cell">
                      {channelConfig(page.channel).label}
                    </td>
                    <td className="hidden px-4 py-4 text-dark-600 lg:table-cell">
                      {templateLabel(page.template)}
                    </td>
                    <td className="hidden px-4 py-4 font-semibold text-dark-800 lg:table-cell">
                      {leadCounts[page.id] || 0}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          page.published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-dark-100 text-dark-600"
                        }`}
                      >
                        {page.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <AdminButton variant="outline" size="sm" onClick={() => copyUrl(page)}>
                          <Copy size={14} />
                          {copiedId === page.id ? "Copied" : "Copy URL"}
                        </AdminButton>
                        <Link href={adminPath(`landing-pages/new?from=${page.id}`)}>
                          <AdminButton variant="outline" size="sm">
                            <CopyPlus size={14} /> Duplicate
                          </AdminButton>
                        </Link>
                        {page.published ? (
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <AdminButton variant="ghost" size="sm">
                              <ExternalLink size={14} />
                            </AdminButton>
                          </a>
                        ) : null}
                        <Link href={adminPath(`landing-pages/${page.id}`)}>
                          <AdminButton variant="ghost" size="sm">
                            <Pencil size={14} />
                          </AdminButton>
                        </Link>
                        <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(page.id)}>
                          <Trash2 size={14} className="text-red-600" />
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-dark-100 bg-dark-50/50 px-4 py-3 text-right">
            <Link href={adminPath("landing-pages/new")}>
              <AdminButton size="sm">
                <Plus size={14} /> Create another
              </AdminButton>
            </Link>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
