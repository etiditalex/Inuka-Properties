import { formatBlogArticleHtml } from "@/lib/blog/formatArticleHtml";

export default function BlogArticleBody({ html }: { html: string }) {
  const formatted = formatBlogArticleHtml(html);
  if (!formatted) return null;

  return (
    <div
      className="max-w-none"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}
