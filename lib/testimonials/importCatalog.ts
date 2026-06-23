import type { SupabaseClient } from "@supabase/supabase-js";
import { STATIC_TESTIMONIALS } from "@/lib/testimonials/catalog";
import type { ImportResult } from "@/lib/content/importTypes";

export async function importCatalogTestimonials(supabase: SupabaseClient): Promise<ImportResult> {
  const result: ImportResult = { imported: 0, failed: 0, errors: [], titles: [] };

  for (const item of STATIC_TESTIMONIALS) {
    const row = {
      id: item.id,
      name: item.name,
      location: item.location,
      property: item.property,
      rating: item.rating,
      text: item.text,
      image: item.image,
      sort_order: item.sort_order,
      published: true,
    };

    const { error } = await supabase.from("client_testimonials").upsert(row, { onConflict: "id" });
    if (error) {
      result.failed += 1;
      result.errors.push(`${item.name}: ${error.message}`);
    } else {
      result.imported += 1;
      result.titles.push(item.name);
    }
  }

  return result;
}
