"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, CheckCircle, XCircle, FileSpreadsheet, FileText } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminTextarea } from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";
import type { PropertyLead, LeadStatus } from "@/lib/supabase/types";
import { formatAdminDate, cn } from "@/lib/admin/utils";
import { exportLeadsToExcel, exportLeadsToPdf } from "@/lib/admin/leads-export";

const statusOptions: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-secondary-100 text-secondary-800",
  contacted: "bg-primary-100 text-primary-800",
  qualified: "bg-violet-100 text-violet-800",
  converted: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<PropertyLead[]>([]);
  const [selected, setSelected] = useState<PropertyLead | null>(null);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    let query = supabase.from("property_leads").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setLeads((data as PropertyLead[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const supabase = createClient();
    await supabase.from("property_leads").update({ status, notes }).eq("id", id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status, notes });
  };

  return (
    <AdminShell title="Lead Generation" subtitle="Property interest leads — converting marks units sold">
      <div className="mb-4 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-800">
        <strong>Auto Sold Out:</strong> When you mark a lead as &quot;Converted&quot;, the linked property&apos;s
        sold unit count increases by 1. If auto sold-out is enabled and all units are sold, the property is
        automatically marked as sold.
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", ...statusOptions] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
                filter === s ? "bg-primary-600 text-white" : "bg-dark-100 text-dark-600 hover:bg-dark-200"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton
            variant="secondary"
            onClick={() => exportLeadsToExcel(leads)}
            disabled={loading || leads.length === 0}
          >
            <FileSpreadsheet size={16} /> Download Excel
          </AdminButton>
          <AdminButton
            variant="secondary"
            onClick={() => exportLeadsToPdf(leads, filter)}
            disabled={loading || leads.length === 0}
          >
            <FileText size={16} /> Download PDF
          </AdminButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : leads.length === 0 ? (
            <p className="py-12 text-center text-sm text-dark-400">No leads yet</p>
          ) : (
            leads.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => { setSelected(lead); setNotes(lead.notes || ""); }}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition",
                  selected?.id === lead.id
                    ? "border-primary-300 bg-primary-50"
                    : "border-dark-200 bg-white hover:border-primary-200"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-dark-900">{lead.name}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", statusStyles[lead.status])}>
                    {lead.status}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-primary-700">
                  <MapPin size={12} /> {lead.property_name || "General"}
                </p>
                {lead.source && (
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-dark-500">
                    Source: {lead.source.replace(/_/g, " ")}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-dark-400">{formatAdminDate(lead.created_at)}</p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-2xl border border-dark-200/60 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-dark-900 font-montserrat">{selected.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-primary-700">
                    <MapPin size={14} /> {selected.property_name || "No property specified"}
                  </p>
                  {selected.source && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-dark-500">
                      Source: {selected.source.replace(/_/g, " ")}
                    </p>
                  )}
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase", statusStyles[selected.status])}>
                  {selected.status}
                </span>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl bg-dark-50 p-3 text-sm">
                  <Mail size={16} className="text-primary-600" /> {selected.email}
                </a>
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 rounded-xl bg-dark-50 p-3 text-sm">
                  <Phone size={16} className="text-primary-600" /> {selected.phone}
                </a>
              </div>

              {(selected.preferred_date || selected.preferred_time) && (
                <div className="mb-4 rounded-xl bg-primary-50 p-3 text-sm text-primary-800">
                  Preferred visit: {selected.preferred_date} at {selected.preferred_time || "TBD"}
                </div>
              )}

              {selected.message && (
                <div className="mb-6 rounded-xl bg-dark-50 p-4 text-sm text-dark-700">{selected.message}</div>
              )}

              <AdminTextarea label="Internal Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.status === "new" && (
                  <AdminButton size="sm" onClick={() => updateStatus(selected.id, "contacted")}>Mark Contacted</AdminButton>
                )}
                {selected.status !== "qualified" && selected.status !== "converted" && (
                  <AdminButton size="sm" variant="outline" onClick={() => updateStatus(selected.id, "qualified")}>Qualify Lead</AdminButton>
                )}
                {selected.status !== "converted" && (
                  <AdminButton size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "converted")}>
                    <CheckCircle size={14} /> Convert (Sold +1)
                  </AdminButton>
                )}
                {selected.status !== "lost" && (
                  <AdminButton size="sm" variant="ghost" onClick={() => updateStatus(selected.id, "lost")}>
                    <XCircle size={14} className="text-red-500" /> Mark Lost
                  </AdminButton>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-dark-200 bg-white">
              <p className="text-sm text-dark-400">Select a lead to manage</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
