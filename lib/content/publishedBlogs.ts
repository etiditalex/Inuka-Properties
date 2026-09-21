import { createClient } from "@supabase/supabase-js";
import { BLOG_POSTS, type BlogPostListItem } from "@/lib/blogPosts";

export type PublishedBlog = BlogPostListItem & {
  content_html?: string | null;
  hero_title?: string | null;
  hero_image_alt?: string | null;
};

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
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
    date: post.published_at,
    image: post.image,
    category: post.category,
    slug: post.slug,
  }));

  const staticSlugs = new Set(BLOG_POSTS.map((post) => post.slug));
  return [...fromDb.filter((post) => !staticSlugs.has(post.slug)), ...BLOG_POSTS].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
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
    date: data.published_at,
    image: data.image,
    category: data.category,
    slug: data.slug,
    content_html: data.content_html,
    hero_title: data.hero_title,
    hero_image_alt: data.hero_image_alt,
  };
}
