import type { SupabaseClient } from "@supabase/supabase-js";
import { STATIC_DOWNLOAD_ITEMS } from "@/lib/downloads/catalog";
import type { ImportResult } from "@/lib/content/importTypes";

export async function importCatalogDownloads(supabase: SupabaseClient): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const item of STATIC_DOWNLOAD_ITEMS) {
    const row = {
      id: item.id,
      title: item.title,
      file_url: item.file_url,
      parent_id: item.parent_id,
      sort_order: item.sort_order,
      published: true,
    };

    const { error } = await supabase.from("download_items").upsert(row, { onConflict: "id" });
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
