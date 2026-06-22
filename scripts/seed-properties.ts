/**
 * Seed all static properties into Supabase.
 * Usage: npx tsx scripts/seed-properties.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { STATIC_PROPERTY_CATALOG } from "../lib/properties/catalog";
import { PROPERTY_DETAILS } from "../lib/properties/detailFallback";
import { mapDetailToDbRow } from "../lib/properties/mapProperty";
import { PROPERTY_SEO } from "../lib/propertySeo";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log(`Seeding ${STATIC_PROPERTY_CATALOG.length} properties...`);

  for (const catalog of STATIC_PROPERTY_CATALOG) {
    const detail = PROPERTY_DETAILS[catalog.id] as Record<string, unknown> | undefined;
    const seo = PROPERTY_SEO.find((p) => p.id === catalog.id);

    const merged = {
      id: catalog.id,
      title: catalog.title,
      h1: (detail?.h1 as string) ?? seo?.h1,
      location: catalog.location,
      type: catalog.type,
      price: catalog.price,
      size: catalog.size,
      image: catalog.image,
      imageAltPrefix: detail?.imageAltPrefix as string | undefined,
      mapLink: (detail?.mapLink as string) ?? seo?.mapLink,
      gallery: (detail?.gallery as string[]) ?? seo?.gallery ?? [catalog.image],
      description: (detail?.description as string) ?? seo?.description,
      features: catalog.features ?? (detail?.features as string[]) ?? [],
      pricing: (detail?.pricing as Record<string, string>) ?? {},
      paymentPlan: detail?.paymentPlan as Record<string, string> | undefined,
      quickInfo: detail?.quickInfo as Record<string, string> | undefined,
      status: catalog.status,
    };

    const row = {
      ...mapDetailToDbRow(merged, catalog),
      total_units: catalog.id === 12 ? 72 : 0,
      sold_units: 0,
      auto_sold_out: catalog.id === 12,
      price_amount: seo?.priceAmount ?? (parseInt(catalog.price.replace(/[^\d]/g, ""), 10) || null),
    };

    const { error } = await supabase.from("properties").upsert(row, { onConflict: "id" });
    if (error) {
      console.error(`Failed id=${catalog.id}:`, error.message);
    } else {
      console.log(`✓ ${catalog.title} (id ${catalog.id})`);
    }
  }

  console.log("Done.");
}

main();
