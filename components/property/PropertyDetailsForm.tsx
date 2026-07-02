"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, User, Send, CheckCircle } from "lucide-react";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID } from "@/lib/facebook/pixel";
import { trackFacebookEvent } from "@/lib/facebook/trackClient";
import {
  hasContactFormFields,
  isFacebookAdTraffic,
  joinFullName,
  resolveContactFormPrefill,
  saveContact,
} from "@/lib/leads/contactAutofill";

type PropertyDetailsFormProps = {
  propertyId: number;
  propertyTitle: string;
  source?: string;
  message?: string;
  /** Fire Facebook Lead event for campaign property */
  trackLead?: boolean;
  showHeading?: boolean;
  className?: string;
};

function PropertyDetailsFormInner({
  propertyId,
  propertyTitle,
  source = "property_page",
  message,
  trackLead = false,
  showHeading = true,
  className = "",
}: PropertyDetailsFormProps) {
  const searchParams = useSearchParams();
  const fromFacebookAd = useMemo(
    () => isFacebookAdTraffic(searchParams),
    [searchParams]
  );
  const leadSource = fromFacebookAd ? "facebook_ad" : source;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [autofilled, setAutofilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prefill = resolveContactFormPrefill(searchParams);
    setForm(prefill);
    setAutofilled(hasContactFormFields(prefill));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const fullName = joinFullName(form.firstName, form.lastName);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: form.email,
          phone: form.phone,
          property_id: propertyId,
          property_name: propertyTitle,
          message:
            message ??
            `Requested property details for ${propertyTitle} via property page`,
          source: leadSource,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit. Please try again.");
        return;
      }

      saveContact({ name: fullName, email: form.email, phone: form.phone });

      const shouldTrackLead =
        trackLead || fromFacebookAd || propertyId === FACEBOOK_CAMPAIGN_PROPERTY_ID;
      if (shouldTrackLead) {
        trackFacebookEvent(
          "Lead",
          {
            property_id: propertyId,
            property_name: propertyTitle,
            page_path: window.location.pathname,
            event_data: { source: leadSource, from_facebook_ad: fromFacebookAd },
          },
          {
            customData: {
              content_name: propertyTitle,
              content_ids: [String(propertyId)],
            },
          }
        );
      }

      setSubmitted(true);
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <CheckCircle size={48} className="text-emerald-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-dark-900 font-montserrat mb-2">
          Check your email!
        </h3>
        <p className="text-dark-600 text-sm">
          Property details for <strong>{propertyTitle}</strong> have been sent to{" "}
          <strong>{form.email}</strong>. Our team will also reach out on WhatsApp shortly.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeading && (
        <>
          <h3 className="text-xl font-bold text-dark-900 font-montserrat mb-2">
            Get property details
          </h3>
          <p className="text-dark-600 text-sm mb-5">
            Enter your details and we&apos;ll email you full project information for{" "}
            <strong>{propertyTitle}</strong>.
          </p>
        </>
      )}
      {fromFacebookAd && (
        <p className="mb-4 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-900">
          Welcome from Facebook — your details should fill in automatically if you&apos;re signed in
          on this device. You can edit them before submitting.
        </p>
      )}
      {autofilled && !fromFacebookAd && (
        <p className="mb-4 rounded-lg bg-primary-50 border border-primary-100 px-3 py-2 text-xs text-primary-800">
          Your details were filled in automatically. You can edit them before submitting.
        </p>
      )}
      <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`property-first-name-${propertyId}`}
              className="block text-sm font-semibold text-dark-900 mb-1.5"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-dark-400" size={18} />
              <input
                id={`property-first-name-${propertyId}`}
                name="given-name"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="First name"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor={`property-last-name-${propertyId}`}
              className="block text-sm font-semibold text-dark-900 mb-1.5"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-dark-400" size={18} />
              <input
                id={`property-last-name-${propertyId}`}
                name="family-name"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor={`property-email-${propertyId}`}
            className="block text-sm font-semibold text-dark-900 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-dark-400" size={18} />
            <input
              id={`property-email-${propertyId}`}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor={`property-phone-${propertyId}`}
            className="block text-sm font-semibold text-dark-900 mb-1.5"
          >
            Phone / WhatsApp
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-dark-400" size={18} />
            <input
              id={`property-phone-${propertyId}`}
              name="tel"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
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
          className="w-full bg-primary-600 text-white py-3.5 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Send size={18} />
          {submitting ? "Sending..." : "Send Me Property Details"}
        </button>
      </form>
    </div>
  );
}

export default function PropertyDetailsForm(props: PropertyDetailsFormProps) {
  return (
    <Suspense
      fallback={
        <div className={`animate-pulse rounded-xl bg-dark-50 h-64 ${props.className ?? ""}`} />
      }
    >
      <PropertyDetailsFormInner {...props} />
    </Suspense>
  );
}
