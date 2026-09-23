import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import { BLOG_POSTS, mergePublishedWithCatalog, type BlogPostListItem } from "@/lib/blogPosts";

export type PublishedBlog = BlogPostListItem & {
  content_html?: string | null;
  hero_title?: string | null;
  hero_image_alt?: string | null;
};

export function publishedDate(value: string): string {
  return value.slice(0, 10);
}

function getPublicClient() {
  noStore();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

export async function fetchPublishedBlogSummaries(): Promise<BlogPostListItem[]> {
  const supabase = getPublicClient();
  if (!supabase) return [...BLOG_POSTS];

  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, author, published_at, image, category, slug")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const fromDb: BlogPostListItem[] = (data || []).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    date: publishedDate(post.published_at),
    image: post.image,
    category: post.category,
    slug: post.slug,
  }));

  return mergePublishedWithCatalog(fromDb);
}

export async function fetchPublishedBlogBySlug(slug: string): Promise<PublishedBlog | null> {
  const supabase = getPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    author: data.author,
    date: publishedDate(data.published_at),
    image: data.image,
    category: data.category,
    slug: data.slug,
    content_html: data.content_html,
    hero_title: data.hero_title,
    hero_image_alt: data.hero_image_alt,
  };
}
