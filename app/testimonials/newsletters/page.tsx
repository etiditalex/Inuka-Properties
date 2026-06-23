"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Send, FileText } from "lucide-react";
import { STATIC_NEWSLETTER_BENEFITS } from "@/lib/newsletters/catalog";

type NewsletterIssue = {
  id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  published_at: string;
};

export default function NewslettersPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);

  useEffect(() => {
    fetch("/api/content/newsletters")
      .then((r) => r.json())
      .then((data) => {
        if (data.issues?.length) setIssues(data.issues);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/content/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not subscribe. Please try again.");
        return;
      }

      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    } catch {
      setError("Could not subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Newsletters</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Stay informed with our monthly newsletter
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={40} className="text-primary-700" />
              </div>
              <h2 className="text-3xl font-bold text-dark-900 mb-4 font-serif">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-dark-600 text-lg">
                Get the latest updates, property listings, and exclusive offers delivered to your inbox
              </p>
            </div>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6 text-center"
              >
                <CheckCircle size={48} className="text-cyan-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-cyan-800 mb-2">
                  Successfully Subscribed!
                </h3>
                <p className="text-cyan-700">
                  Thank you for subscribing. You&apos;ll receive our newsletter soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-dark-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send size={20} />
                  {submitting ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-dark-200">
              <h3 className="font-semibold text-dark-900 mb-4">What You&apos;ll Receive:</h3>
              <ul className="space-y-2">
                {STATIC_NEWSLETTER_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-dark-600">
                    <CheckCircle size={20} className="text-primary-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {issues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-dark-900 mb-6 font-serif">Past Newsletters</h2>
              <ul className="space-y-4">
                {issues.map((issue) => (
                  <li key={issue.id} className="flex items-start gap-3 border-b border-dark-100 pb-4 last:border-0">
                    <FileText className="mt-1 shrink-0 text-primary-600" size={20} />
                    <div>
                      <h3 className="font-semibold text-dark-900">{issue.title}</h3>
                      <p className="text-xs text-dark-400">{formatDate(issue.published_at)}</p>
                      {issue.description && <p className="mt-1 text-sm text-dark-600">{issue.description}</p>}
                      {issue.file_url && (
                        <a href={issue.file_url} className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:underline">
                          Read newsletter
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
