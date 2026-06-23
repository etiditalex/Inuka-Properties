import type { SupabaseClient } from "@supabase/supabase-js";
import { STATIC_GALLERY_VIDEOS } from "@/lib/videos/catalog";
import type { ImportResult } from "@/lib/content/importTypes";

export async function importCatalogVideos(supabase: SupabaseClient): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const item of STATIC_GALLERY_VIDEOS) {
    const row = {
      id: item.id,
      youtube_id: item.youtube_id,
      title: item.title,
      sort_order: item.sort_order,
      published: true,
    };

    const { error } = await supabase.from("gallery_videos").upsert(row, { onConflict: "id" });
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
