"use client";

import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import Image from "next/image";

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "Inuka Afrika Properties Celebrates 10 Years of Excellence",
      excerpt: "We're proud to mark a decade of transforming the real estate landscape in Kenya.",
      date: "2024-01-20",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
      featured: true,
    },
    {
      id: 2,
      title: "New Affordable Housing Project Launched in Kikambala",
      excerpt: "Exciting new development offering affordable housing solutions in prime coastal location.",
      date: "2024-01-18",
      category: "Project Launch",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    },
    {
      id: 3,
      title: "Partnership with Leading Financial Institution Announced",
      excerpt: "New mortgage solutions now available for our clients through strategic partnership.",
      date: "2024-01-12",
      category: "Partnership",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">News</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Stay updated with the latest from Inuka Afrika Properties
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition ${
                item.featured ? "md:flex" : ""
              }`}
            >
              <div className={`relative ${item.featured ? "md:w-1/2 h-64 md:h-auto" : "h-64"}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {item.featured && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <div className={`p-6 ${item.featured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : ""}`}>
                <div className="flex items-center gap-4 text-sm text-dark-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    <span>{item.category}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-dark-900 mb-3">{item.title}</h2>
                <p className="text-dark-600">{item.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

