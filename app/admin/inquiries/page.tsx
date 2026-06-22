"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Clock, CheckCircle, Archive } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminTextarea } from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";
import type { Inquiry, InquiryStatus } from "@/lib/supabase/types";
import { formatAdminDate, cn } from "@/lib/admin/utils";

const statusFlow: InquiryStatus[] = ["new", "read", "responded", "archived"];

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-secondary-100 text-secondary-800",
  read: "bg-primary-100 text-primary-800",
  responded: "bg-emerald-100 text-emerald-800",
  archived: "bg-dark-100 text-dark-600",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    let query = supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setInquiries((data as Inquiry[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    const supabase = createClient();
    await supabase.from("inquiries").update({ status, notes }).eq("id", id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status, notes });
  };

  return (
    <AdminShell title="Inquiries" subtitle="Contact form submissions and client messages">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", ...statusFlow] as const).map((s) => (
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

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            </div>
          ) : inquiries.length === 0 ? (
            <p className="py-12 text-center text-sm text-dark-400">No inquiries</p>
          ) : (
            inquiries.map((inq) => (
              <button
                key={inq.id}
                type="button"
                onClick={() => { setSelected(inq); setNotes(inq.notes || ""); }}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition",
                  selected?.id === inq.id
                    ? "border-primary-300 bg-primary-50"
                    : "border-dark-200 bg-white hover:border-primary-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-dark-900">{inq.name}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", statusStyles[inq.status])}>
                    {inq.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-dark-500">{inq.subject || inq.email}</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-dark-400">
                  <Clock size={10} /> {formatAdminDate(inq.created_at)}
                </p>
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
                  <p className="text-sm text-dark-500">{selected.subject}</p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase", statusStyles[selected.status])}>
                  {selected.status}
                </span>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl bg-dark-50 p-3 text-sm text-dark-700 hover:bg-primary-50">
                  <Mail size={16} className="text-primary-600" /> {selected.email}
                </a>
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-2 rounded-xl bg-dark-50 p-3 text-sm text-dark-700 hover:bg-primary-50">
                    <Phone size={16} className="text-primary-600" /> {selected.phone}
                  </a>
                )}
              </div>

              <div className="mb-6 rounded-xl bg-dark-50 p-4">
                <p className="text-sm text-dark-700 whitespace-pre-wrap">{selected.message}</p>
              </div>

              <AdminTextarea label="Internal Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.status === "new" && (
                  <AdminButton size="sm" onClick={() => updateStatus(selected.id, "read")}>Mark as Read</AdminButton>
                )}
                {selected.status !== "responded" && (
                  <AdminButton size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "responded")}>
                    <CheckCircle size={14} /> Mark Responded
                  </AdminButton>
                )}
                <AdminButton size="sm" variant="outline" onClick={() => updateStatus(selected.id, "archived")}>
                  <Archive size={14} /> Archive
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-dark-200 bg-white">
              <p className="text-sm text-dark-400">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
