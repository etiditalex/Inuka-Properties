"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Send, CheckCircle, User, Phone } from "lucide-react";

export default function EmailFloatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const isHomepage = pathname === "/";

  useEffect(() => {
    if (!isHomepage) return;
    const hintShown = sessionStorage.getItem("iapl-email-hint-shown");
    if (!hintShown) {
      const timer = setTimeout(() => setShowHint(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isHomepage]);

  useEffect(() => {
    if (isOpen) setShowHint(false);
  }, [isOpen]);

  if (!isHomepage) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: "Requested property details via homepage email widget",
          source: "homepage_email_widget",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit. Please try again.");
        return;
      }
      setSubmitted(true);
      sessionStorage.setItem("iapl-email-hint-shown", "true");
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    if (submitted) {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="fixed left-[4.5rem] top-1/2 z-40 max-w-[200px] -translate-y-1/2 rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-xl md:left-20 md:max-w-[220px]"
          >
            <p className="text-sm font-semibold text-dark-900 font-montserrat">Get property details by email</p>
            <p className="mt-1 text-xs text-dark-600">Tap here — we&apos;ll email you project info instantly</p>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-dark-100 text-dark-500 hover:bg-dark-200"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
            <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-l border-primary-100 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed left-0 top-1/2 z-50 -translate-y-1/2">
        <motion.button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="group relative flex items-center gap-0"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          aria-label={isOpen ? "Close email panel" : "Get property details by email"}
        >
          {!isOpen && (
            <span className="absolute inset-0 animate-ping rounded-r-2xl bg-primary-400/25" />
          )}
          <span
            className={`relative flex flex-col items-center gap-1 rounded-r-2xl border border-l-0 border-primary-400/30 px-3 py-4 shadow-lg transition ${
              isOpen
                ? "bg-dark-900 text-white"
                : "bg-gradient-to-br from-primary-600 to-primary-800 text-white hover:from-primary-700 hover:to-primary-900"
            }`}
          >
            {isOpen ? (
              <X size={22} />
            ) : (
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="inline-flex"
              >
                <Mail size={22} />
              </motion.span>
            )}
            {!isOpen && (
              <span className="text-[10px] font-bold uppercase tracking-wider font-montserrat [writing-mode:vertical-rl] rotate-180">
                Email
              </span>
            )}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-dark-900/20 backdrop-blur-[1px] md:bg-transparent md:backdrop-blur-none"
              onClick={close}
              aria-label="Close email panel"
            />
            <motion.aside
              initial={{ opacity: 0, x: -320 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -320 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              className="fixed left-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-r border-dark-200 bg-white shadow-2xl"
            >
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-5 py-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-100">Inuka Afrika</p>
                    <h2 className="text-xl font-bold font-montserrat">Property details by email</h2>
                    <p className="mt-1 text-sm text-primary-50">
                      Enter your details and receive project information in your inbox instantly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full flex-col items-center justify-center text-center"
                  >
                    <CheckCircle size={56} className="text-emerald-500" />
                    <h3 className="mt-4 text-xl font-bold text-dark-900 font-montserrat">Check your inbox!</h3>
                    <p className="mt-2 text-sm text-dark-600">
                      Property details have been sent to <strong>{form.email}</strong>.
                      Our team has also been notified.
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-6 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      Done
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-dark-800">Full name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-dark-400" size={16} />
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-xl border border-dark-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-dark-800">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-dark-400" size={16} />
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-dark-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-dark-800">Phone / WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-dark-400" size={16} />
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-xl border border-dark-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          placeholder="0712 345 678"
                        />
                      </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white transition hover:bg-primary-700 disabled:opacity-60"
                    >
                      <Send size={16} />
                      {submitting ? "Sending…" : "Email me property details"}
                    </button>

                    <p className="text-center text-xs text-dark-500">
                      Free · No spam ·{" "}
                      <a href="/get-property-details" className="text-primary-600 underline">
                        Full form
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
