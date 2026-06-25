"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminForm";

type Category = { requestType: string; requestCategory: string; department: string };

const DEFAULT_CATEGORIES: Category[] = [
  { requestType: "Property Inquiry", requestCategory: "Site Visit Request", department: "Sales" },
  { requestType: "Property Inquiry", requestCategory: "Pricing & Availability", department: "Sales" },
  { requestType: "Legal Dept Request", requestCategory: "General Inquiry", department: "Legal" },
  { requestType: "Finance Request", requestCategory: "Payment Confirmation", department: "Finance" },
  { requestType: "IT Request", requestCategory: "Software Support", department: "IT" },
  { requestType: "Marketing Request", requestCategory: "Campaign Assets", department: "Marketing" },
  { requestType: "Facilities Request", requestCategory: "Office Maintenance", department: "Operations" },
];

type NewTicketModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function NewTicketModal({ open, onClose, onCreated }: NewTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryKey, setCategoryKey] = useState("0");
  const [form, setForm] = useState({
    requester_name: "",
    requester_email: "",
    requester_phone: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    if (!open) {
      setError("");
      setCategoryKey("0");
      setForm({
        requester_name: "",
        requester_email: "",
        requester_phone: "",
        subject: "",
        description: "",
        priority: "medium",
      });
    }
  }, [open]);

  const selected = DEFAULT_CATEGORIES[Number(categoryKey)] || DEFAULT_CATEGORIES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        request_type: selected.requestType,
        request_category: selected.requestCategory,
        department: selected.department,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create ticket");
      return;
    }

    onCreated();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900 font-montserrat">New Ticket</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput
                  label="Requester name"
                  value={form.requester_name}
                  onChange={(e) => setForm((f) => ({ ...f, requester_name: e.target.value }))}
                  required
                />
                <AdminInput
                  label="Requester email"
                  type="email"
                  value={form.requester_email}
                  onChange={(e) => setForm((f) => ({ ...f, requester_email: e.target.value }))}
                  required
                />
              </div>

              <AdminInput
                label="Phone (optional)"
                value={form.requester_phone}
                onChange={(e) => setForm((f) => ({ ...f, requester_phone: e.target.value }))}
              />

              <AdminSelect
                label="Request type"
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                options={DEFAULT_CATEGORIES.map((c, i) => ({
                  value: String(i),
                  label: `${c.requestType} > ${c.requestCategory}`,
                }))}
              />

              <AdminInput
                label="Subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />

              <AdminTextarea
                label="Request detail"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                required
              />

              <AdminSelect
                label="Priority"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <AdminButton type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </AdminButton>
                <AdminButton type="submit" loading={loading}>
                  Create Ticket
                </AdminButton>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
