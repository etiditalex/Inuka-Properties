"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatBlogCardDate, type BlogPostListItem } from "@/lib/blogPosts";
import { useBlogPosts } from "@/lib/blog/useBlogPosts";

function postHref(post: BlogPostListItem) {
  return post.slug ? `/iapl-insider/blogs/${post.slug}` : `/iapl-insider/blogs/${post.id}`;
}

export default function BlogsArchiveSidebar() {
  const router = useRouter();
  const [searchDraft, setSearchDraft] = useState("");
  const { posts: BLOG_POSTS } = useBlogPosts();

  const latest = [...BLOG_POSTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchDraft.trim();
    const href = q
      ? `/iapl-insider/blogs?q=${encodeURIComponent(q)}`
      : "/iapl-insider/blogs";
    router.push(href);
  };

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <form onSubmit={onSearch} className="flex gap-0">
          <input
            type="search"
            name="q"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search …"
            className="min-w-0 flex-1 rounded-l border border-y border-l border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            aria-label="Search blog posts"
          />
          <button
            type="submit"
            className="shrink-0 rounded-r bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-secondary-700">
          Latest posts
        </h2>
        <div className="mt-2 border-b-2 border-secondary-600/80" aria-hidden />
        <ul className="mt-4 divide-y divide-neutral-200">
          {latest.map((post) => (
            <li key={post.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={postHref(post)}
                className="group flex gap-2 text-sm text-neutral-600 hover:text-primary-700"
              >
                <ChevronRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 group-hover:text-primary-600"
                  aria-hidden
                />
                <span className="leading-snug">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
