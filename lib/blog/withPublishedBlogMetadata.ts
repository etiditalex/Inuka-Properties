import type { Metadata } from "next";
import { catalogPostUnchanged } from "@/lib/blog/editorContent";
import { fetchPublishedBlogBySlug, publishedDate } from "@/lib/content/publishedBlogs";
import { buildArticleMetadata } from "@/lib/seo";

export async function withPublishedBlogMetadata(slug: string, fallback: Metadata): Promise<Metadata> {
  const post = await fetchPublishedBlogBySlug(slug);
  if (!post || catalogPostUnchanged(post)) return fallback;

  const live = buildArticleMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/iapl-insider/blogs/${post.slug}`,
    ogImage: post.image,
    ogImageAlt: post.hero_image_alt ?? post.title,
    publishedTime: `${publishedDate(post.date)}T08:00:00+03:00`,
    author: post.author,
    keywords: [post.category, "land for sale Kilifi", "Inuka Afrika Properties", post.title],
  });

  return {
    ...fallback,
    ...live,
    keywords: fallback.keywords ?? live.keywords,
  };
}
