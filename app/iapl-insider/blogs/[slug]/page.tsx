"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";
import { SITE_ORIGIN } from "@/lib/site";

type DynamicBlogPageProps = {
  params: { slug: string };
};

type BlogPostData = {
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  slug: string;
  content_html: string | null;
  hero_title: string | null;
  hero_image_alt: string | null;
};

export default function DynamicBlogArticlePage({ params }: DynamicBlogPageProps) {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetch(`/api/content/blogs/${encodeURIComponent(params.slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.post) {
          setPost(data.post);
        } else {
          setNotFoundState(true);
        }
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (notFoundState || !post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: `${post.published_at}T08:00:00+03:00`,
    dateModified: `${post.published_at}T08:00:00+03:00`,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "Inuka Afrika Properties Limited",
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/iapl-insider/blogs/${post.slug}`,
    },
  };

  return (
    <BlogArticleLayout
      currentSlug={post.slug}
      title={post.title}
      heroTitle={post.hero_title ?? undefined}
      heroImage={post.image}
      heroImageAlt={post.hero_image_alt ?? post.title}
      category={post.category}
      author={post.author}
      publishedIso={post.published_at}
      articleSchema={articleSchema}
    >
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content_html || `<p>${post.excerpt}</p>` }}
      />
    </BlogArticleLayout>
  );
}
