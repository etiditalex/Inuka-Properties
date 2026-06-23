import type { SupabaseClient } from "@supabase/supabase-js";
import { STATIC_NEWSLETTER_ISSUES } from "@/lib/newsletters/catalog";
import type { ImportResult } from "@/lib/content/importTypes";

export async function importCatalogNewsletters(supabase: SupabaseClient): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const item of STATIC_NEWSLETTER_ISSUES) {
    const row = {
      id: item.id,
      title: item.title,
      description: item.description,
      file_url: item.file_url,
      published_at: item.published_at,
      sort_order: item.sort_order,
      published: true,
    };

    const { error } = await supabase.from("newsletter_issues").upsert(row, { onConflict: "id" });
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
