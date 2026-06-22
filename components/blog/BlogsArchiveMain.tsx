"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, FolderOpen, MessageCircle } from "lucide-react";
import {
  formatBlogCardDate,
  type BlogPostListItem,
} from "@/lib/blogPosts";
import { estimateReadMinutes } from "@/lib/blogReadTime";
import { useBlogPosts } from "@/lib/blog/useBlogPosts";

function postHref(post: BlogPostListItem) {
  return post.slug ? `/iapl-insider/blogs/${post.slug}` : `/iapl-insider/blogs/${post.id}`;
}

export default function BlogsArchiveMain() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const { posts: BLOG_POSTS } = useBlogPosts();

  const filtered = useMemo(() => {
    if (!q) return BLOG_POSTS;
    return BLOG_POSTS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [q, BLOG_POSTS]);

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-neutral-900 md:text-3xl">
        All articles
      </h2>
      <p className="mb-6 max-w-2xl text-sm text-neutral-600 md:text-base">
        Buying guides, legal explainers, and investment analysis from Inuka Afrika
        Properties across Kilifi County and the Kenya coast.
      </p>

      {q ? (
        <p className="mb-6 text-sm text-neutral-600">
          {filtered.length === 0
            ? `No posts matched “${searchParams.get("q")?.trim() ?? ""}”.`
            : `${filtered.length} post${filtered.length === 1 ? "" : "s"} matched your search.`}
        </p>
      ) : null}

      <div className="space-y-6">
        {filtered.map((blog) => {
          const href = postHref(blog);
          const readMins = estimateReadMinutes(blog.title, blog.excerpt);
          return (
            <article
              key={blog.id}
              className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-stretch sm:gap-6 sm:p-5 md:p-6">
                <Link
                  href={href}
                  className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-neutral-100 sm:aspect-auto sm:h-44 sm:w-52 md:h-48 md:w-56"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition duration-300 hover:opacity-95"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-sm font-medium text-primary-600 md:text-[0.95rem]">
                    {formatBlogCardDate(blog.date)}
                  </p>
                  <Link href={href} className="mt-1 block group">
                    <h3 className="text-xl font-bold leading-snug text-primary-700 transition group-hover:text-primary-800 md:text-2xl">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 md:text-base">
                    {blog.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-200 pt-4 text-sm font-medium text-primary-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4 shrink-0" aria-hidden />
                      {blog.category}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5"
                      aria-label="Comments"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                      0
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 shrink-0" aria-hidden />
                      {readMins} min read
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
