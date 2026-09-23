import BlogArticleBody from "@/components/blog/BlogArticleBody";
import BlogArticleLayout, { type BlogArticleLayoutProps } from "@/components/blog/BlogArticleLayout";
import { blogContentIsEditorWritten, catalogPostUnchanged } from "@/lib/blog/editorContent";
import { fetchPublishedBlogBySlug, publishedDate } from "@/lib/content/publishedBlogs";
import { buildBlogPostingSchema } from "@/lib/seo";

export default async function BlogArticleGate(props: BlogArticleLayoutProps) {
  const post = await fetchPublishedBlogBySlug(props.currentSlug);
  if (!post || catalogPostUnchanged(post)) {
    return <BlogArticleLayout {...props} />;
  }

  const date = publishedDate(post.date);
  const articleSchema = buildBlogPostingSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.image || props.heroImage,
    path: `/iapl-insider/blogs/${post.slug}`,
    datePublished: date,
  });

  return (
    <BlogArticleLayout
      {...props}
      title={post.title}
      heroTitle={post.hero_title || props.heroTitle}
      heroImage={post.image || props.heroImage}
      heroImageAlt={post.hero_image_alt || post.title}
      category={post.category}
      author={post.author}
      publishedIso={date}
      articleSchema={articleSchema}
    >
      {blogContentIsEditorWritten(post) ? (
        <BlogArticleBody html={post.content_html || ""} />
      ) : (
        props.children
      )}
    </BlogArticleLayout>
  );
}
