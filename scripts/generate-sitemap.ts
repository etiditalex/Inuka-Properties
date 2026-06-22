import { writeFileSync } from "fs";
import { resolve } from "path";
import { buildSitemapXml } from "../lib/sitemapEntries";

const target = resolve(process.cwd(), "public", "sitemap.xml");
writeFileSync(target, buildSitemapXml(), "utf8");
console.log(`Generated ${target}`);
