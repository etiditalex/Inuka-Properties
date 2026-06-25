"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ChevronRight,
  Send,
  CheckCircle2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Loader2,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import { DEPARTMENTS, PRIORITIES } from "@/lib/ticketing/public-form";

type PropertyOption = { id: number; title: string };

export default function OpenTicketForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "support",
    related_service: "none",
    priority: "medium",
    message: "",
  });
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ ticketNumber: number; emailSent: boolean } | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/content/properties")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.properties || data || []) as PropertyOption[];
        setProperties(Array.isArray(list) ? list.slice(0, 50) : []);
      })
      .catch(() => {});
  }, []);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  };

  const wrapSelection = (before: string, after: string = before) => {
    const el = messageRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = form.message;
    const selected = text.slice(start, end);
    const next = text.slice(0, start) + before + selected + after + text.slice(end);
    update("message", next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        related_service:
          form.related_service === "none"
            ? null
            : properties.find((p) => String(p.id) === form.related_service)?.title,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setSuccess({
      ticketNumber: data.ticket_number,
      emailSent: data.confirmation_email_sent,
    });
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      department: "support",
      related_service: "none",
      priority: "medium",
      message: "",
    });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-primary-50/40 pt-24 pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center text-slate-500 transition hover:text-primary-600">
              <Home size={16} />
            </Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-500">Support</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-emerald-600">Submit Request</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl font-montserrat">
            Open a Support Ticket
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Tell us how we can help. You will receive an email confirmation with your ticket number as soon as we receive your request.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-900/5 md:p-12"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-montserrat">Request received</h2>
              <p className="mt-2 text-slate-600">
                Your ticket <span className="font-bold text-primary-700">#{success.ticketNumber}</span> has been logged.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {success.emailSent
                  ? "A confirmation email has been sent to your inbox."
                  : "Our team will review your request shortly."}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="mt-6 text-sm font-semibold text-primary-600 hover:underline"
              >
                Submit another request
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5"
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 md:px-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Ticket className="h-4 w-4 text-primary-600" />
                  New support request
                </div>
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      required
                      className={inputClass}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className={inputClass}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    required
                    className={inputClass}
                    placeholder="Brief summary of your request"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label htmlFor="department" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Department
                    </label>
                    <select
                      id="department"
                      className={inputClass}
                      value={form.department}
                      onChange={(e) => update("department", e.target.value)}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="related_service" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Related service
                    </label>
                    <select
                      id="related_service"
                      className={inputClass}
                      value={form.related_service}
                      onChange={(e) => update("related_service", e.target.value)}
                    >
                      <option value="none">None</option>
                      {properties.map((p) => (
                        <option key={p.id} value={String(p.id)}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="mb-1.5 block text-sm font-semibold text-slate-800">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className={inputClass}
                      value={form.priority}
                      onChange={(e) => update("priority", e.target.value)}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Phone <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={cn(inputClass, "md:max-w-sm")}
                    placeholder="+254 7XX XXX XXX"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
                    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
                      {[
                        { icon: Bold, action: () => wrapSelection("**") },
                        { icon: Italic, action: () => wrapSelection("*") },
                        { icon: List, action: () => wrapSelection("\n- ", "") },
                        { icon: ListOrdered, action: () => wrapSelection("\n1. ", "") },
                        { icon: Link2, action: () => wrapSelection("[", "](url)") },
                      ].map(({ icon: Icon, action }, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={action}
                          className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800"
                          aria-label="Format"
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                    <textarea
                      ref={messageRef}
                      id="message"
                      required
                      rows={8}
                      className="w-full resize-y border-0 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="Describe your request in detail..."
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                )}
              </div>

              <div className="flex flex-col items-center justify-center gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary-900/20 transition hover:from-primary-700 hover:to-primary-800 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Submit ticket
                </button>
                <Link
                  href="/contact-us"
                  className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
