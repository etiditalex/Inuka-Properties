import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import {
  COASTAL_LOCATIONS,
  getCoastalLocation,
  relatedCoastalLocations,
  type CoastalLocation,
} from "@/lib/coastalSeo";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return COASTAL_LOCATIONS.map((location) => ({ slug: location.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const location = getCoastalLocation(params.slug);
  if (!location) return { title: "Area not found" };

  return buildPageMetadata({
    title: `Land & Plots for Sale in ${location.name}`,
    description: `${location.summary} Inuka Properties — ${location.county}.`,
    path: `/locations/${location.slug}`,
    keywords: location.keywords,
    geo:
      location.slug === "nyali" || location.slug === "mombasa"
        ? { latitude: -4.048, longitude: 39.709, placename: location.name }
        : undefined,
  });
}

function locationSchema(location: CoastalLocation) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Land and plots for sale in ${location.name}`,
    description: location.summary,
    about: {
      "@type": "Place",
      name: location.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: location.county,
      },
    },
    mainEntity: {
      "@type": "Service",
      name: `Inuka Properties land and plots in ${location.name}`,
      serviceType: "Real estate sales",
      areaServed: location.name,
      provider: {
        "@type": "RealEstateAgent",
        name: "Inuka Afrika Properties Limited",
        alternateName: "Inuka Properties",
        url: "https://www.inukaproperties.co.ke",
      },
    },
  };
}

export default function CoastalLocationPage({ params }: Props) {
  const location = getCoastalLocation(params.slug);
  if (!location) notFound();

  const related = relatedCoastalLocations(location);

  return (
    <div className="bg-white pb-20 pt-28">
      <JsonLd data={locationSchema(location)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Coastal areas", path: "/locations" },
          { name: location.name, path: `/locations/${location.slug}` },
        ])}
      />
      <div className="container mx-auto max-w-3xl px-4">
        <p className="font-montserrat text-sm font-semibold uppercase tracking-wide text-primary-700">
          {location.county}
        </p>
        <h1 className="mt-2 font-montserrat text-3xl font-bold text-dark-900 md:text-5xl">
          Land and plots for sale in {location.name}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-dark-700">{location.summary}</p>
        <p className="mt-4 leading-relaxed text-dark-600">{location.detail}</p>

        <ul className="mt-8 space-y-3">
          {location.highlights.map((item) => (
            <li key={item} className="flex gap-3 text-dark-800">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          {location.hasListings ? (
            <Link
              href={`/for-sale?area=${encodeURIComponent(location.searchQuery)}`}
              className="rounded-lg bg-primary-600 px-6 py-3 font-montserrat font-semibold text-white hover:bg-primary-700"
            >
              View {location.name} listings
            </Link>
          ) : (
            <Link
              href="/for-sale"
              className="rounded-lg bg-primary-600 px-6 py-3 font-montserrat font-semibold text-white hover:bg-primary-700"
            >
              See open coastal plots
            </Link>
          )}
          <Link
            href="/contact-us"
            className="rounded-lg border-2 border-primary-600 px-6 py-3 font-montserrat font-semibold text-primary-700 hover:bg-primary-50"
          >
            {location.hasListings ? "Talk to Inuka Properties" : `Ask about ${location.name}`}
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-14 border-t border-dark-100 pt-8">
            <h2 className="font-montserrat text-xl font-bold text-dark-900">Nearby searches</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/locations/${item.slug}`}
                    className="inline-block rounded-full border border-dark-200 px-4 py-2 text-sm font-medium text-dark-700 hover:border-primary-600 hover:text-primary-700"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
