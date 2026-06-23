import type { SupabaseClient } from "@supabase/supabase-js";
import { BLOG_POSTS } from "@/lib/blogPosts";
import type { ImportResult } from "@/lib/content/importTypes";

export async function importCatalogBlogs(supabase: SupabaseClient): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const post of BLOG_POSTS) {
    const row = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      published_at: post.date,
      image: post.image,
      category: post.category,
      slug: post.slug,
      status: "published" as const,
      hero_title: post.title,
      content_html: `<p>${post.excerpt}</p>`,
    };

    const { error } = await supabase.from("blog_posts").upsert(row, { onConflict: "id" });
    if (error) {
      result.failed += 1;
      result.errors.push(`${post.title}: ${error.message}`);
    } else {
      result.imported += 1;
      result.titles.push(post.title);
    }
  }

  return result;
}
