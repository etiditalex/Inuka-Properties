"use client";

import { motion } from "framer-motion";
import { FileText, Shield, AlertTriangle, Mail } from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "January 19, 2026";

export default function TermsOfServicePage() {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="flex justify-center mb-4">
              <FileText size={48} className="text-primary-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Terms of Service</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Terms that apply when you use our website and services
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
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-10"
          >
            <div>
              <p className="text-dark-600 mb-6">
                <strong>Last Updated:</strong> {LAST_UPDATED}
              </p>
              <p className="text-dark-600 leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Inuka Afrika Properties
                Limited website and related services. By using our website, you agree to these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Shield size={24} className="text-primary-600" />
                Use of the Website
              </h2>
              <ul className="space-y-2 text-dark-600">
                <li>• Use the website for lawful purposes only</li>
                <li>• Do not attempt to disrupt, damage, or gain unauthorized access to our systems</li>
                <li>• Do not copy or reuse content in a way that infringes our rights or third-party rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-primary-600" />
                Disclaimers
              </h2>
              <p className="text-dark-600 leading-relaxed">
                Property information, pricing, availability, and descriptions on this website are provided for general
                information and may change without notice. While we aim to keep information accurate, we do not warrant
                that all content is complete, current, or error-free.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Limitation of Liability</h2>
              <p className="text-dark-600 leading-relaxed">
                To the maximum extent permitted by applicable law, we shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of (or inability to use) this website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Third-Party Links</h2>
              <p className="text-dark-600 leading-relaxed">
                Our website may include links to third-party websites or services. We are not responsible for the
                content, policies, or practices of third parties.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Mail size={24} className="text-primary-600" />
                Contact
              </h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                If you have questions about these Terms, contact us:
              </p>
              <div className="bg-primary-50 rounded-lg p-6">
                <p className="text-dark-900 font-semibold mb-2">Inuka Afrika Properties Limited</p>
                <p className="text-dark-600 text-sm">
                  Email:{" "}
                  <a href="mailto:info@inukaproperties.co.ke" className="text-primary-600 hover:underline">
                    info@inukaproperties.co.ke
                  </a>
                </p>
              </div>
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

