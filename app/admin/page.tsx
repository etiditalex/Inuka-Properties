"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowRight,
  ArrowUp,
  Building2,
  Newspaper,
  Hammer,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import type { DashboardStats, Inquiry, PropertyLead } from "@/lib/supabase/types";
import { formatAdminDate } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { uniquePropertyLeads } from "@/lib/leads/dedupe";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    properties: 0,
    availableProperties: 0,
    soldProperties: 0,
    ongoingProperties: 0,
    blogs: 0,
    news: 0,
    newInquiries: 0,
    newLeads: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentLeads, setRecentLeads] = useState<PropertyLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [
        { count: properties },
        { count: available },
        { count: sold },
        { count: ongoing },
        { count: blogs },
        { count: news },
        { count: newInq },
        { data: newLeadRows },
        { data: inquiries },
        { data: leads },
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "available"),
        supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "sold"),
        supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "ongoing"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("news_items").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("property_leads").select("id, email, phone, status, created_at").eq("status", "new"),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("property_leads").select("*").order("created_at", { ascending: false }).limit(50),
      ]);

      setStats({
        properties: properties || 0,
        availableProperties: available || 0,
        soldProperties: sold || 0,
        ongoingProperties: ongoing || 0,
        blogs: blogs || 0,
        news: news || 0,
        newInquiries: newInq || 0,
        newLeads: uniquePropertyLeads(newLeadRows || []).length,
      });
      setRecentInquiries((inquiries as Inquiry[]) || []);
      setRecentLeads(uniquePropertyLeads((leads as PropertyLead[]) || []).slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  const quickActions = [
    { href: adminPath("properties/new"), label: "Add Property", icon: MapPin, color: "from-primary-500 to-primary-700" },
    { href: adminPath("blogs/new"), label: "Write Blog", icon: FileText, color: "from-primary-700 to-primary-900" },
    { href: adminPath("inquiries"), label: "View Inquiries", icon: MessageSquare, color: "from-secondary-500 to-secondary-700" },
    { href: adminPath("leads"), label: "Manage Leads", icon: Users, color: "from-secondary-600 to-secondary-800" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="property overview">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Available Listings", value: stats.availableProperties, icon: MapPin, tone: "bg-primary-600" },
              { title: "Ongoing Projects", value: stats.ongoingProperties || 0, icon: Hammer, tone: "bg-primary-800" },
              { title: "Sold Properties", value: stats.soldProperties, icon: TrendingUp, tone: "bg-secondary-600" },
              { title: "Total Properties", value: stats.properties, icon: Building2, tone: "bg-secondary-500" },
              { title: "New Leads", value: stats.newLeads, icon: Users, tone: "bg-primary-600" },
              { title: "New Inquiries", value: stats.newInquiries, icon: MessageSquare, tone: "bg-primary-800" },
              { title: "Blog Posts", value: stats.blogs, icon: FileText, tone: "bg-secondary-600" },
              { title: "News Updates", value: stats.news, icon: Newspaper, tone: "bg-secondary-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`flex items-center gap-4 px-5 py-6 text-white ${item.tone}`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Icon size={26} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat text-3xl font-bold leading-none">{item.value}</span>
                      <ArrowUp size={16} className="text-white/90" />
                    </div>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                      {item.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 rounded-2xl border border-dark-200/60 bg-white p-4 shadow-sm transition hover:border-primary-300 hover:shadow-md"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-dark-800 font-montserrat">
                      {action.label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-dark-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Recent activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-dark-900 font-montserrat">Recent Inquiries</h3>
                <Link href={adminPath("inquiries")} className="text-xs font-medium text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              {recentInquiries.length === 0 ? (
                <p className="py-8 text-center text-sm text-dark-400">No inquiries yet</p>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="flex items-start justify-between rounded-xl border border-dark-100 bg-dark-50/50 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-dark-900">{inq.name}</p>
                        <p className="text-xs text-dark-500">{inq.subject || inq.email}</p>
                      </div>
                      <span className="text-[10px] text-dark-400">{formatAdminDate(inq.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-dark-900 font-montserrat">Recent Leads</h3>
                <Link href={adminPath("leads")} className="text-xs font-medium text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              {recentLeads.length === 0 ? (
                <p className="py-8 text-center text-sm text-dark-400">No leads yet</p>
              ) : (
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-start justify-between rounded-xl border border-dark-100 bg-dark-50/50 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-dark-900">{lead.name}</p>
                        <p className="text-xs text-dark-500">
                          {lead.property_name || "General inquiry"} · {lead.phone}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          lead.status === "new"
                            ? "bg-secondary-100 text-secondary-800"
                            : "bg-dark-100 text-dark-600"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
