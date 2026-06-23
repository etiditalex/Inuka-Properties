"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Phone, User, Send, CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";

type PropertyPreview = {
  id: number;
  title: string;
  location: string;
  price: string;
  size: string;
  image: string;
  description: string | null;
};

function GetPropertyDetailsForm() {
  const searchParams = useSearchParams();
  const propertyIdParam = searchParams.get("property_id");

  const [property, setProperty] = useState<PropertyPreview | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!propertyIdParam) return;
    fetch(`/api/content/properties/${propertyIdParam}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.property) {
          setProperty({
            id: data.property.id,
            title: data.property.title,
            location: data.property.location,
            price: data.property.price,
            size: data.property.size,
            image: data.property.image,
            description: data.property.description ?? null,
          });
        }
      })
      .catch(() => {});
  }, [propertyIdParam]);

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
          property_id: property?.id || (propertyIdParam ? Number(propertyIdParam) : null),
          property_name: property?.title || null,
          message: "Requested property details via Facebook ad / landing page",
          source: "facebook_ad",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 font-montserrat mb-3">
            Get Property Details
          </h1>
          <p className="text-dark-600 text-lg max-w-xl mx-auto">
            Enter your details below and we&apos;ll email you full project information instantly.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {property && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white"
            >
              <div className="relative h-48">
                <Image src={property.image} alt={property.title} fill className="object-cover" unoptimized />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-dark-900 font-montserrat">{property.title}</h2>
                <p className="flex items-center gap-1 text-dark-600 mt-1 text-sm">
                  <MapPin size={14} className="text-primary-600" /> {property.location}
                </p>
                <p className="text-2xl font-bold text-primary-700 mt-3">{property.price}</p>
                <p className="text-sm text-dark-500 mt-1">{property.size}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={56} className="text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark-900 mb-2">Check your email!</h2>
                <p className="text-dark-600">
                  Property details have been sent to <strong>{form.email}</strong>.
                  Our team will also reach out on WhatsApp shortly.
                </p>
                <a
                  href="https://wa.me/254711082084"
                  className="inline-block mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Chat on WhatsApp: 0711 082 084
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-dark-400" size={18} />
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-dark-400" size={18} />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-dark-400" size={18} />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="0712 345 678"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send size={18} />
                  {submitting ? "Sending..." : "Send Me Property Details"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function GetPropertyDetailsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-dark-500">Loading...</div>}>
      <GetPropertyDetailsForm />
    </Suspense>
  );
}
