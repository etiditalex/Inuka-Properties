"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  captureLeadThenOpenWhatsApp,
  prefillFromStoredContact,
} from "@/lib/leads/captureLead";
import { siteVisitWhatsAppMessage, whatsAppUrl } from "@/lib/whatsapp";

const LOCATIONS = [
  "Tulivu Haven",
  "Msabaha Phase 8",
  "Mwanda Phase 3 (sold out)",
  "Kibao Kiche Haven",
  "Bofa Platinum",
  "Chumani Phase 6",
  "Kikambala Phase 2",
  "Chumani Phase 3",
  "Ocean View Gardens",
  "Mtondia Highway Gardens",
  "Malindi Airport Gardens",
  "Other / Not Sure",
];

interface BookSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: number | null;
  propertyTitle?: string | null;
  source?: string;
}

function BookSiteVisitModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  source = "site_visit_modal",
}: BookSiteVisitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    property: "",
    preferredDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setFallbackUrl(null);
      setSubmitting(false);
      return;
    }

    const prefill = prefillFromStoredContact();
    setFormData({
      name: prefill.name,
      phone: prefill.phone,
      property: propertyTitle?.trim() || "",
      preferredDate: "",
    });
  }, [isOpen, propertyTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const url = whatsAppUrl(
      siteVisitWhatsAppMessage({
        name: formData.name,
        email: "",
        phone: formData.phone,
        property: formData.property,
        preferredDate: formData.preferredDate,
      })
    );
    setFallbackUrl(url);

    try {
      const { whatsappOpened } = await captureLeadThenOpenWhatsApp({
        name: formData.name,
        email: "",
        phone: formData.phone,
        property: formData.property,
        property_id: propertyId ?? null,
        property_name: formData.property,
        preferred_date: formData.preferredDate || null,
        source,
      });

      if (!whatsappOpened) {
        setError(
          "Your details were saved. Please check your pop-up blocker or open WhatsApp manually."
        );
        setSubmitting(false);
        return;
      }

      onClose();
    } catch {
      setError("Unable to save your details. You can still open WhatsApp manually below.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fieldClass =
    "w-full rounded-full border border-dark-200 bg-dark-50 px-5 py-2.5 text-dark-800 placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-dark-900/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-site-visit-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex justify-end px-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-dark-400 transition hover:bg-dark-100 hover:text-dark-700"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-primary-700 px-6 py-8 text-center sm:px-10">
              <h2
                id="book-site-visit-title"
                className="font-montserrat text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                Book A Free Site Visit
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-8 sm:px-10">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="mb-2 text-sm text-red-700">{error}</p>
                  <a
                    href={
                      fallbackUrl ||
                      whatsAppUrl("Hello! I would like to book a site visit.")
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary-700 underline hover:text-primary-800"
                  >
                    Open WhatsApp manually
                  </a>
                </div>
              )}

              <div className="grid items-center gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <label htmlFor="modal-name" className="text-sm font-medium text-dark-800">
                  Name<span className="text-primary-600">*</span>
                </label>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>

              <div className="grid items-center gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <label htmlFor="modal-phone" className="text-sm font-medium text-dark-800">
                  Phone number<span className="text-primary-600">*</span>
                </label>
                <input
                  type="tel"
                  id="modal-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  placeholder="07xxxxxx"
                  className={fieldClass}
                />
              </div>

              <div className="grid items-center gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <label htmlFor="modal-property" className="text-sm font-medium text-dark-800">
                  Location<span className="text-primary-600">*</span>
                </label>
                <select
                  id="modal-property"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23495057%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
                >
                  <option value="">Location interested</option>
                  {propertyTitle && !LOCATIONS.includes(propertyTitle) && (
                    <option value={propertyTitle}>{propertyTitle}</option>
                  )}
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid items-start gap-2 sm:grid-cols-[160px_1fr] sm:gap-6">
                <label
                  htmlFor="modal-date"
                  className="pt-2.5 text-sm font-medium text-dark-800"
                >
                  Site visit date
                </label>
                <div>
                  <input
                    type="date"
                    id="modal-date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={fieldClass}
                  />
                  <p className="mt-1.5 text-xs text-dark-400">
                    When are you available for a free site visit?
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-dark-800 px-8 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Book Site Visit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BookSiteVisitModal;
