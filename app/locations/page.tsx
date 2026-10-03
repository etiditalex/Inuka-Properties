import type { Metadata } from "next";
import Link from "next/link";
import { COASTAL_LOCATIONS } from "@/lib/coastalSeo";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Land & Plots in Mombasa, Kilifi and Kwale",
  description:
    "Inuka Properties covers land, plots, and property searches in Mombasa, Kilifi, and Kwale, including Kikambala, Bofa, Chumani, Msabaha, Malindi, and Diani.",
  path: "/locations",
  keywords: [
    "Inuka Properties",
    "land for sale Mombasa",
    "plots for sale Kilifi",
    "land for sale Kwale",
    "plots for sale Diani",
    "land for sale Kikambala",
  ],
});

export default function LocationsPage() {
  return (
    <div className="bg-white pb-20 pt-28">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="font-montserrat text-3xl font-bold text-dark-900 md:text-5xl">
          Coastal land and plots
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-dark-600">
          Inuka Properties helps buyers looking for land, plots, and property in Mombasa, Kilifi, and Kwale.
          Open projects are listed by town so you can compare Kikambala, Bofa, Chumani, Msabaha, Malindi, Diani, and the rest of the coast.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COASTAL_LOCATIONS.map((location) => (
            <li key={location.slug}>
              <Link
                href={`/locations/${location.slug}`}
                className="block h-full rounded-xl border border-dark-200 p-5 transition hover:border-primary-600 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                  {location.county}
                </p>
                <h2 className="mt-1 font-montserrat text-xl font-bold text-dark-900">{location.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dark-600">{location.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
