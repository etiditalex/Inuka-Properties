import fs from "fs";

const s = fs.readFileSync("app/for-sale/page.tsx", "utf8");
const m = s.match(/const properties: Property\[\] = (\[[\s\S]*?\n\]);/);
if (!m) {
  console.error("no match");
  process.exit(1);
}

const header = `export type PropertyType = "all" | "residential" | "commercial" | "beach" | "farm" | "affordable";

export interface CatalogProperty {
  id: number;
  title: string;
  location: string;
  type: PropertyType | string;
  price: string;
  size: string;
  bedrooms?: number;
  image: string;
  featured?: boolean;
  status?: "available" | "ongoing" | "sold";
  features?: string[];
}

export const STATIC_PROPERTY_CATALOG: CatalogProperty[] = `;

fs.writeFileSync("lib/properties/catalog.ts", header + m[1] + ";\n");
console.log("catalog extracted");
