"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone, Mail, Send, CheckCircle } from "lucide-react";
import {
  captureLeadThenOpenWhatsApp,
  prefillFromStoredContact,
  resolveLeadSource,
} from "@/lib/leads/captureLead";
import { whatsAppUrl, siteVisitWhatsAppMessage } from "@/lib/whatsapp";

function BookSiteVisitForm() {
  const searchParams = useSearchParams();
  const propertyIdParam = searchParams.get("property_id");
  const sourceParam = searchParams.get("source");

  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prefill = prefillFromStoredContact();
    setFormData((prev) => ({
      ...prev,
      name: prev.name || prefill.name,
      email: prev.email || prefill.email,
      phone: prev.phone || prefill.phone,
    }));
  }, []);

  useEffect(() => {
    if (!propertyIdParam) return;
    const id = Number(propertyIdParam);
    if (Number.isNaN(id)) return;
    setPropertyId(id);
    fetch(`/api/content/properties/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.property?.title) {
          setFormData((prev) => ({ ...prev, property: data.property.title }));
        }
      })
      .catch(() => {});
  }, [propertyIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const source = resolveLeadSource(sourceParam);
    const fallbackUrl = whatsAppUrl(
      siteVisitWhatsAppMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        property: formData.property,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message,
      })
    );
    setWhatsappFallbackUrl(fallbackUrl);

    try {
      const { whatsappOpened } = await captureLeadThenOpenWhatsApp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        property: formData.property,
        property_id: propertyId,
        property_name: formData.property,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        message: formData.message,
        source,
      });

      if (!whatsappOpened) {
        setError(
          "Your details were saved. If WhatsApp did not open, use the button below."
        );
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. You can still continue on WhatsApp below.");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const properties = [
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

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Book a Site Visit</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Schedule a visit to explore our properties in person
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} className="text-cyan-600" />
                </div>
                <h2 className="text-3xl font-bold text-dark-900 mb-4">Booking Received!</h2>
                <p className="text-dark-600 text-lg mb-6">
                  Your details are saved with our team. We&apos;ve also opened WhatsApp so you can
                  continue the conversation right away.
                </p>
                {error && (
                  <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    {error}
                  </p>
                )}
                {whatsappFallbackUrl && (
                  <a
                    href={whatsappFallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white hover:opacity-90"
                  >
                    Continue on WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-dark-900 mb-4 font-serif">
                    Schedule Your Visit
                  </h2>
                  <p className="text-dark-600">
                    Fill out the form below. We&apos;ll save your enquiry and open WhatsApp so our
                    team can confirm your visit.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-dark-900 mb-2">
                        <User size={16} className="inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-dark-900 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-dark-900 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="property" className="block text-sm font-semibold text-dark-900 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Property of Interest *
                    </label>
                    <select
                      id="property"
                      name="property"
                      value={formData.property}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a property</option>
                      {properties.map((prop) => (
                        <option key={prop} value={prop}>
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="preferredDate"
                        className="block text-sm font-semibold text-dark-900 mb-2"
                      >
                        <Calendar size={16} className="inline mr-2" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="preferredTime"
                        className="block text-sm font-semibold text-dark-900 mb-2"
                      >
                        <Clock size={16} className="inline mr-2" />
                        Preferred Time *
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-dark-900 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Any specific requirements or questions..."
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send size={20} />
                    {submitting ? "Saving..." : "Book Site Visit & Open WhatsApp"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function BookSiteVisitPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-dark-500">Loading...</div>}>
      <BookSiteVisitForm />
    </Suspense>
  );
}
