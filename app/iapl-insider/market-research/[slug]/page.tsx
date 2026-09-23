import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleBody from "@/components/blog/BlogArticleBody";
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import { fetchPublishedBlogBySlug } from "@/lib/content/publishedBlogs";
import { isMarketResearchPost } from "@/lib/market-research/catalog";
import { buildArticleMetadata, buildBlogPostingSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPublishedBlogBySlug(params.slug);
  if (!post || !isMarketResearchPost(post.category)) {
    return { title: "Article not found", robots: { index: false, follow: true } };
  }

  return buildArticleMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/iapl-insider/market-research/${post.slug}`,
    ogImage: post.image,
    ogImageAlt: post.hero_image_alt ?? post.title,
    publishedTime: `${post.date}T08:00:00+03:00`,
    author: post.author,
    keywords: [post.category, "Kilifi property research", "Inuka Afrika Properties", post.title],
  });
}

export default async function MarketResearchArticlePage({ params }: Props) {
  const post = await fetchPublishedBlogBySlug(params.slug);
  if (!post || !isMarketResearchPost(post.category)) notFound();

  const articleSchema = buildBlogPostingSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    path: `/iapl-insider/market-research/${post.slug}`,
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
      archiveHref="/iapl-insider/market-research"
      archiveLabel="Back to market research"
      sectionName="Market Research"
    >
      <BlogArticleBody html={post.content_html || post.excerpt} />
    </BlogArticleLayout>
  );
}
