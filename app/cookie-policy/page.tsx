"use client";

import { motion } from "framer-motion";
import { Cookie, Shield, Eye, Settings, FileText } from "lucide-react";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <Cookie size={48} className="text-primary-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Cookie Policy</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Learn how we use cookies to enhance your browsing experience
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8"
          >
            <div>
              <p className="text-dark-600 mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-dark-600 leading-relaxed">
                At Inuka Afrika Properties Limited ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal data. This Cookie Policy explains how we use cookies and similar tracking technologies on our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <FileText size={24} className="text-primary-600" />
                What Are Cookies?
              </h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-dark-600 leading-relaxed">
                Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Settings size={24} className="text-primary-600" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">Essential Cookies</h3>
                  <p className="text-dark-600">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies as they are essential for the website to work.
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">Analytics Cookies</h3>
                  <p className="text-dark-600">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">Functional Cookies</h3>
                  <p className="text-dark-600">
                    These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Eye size={24} className="text-primary-600" />
                How We Use Cookies
              </h2>
              <ul className="space-y-3 text-dark-600">
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To remember your preferences and settings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To analyze website traffic and usage patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To improve website performance and functionality</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To provide personalized content and recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold mt-1">•</span>
                  <span>To ensure website security and prevent fraud</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Shield size={24} className="text-primary-600" />
                Managing Your Cookie Preferences
              </h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
              </p>
              <p className="text-dark-600 leading-relaxed mb-4">
                However, please note that if you choose to disable cookies, some features of our website may not function properly or may be unavailable.
              </p>
              <div className="bg-dark-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-dark-900 mb-3">How to Manage Cookies in Your Browser:</h3>
                <ul className="space-y-2 text-dark-600 text-sm">
                  <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li>• <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Third-Party Cookies</h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements, and so on. These third-party cookies are governed by the respective privacy policies of those third parties.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Updates to This Policy</h2>
              <p className="text-dark-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Contact Us</h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-primary-50 rounded-lg p-6">
                <p className="text-dark-900 font-semibold mb-2">Inuka Afrika Properties Limited</p>
                <p className="text-dark-600 text-sm mb-1">Links Road Opposite Kigothos Hotel</p>
                <p className="text-dark-600 text-sm mb-1">P.O. BOX 525-80100, Nyali, Mombasa, Kenya</p>
                <p className="text-dark-600 text-sm mb-1">Phone: <a href="tel:+254711082084" className="text-primary-600 hover:underline">0711 082084</a></p>
                <p className="text-dark-600 text-sm">Email: <a href="mailto:info@inukaproperties.co.ke" className="text-primary-600 hover:underline">info@inukaproperties.co.ke</a></p>
              </div>
            </div>

            <div className="pt-6 border-t border-dark-200">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition"
              >
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

