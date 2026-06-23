/**
 * Seed all static properties into Supabase.
 * Usage: npm run seed:properties
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "../lib/supabase/env";
import { importCatalogProperties } from "../lib/properties/importCatalog";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = getSupabaseUrl();
const key = getSupabaseServiceRoleKey();

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log("Importing website listings into Supabase...");
  const result = await importCatalogProperties(supabase);
  result.titles.forEach((title) => console.log(`✓ ${title}`));
  result.errors.forEach((err) => console.error(`✗ ${err}`));
  console.log(`Done. Imported ${result.imported}, failed ${result.failed}.`);
}

main();
