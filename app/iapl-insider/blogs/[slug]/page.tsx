import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import {
  fetchPublishedBlogBySlug,
  fetchPublishedBlogSummaries,
} from "@/lib/content/publishedBlogs";
import { BLOG_ARTICLE_SLUGS } from "@/lib/blogPosts";
import { buildArticleMetadata, buildBlogPostingSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await fetchPublishedBlogSummaries();
  return posts
    .filter((post) => !BLOG_ARTICLE_SLUGS.has(post.slug))
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPublishedBlogBySlug(params.slug);
  if (!post) {
    return { title: "Article not found", robots: { index: false, follow: true } };
  }

  return buildArticleMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/iapl-insider/blogs/${post.slug}`,
    ogImage: post.image,
    ogImageAlt: post.hero_image_alt ?? post.title,
    publishedTime: `${post.date}T08:00:00+03:00`,
    author: post.author,
    keywords: [post.category, "land for sale Kilifi", "Inuka Afrika Properties", post.title],
  });
}

export default async function DynamicBlogArticlePage({ params }: Props) {
  const post = await fetchPublishedBlogBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = buildBlogPostingSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    path: `/iapl-insider/blogs/${post.slug}`,
    datePublished: post.date,
  });

  return (
    <BlogArticleLayout
      currentSlug={post.slug}
      title={post.title}
      heroTitle={post.hero_title ?? undefined}
      heroImage={post.image}
      heroImageAlt={post.hero_image_alt ?? post.title}
      category={post.category}
      author={post.author}
      publishedIso={post.date}
      articleSchema={articleSchema}
    >
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content_html || `<p>${post.excerpt}</p>` }}
      />
    </BlogArticleLayout>
  );
}
