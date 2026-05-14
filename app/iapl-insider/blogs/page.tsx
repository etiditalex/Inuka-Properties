"use client";

import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BLOG_POSTS, formatIsoDate } from "@/lib/blogPosts";

function BlogsGrid() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return BLOG_POSTS;
    return BLOG_POSTS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [q]);

  return (
    <>
      {q ? (
        <p className="mb-6 text-sm text-neutral-600">
          {filtered.length === 0
            ? `No posts matched “${searchParams.get("q")?.trim() ?? ""}”.`
            : `${filtered.length} post${filtered.length === 1 ? "" : "s"} matched your search.`}
        </p>
      ) : null}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((blog, index) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-xl"
          >
            <div className="relative h-48">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white">
                {blog.category}
              </div>
            </div>
            <div className="p-6">
              <div className="mb-3 flex items-center gap-4 text-sm text-dark-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatIsoDate(blog.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{blog.author}</span>
                </div>
              </div>
              <h2 className="mb-3 text-xl font-bold text-dark-900">{blog.title}</h2>
              <p className="mb-4 text-dark-600">{blog.excerpt}</p>
              <Link
                href={
                  blog.slug
                    ? `/iapl-insider/blogs/${blog.slug}`
                    : `/iapl-insider/blogs/${blog.id}`
                }
                className="flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
              >
                Read More
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}

function BlogsGridFallback() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[420px] animate-pulse rounded-xl bg-neutral-200"
        />
      ))}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <div className="pb-20 pt-24 font-montserrat">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Blogs
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-primary-100">
              Expert insights and practical advice for your real estate journey
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Suspense fallback={<BlogsGridFallback />}>
          <BlogsGrid />
        </Suspense>
      </section>
    </div>
  );
}
