"use client";

import { motion } from "framer-motion";
import { BookOpen, Newspaper, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function IAPLInsiderPage() {
  const sections = [
    {
      icon: BookOpen,
      title: "Blogs",
      description: "Insights, tips, and expert advice on real estate investment and property ownership.",
      href: "/iapl-insider/blogs",
      color: "bg-primary-100 text-primary-700",
    },
    {
      icon: Newspaper,
      title: "News",
      description: "Latest updates, company news, and industry developments from Inuka Afrika Properties.",
      href: "/iapl-insider/news",
      color: "bg-secondary-100 text-secondary-700",
    },
    {
      icon: BarChart3,
      title: "Market Research",
      description: "Comprehensive market analysis, trends, and data to guide your investment decisions.",
      href: "/iapl-insider/market-research",
      color: "bg-accent-100 text-accent-700",
    },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">IAPL Insider</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Stay informed with insights, news, and market research
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={section.href}
                className="block bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition h-full"
              >
                <div className={`w-16 h-16 ${section.color} rounded-lg flex items-center justify-center mb-4`}>
                  <section.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-3">{section.title}</h3>
                <p className="text-dark-600">{section.description}</p>
                <div className="mt-4 text-primary-600 font-semibold">
                  Explore →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}






