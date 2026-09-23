"use client";

import { useEffect, useState } from "react";
import { BLOG_POSTS, mergePublishedWithCatalog, type BlogPostListItem } from "@/lib/blogPosts";

export function useBlogPosts(): {
  posts: BlogPostListItem[];
  loading: boolean;
} {
  const [posts, setPosts] = useState<BlogPostListItem[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/blogs", { cache: "no-store" })
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
            date: p.published_at.slice(0, 10),
            image: p.image,
            category: p.category,
            slug: p.slug,
          })
        );

        setPosts(mergePublishedWithCatalog(fromDb));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
