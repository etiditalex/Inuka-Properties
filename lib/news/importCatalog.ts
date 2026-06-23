import type { SupabaseClient } from "@supabase/supabase-js";
import { STATIC_NEWS_CATALOG } from "@/lib/news/catalog";
import type { ImportResult } from "@/lib/content/importTypes";

export async function importCatalogNews(supabase: SupabaseClient): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const item of STATIC_NEWS_CATALOG) {
    const row = {
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      published_at: item.date,
      category: item.category,
      image: item.image,
      featured: item.featured,
      details: item.details ?? [],
      status: "published" as const,
    };

    const { error } = await supabase.from("news_items").upsert(row, { onConflict: "id" });
    if (error) {
      result.failed += 1;
      result.errors.push(`${item.title}: ${error.message}`);
    } else {
      result.imported += 1;
      result.titles.push(item.title);
    }
  }

  return result;
}
