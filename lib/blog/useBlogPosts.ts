"use client";

import { useEffect, useState } from "react";
import { BLOG_POSTS, type BlogPostListItem } from "@/lib/blogPosts";

export function useBlogPosts(): {
  posts: BlogPostListItem[];
  loading: boolean;
} {
  const [posts, setPosts] = useState<BlogPostListItem[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (!data.posts?.length) return;

        const fromDb: BlogPostListItem[] = data.posts.map(
          (p: {
            id: number;
            title: string;
            excerpt: string;
            author: string;
            published_at: string;
            image: string;
            category: string;
            slug: string;
          }) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            author: p.author,
            date: p.published_at,
            image: p.image,
            category: p.category,
            slug: p.slug,
          })
        );

        const staticSlugs = new Set(BLOG_POSTS.map((p) => p.slug));
        const merged = [
          ...fromDb.filter((p) => !staticSlugs.has(p.slug)),
          ...BLOG_POSTS,
        ].sort((a, b) => b.date.localeCompare(a.date));

        setPosts(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
