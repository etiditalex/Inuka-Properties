import { BLOG_POSTS } from "@/lib/blogPosts";
import { publishedDate, type PublishedBlog } from "@/lib/content/publishedBlogs";

function normalizeHtml(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}

/** Import writes excerpt-only HTML. Anything else was saved from the admin editor. */
export function blogContentIsEditorWritten(post: Pick<PublishedBlog, "slug" | "excerpt" | "content_html">): boolean {
  const html = (post.content_html || "").trim();
  if (!html) return false;

  const catalog = BLOG_POSTS.find((item) => item.slug === post.slug);
  const stubs = new Set(
    [`<p>${post.excerpt}</p>`, catalog ? `<p>${catalog.excerpt}</p>` : ""]
      .filter(Boolean)
      .map(normalizeHtml)
  );
  return !stubs.has(normalizeHtml(html));
}

/** True when the published row still matches the hardcoded article. */
export function catalogPostUnchanged(post: PublishedBlog): boolean {
  const catalog = BLOG_POSTS.find((item) => item.slug === post.slug);
  if (!catalog) return false;
  return (
    catalog.title === post.title &&
    catalog.excerpt === post.excerpt &&
    catalog.image === post.image &&
    catalog.author === post.author &&
    catalog.category === post.category &&
    catalog.date === publishedDate(post.date) &&
    !blogContentIsEditorWritten(post)
  );
}
