import { writeFileSync } from "fs";
import { resolve } from "path";
import { buildSitemapXml } from "../lib/sitemapEntries";

async function main() {
  const target = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(target, await buildSitemapXml(), "utf8");
  console.log(`Generated ${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
