"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlogsPage() {
  const blogs = [
    {
      id: 1,
      title: "10 Tips for First-Time Property Buyers in Kenya",
      excerpt: "Essential guidance for navigating your first property purchase in the Kenyan real estate market.",
      author: "IAPL Team",
      date: "2024-01-15",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      category: "Buying Guide",
    },
    {
      id: 2,
      title: "Understanding Title Deeds: A Complete Guide",
      excerpt: "Everything you need to know about property titles and how to ensure a smooth transfer process.",
      author: "IAPL Legal Team",
      date: "2024-01-10",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      category: "Legal",
    },
    {
      id: 3,
      title: "Investment Opportunities in Kilifi County",
      excerpt: "Exploring the growing real estate market in Kilifi and why it's becoming a hotspot for investors.",
      author: "IAPL Research",
      date: "2024-01-05",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      category: "Investment",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Blogs</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Expert insights and practical advice for your real estate journey
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {blog.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-dark-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{blog.author}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-dark-900 mb-3">{blog.title}</h2>
                <p className="text-dark-600 mb-4">{blog.excerpt}</p>
                <Link
                  href={`/iapl-insider/blogs/${blog.id}`}
                  className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2"
                >
                  Read More
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

