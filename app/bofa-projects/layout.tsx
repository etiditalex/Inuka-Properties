import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { FEATURED_SITELINK_PAGES } from "@/lib/featuredProjects";
import { getPropertySeo, propertyDetailPath } from "@/lib/propertySeo";
import {
  SITE_NAME,
  absoluteUrl,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPageMetadata,
} from "@/lib/seo";

const PATH = "/bofa-projects";
const PAGE = FEATURED_SITELINK_PAGES.find((page) => page.href === PATH)!;

export const metadata = buildPageMetadata({
  title: "Bofa Projects | Land & Beach Plots for Sale in Kilifi",
  description: PAGE.description,
  path: PATH,
  exactTitle: true,
  keywords: [
    "Bofa projects",
    "Bofa Platinum",
    "Bofa Phase 21",
    "land for sale Bofa Kilifi",
    "beach plots Bofa",
    "Bofa Road properties",
    "Inuka Afrika Properties Bofa",
  ],
  ogImage: getPropertySeo(1)?.image,
  ogImageAlt: "Bofa Platinum and Bofa Phase 21 — Inuka Afrika Properties",
  geo: {
    latitude: -3.5985,
    longitude: 39.878,
    placename: "Bofa, Kilifi County",
  },
});

const listingSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Bofa Projects",
  url: absoluteUrl(PATH),
  description: PAGE.description,
  inLanguage: "en-KE",
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(),
  },
  about: {
    "@type": "Place",
    name: "Bofa, Kilifi County",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bofa",
      addressRegion: "Kilifi County",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -3.5985,
      longitude: 39.878,
    },
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Bofa property projects",
    numberOfItems: 2,
    itemListElement: [1, 8].map((id, index) => {
      const property = getPropertySeo(id);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: property?.title,
        url: absoluteUrl(propertyDetailPath(id)),
      };
    }),
  },
};

const faqSchema = buildFaqSchema([
  {
    question: "What Bofa projects does Inuka Afrika Properties sell?",
    answer:
      "Inuka Afrika Properties offers Bofa Platinum, a gated beachfront community 30 metres from the beach on Bofa Road, and Bofa Phase 21, 1/8-acre plots on tarmacked Bofa Road (B69) with water, electricity, and a perimeter fence.",
  },
  {
    question: "Where are the Bofa projects in Kilifi County?",
    answer:
      "Both projects are in Bofa, Kilifi County. Bofa Platinum sits on Bofa Road about 30 metres from the sandy beach and 4km from Kilifi Town. Bofa Phase 21 is off the newly tarmacked Bofa Road (B69).",
  },
  {
    question: "How do I buy a plot in Bofa?",
    answer:
      "Call or WhatsApp 0711 082 084, email info@inukaproperties.co.ke, or book a free site visit. Bofa Phase 21 plots are KES 1,850,000 with a KES 700,000 deposit. Bofa Platinum 1/8-acre plots start from KES 2,990,000.",
  },
]);

export default function BofaProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={listingSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Properties for Sale", path: "/for-sale" },
          { name: "Bofa Projects", path: PATH },
        ])}
      />
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
