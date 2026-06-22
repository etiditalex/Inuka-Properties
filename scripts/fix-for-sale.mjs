import fs from "fs";

const path = "app/for-sale/page.tsx";
const content = fs.readFileSync(path, "utf8");

const marker = "];\n\nexport default function ForSalePage()";
const idx = content.indexOf(marker);
if (idx === -1) {
  console.error("marker not found");
  process.exit(1);
}

const head = content.slice(0, content.indexOf("export default function ForSalePage()"));
const tail = content.slice(idx + marker.length);

const body = `
export default function ForSalePage() {
  const [properties, setProperties] = useState<Property[]>(STATIC_PROPERTY_CATALOG as Property[]);
  const [filter, setFilter] = useState<PropertyType>("all");
  useEffect(() => {
    fetch("/api/content/properties")
      .then((r) => r.json())
      .then((data) => {
        if (data.properties?.length) setProperties(data.properties);
      })
      .catch(() => {});
  }, []);
${tail}`;

const fixed = head.trimEnd() + "\n\n" + body.trimStart();
fs.writeFileSync(path, fixed);
console.log("fixed for-sale page");
