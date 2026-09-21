import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getSitemapEntries } from "@/lib/sitemapEntries";

export const revalidate = 1800;

export const metadata: Metadata = buildPageMetadata({
  title: "Sitemap",
  description:
    "Browse every public page on Inuka Afrika Properties — land for sale in Kilifi County, services, blogs, and company information.",
  path: "/site-map",
  keywords: ["Inuka Afrika Properties sitemap", "land for sale Kilifi pages"],
});

function pathFromUrl(url: string) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function groupLabel(path: string) {
  if (path === "/") return "Home";
  if (path.startsWith("/for-sale") || path === "/project-showcase") return "Properties";
  if (path.startsWith("/iapl-insider")) return "IAPL Insider";
  if (path.startsWith("/about-us")) return "About";
  if (path.startsWith("/services")) return "Services";
  if (path.startsWith("/testimonials")) return "Testimonials";
  return "More pages";
}

export default async function HtmlSitemapPage() {
  const entries = await getSitemapEntries();
  const groups = new Map<string, { path: string; url: string }[]>();

  for (const entry of entries) {
    const path = pathFromUrl(entry.url);
    const label = groupLabel(path);
    const list = groups.get(label) || [];
    list.push({ path, url: entry.url });
    groups.set(label, list);
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 pb-20 pt-28">
      <h1 className="font-montserrat text-3xl font-bold text-dark-900 md:text-4xl">Sitemap</h1>
      <p className="mt-3 max-w-2xl text-dark-600">
        All public pages on Inuka Afrika Properties, grouped so visitors and search engines can find land listings,
        investment guides, and company information.
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {[...groups.entries()].map(([label, links]) => (
          <section key={label}>
            <h2 className="mb-3 font-montserrat text-lg font-semibold text-primary-700">{label}</h2>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.url}>
                  <Link href={link.path} className="text-dark-700 hover:text-primary-700 hover:underline">
                    {link.path === "/" ? "Home" : link.path}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
