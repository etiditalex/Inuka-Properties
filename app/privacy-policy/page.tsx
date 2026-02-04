"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Database,
  Users,
  Globe,
  FileText,
  Mail,
  Eye,
  Home,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "January 19, 2026";
const HERO_BG_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section (matches "All Properties" style) */}
      <section className="relative overflow-hidden py-16 md:py-20 text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
          aria-hidden="true"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" aria-hidden="true" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-6 text-white/80">
                <Link href="/" className="flex items-center hover:text-white transition">
                  <Home size={18} className="stroke-2" />
                </Link>
                <ChevronRight size={16} className="text-white/50" />
                <span className="text-white font-montserrat">Privacy Policy</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-montserrat">
                Privacy Policy
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-white/80 font-montserrat max-w-2xl">
                How we collect, use, share, and protect your personal information
              </p>
            </motion.div>

            {/* Right Side - Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-6 shadow-2xl">
                <p className="text-sm text-white/80 font-montserrat mb-3">
                  <span className="font-semibold text-white">Last Updated:</span> {LAST_UPDATED}
                </p>
                <ul className="space-y-3 text-white/85">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-primary-200" />
                    <span className="font-montserrat">We don’t sell your personal information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-primary-200" />
                    <span className="font-montserrat">
                      Cookies info is in our{" "}
                      <Link href="/cookie-policy" className="text-white underline hover:text-primary-100 transition">
                        Cookie Policy
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-primary-200" />
                    <span className="font-montserrat">
                      Questions? Email{" "}
                      <a
                        href="mailto:info@inukaproperties.co.ke"
                        className="text-white underline hover:text-primary-100 transition"
                      >
                        info@inukaproperties.co.ke
                      </a>
                      .
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-10"
          >
            <div>
              <p className="text-dark-600 mb-6">
                <strong>Last Updated:</strong> {LAST_UPDATED}
              </p>
              <p className="text-dark-600 leading-relaxed">
                This Privacy Policy explains how Inuka Afrika Properties Limited (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) collects, uses, discloses, and safeguards information when you visit our website and
                interact with our services (including inquiries, site visit bookings, and other communications).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <FileText size={24} className="text-primary-600" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Information you provide</h3>
                  <ul className="space-y-2">
                    <li>• Contact details (such as name, phone number, email address)</li>
                    <li>• Inquiry details (message content, property interest, preferred locations)</li>
                    <li>• Site visit booking details (preferred date/time, location, notes)</li>
                    <li>• Any information you choose to share when communicating with us</li>
                  </ul>
                </div>

                <div className="bg-cyan-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Information collected automatically</h3>
                  <ul className="space-y-2">
                    <li>• Device and browser information (e.g., browser type, operating system)</li>
                    <li>• Usage data (pages viewed, links clicked, time spent)</li>
                    <li>• Approximate location (derived from IP address)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Eye size={24} className="text-primary-600" />
                How We Use Your Information
              </h2>
              <ul className="space-y-3 text-dark-600">
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To respond to inquiries and provide information about properties and services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To schedule and manage site visits and customer support requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To improve our website, services, and user experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To send service-related updates (e.g., confirmations, follow-ups) when appropriate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To protect against fraud, abuse, and security incidents</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Users size={24} className="text-primary-600" />
                How We Share Information
              </h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                We do not sell your personal information. We may share information in the following situations:
              </p>
              <div className="space-y-4">
                <div className="bg-dark-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Service providers</h3>
                  <p className="text-dark-600 leading-relaxed">
                    With trusted vendors who help us operate the website and provide services (for example, website
                    hosting, content delivery, and email/communications), only as necessary to perform their services.
                  </p>
                </div>
                <div className="bg-dark-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Legal and safety reasons</h3>
                  <p className="text-dark-600 leading-relaxed">
                    If required to comply with applicable laws, regulations, legal processes, or lawful requests, or to
                    protect rights, safety, and security.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Database size={24} className="text-primary-600" />
                Data Retention
              </h2>
              <p className="text-dark-600 leading-relaxed">
                We keep personal information only as long as necessary to fulfill the purposes described in this policy,
                including to meet legal, accounting, or reporting requirements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Lock size={24} className="text-primary-600" />
                Security
              </h2>
              <p className="text-dark-600 leading-relaxed">
                We implement reasonable technical and organizational measures to protect your information. However, no
                method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Globe size={24} className="text-primary-600" />
                Cookies and Tracking
              </h2>
              <p className="text-dark-600 leading-relaxed">
                We may use cookies and similar technologies to improve website functionality and understand usage. For
                more information, please see our{" "}
                <Link href="/cookie-policy" className="text-primary-600 hover:underline font-semibold">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Mail size={24} className="text-primary-600" />
                Your Choices &amp; Rights
              </h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                Depending on your location and applicable law, you may have rights regarding your personal information
                (such as access, correction, deletion, or objection). To make a request, contact us using the details
                below.
              </p>
              <div className="bg-primary-50 rounded-lg p-6">
                <p className="text-dark-900 font-semibold mb-2">Inuka Afrika Properties Limited</p>
                <p className="text-dark-600 text-sm mb-1">Links Road Opposite Kigothos Hotel</p>
                <p className="text-dark-600 text-sm mb-1">P.O. BOX 525-80100, Nyali, Mombasa, Kenya</p>
                <p className="text-dark-600 text-sm">
                  Email:{" "}
                  <a href="mailto:info@inukaproperties.co.ke" className="text-primary-600 hover:underline">
                    info@inukaproperties.co.ke
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Changes to This Policy</h2>
              <p className="text-dark-600 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
                updated &quot;Last Updated&quot; date.
              </p>
            </div>

            <div className="pt-6 border-t border-dark-200">
              <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

