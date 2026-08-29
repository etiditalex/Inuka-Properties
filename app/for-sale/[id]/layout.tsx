import type { Metadata } from "next";
import type { ReactNode } from "react";
import FacebookPixel from "@/components/FacebookPixel";
import FacebookAdLandingCapture from "@/components/FacebookAdLandingCapture";
import JsonLd from "@/components/JsonLd";
import PropertySeoBlock from "@/components/property/PropertySeoBlock";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID } from "@/lib/facebook/pixel";
import {
  getAllPropertyIds,
  getPropertySeo,
  propertyDetailPath,
} from "@/lib/propertySeo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPageMetadata,
  buildPropertyWebPageSchema,
  buildRealEstateListingSchema,
} from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: { id: string };
};

export function generateStaticParams() {
  return getAllPropertyIds().map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  const property = getPropertySeo(id);

  if (!property) {
    return buildPageMetadata({
      title: "Property Not Found",
      description:
        "Browse land and property for sale in Kilifi County with Inuka Afrika Properties.",
      path: "/for-sale",
      noIndex: true,
    });
  }

  const path = propertyDetailPath(property.id);
  const county = property.county ?? "Kilifi County";
  const title =
    property.seoTitle ??
    `${property.title} | Land for Sale in ${property.location}, ${county}`;
  const description =
    property.metaDescription ??
    `${property.description} Price: ${property.price}. Title deed plots with flexible payment plans from Inuka Afrika Properties.`;

  const defaultKeywords = [
    `${property.title} for sale`,
    `land for sale ${property.location}`,
    `plots for sale ${county}`,
    "title deed land Kenya",
    "Inuka Afrika Properties",
  ];

  return buildPageMetadata({
    title,
    description,
    path,
    keywords: property.keywords ?? defaultKeywords,
    ogImage: property.image,
    ogImageAlt: `${property.schemaName ?? property.title} — ${property.location}, ${county}`,
    noIndex: property.soldOut,
    exactTitle: property.exactSeoTitle,
    geo: property.geo
      ? {
          latitude: property.geo.latitude,
          longitude: property.geo.longitude,
          placename: property.location,
        }
      : undefined,
  });
}

export default function PropertyDetailLayout({ children, params }: Props) {
  const id = Number(params.id);
  const property = getPropertySeo(id);
  const path = property ? propertyDetailPath(property.id) : "/for-sale";

  const listingSchema =
    property &&
    buildRealEstateListingSchema({
      name: property.schemaName ?? property.h1 ?? property.title,
      alternateName: property.schemaName ? property.title : undefined,
      description: property.metaDescription ?? property.description,
      image: property.gallery ?? property.image,
      path,
      price: property.price,
      priceAmount: property.priceAmount,
      location: property.location,
      county: property.county,
      geo: property.geo,
      availability: property.soldOut ? "SoldOut" : "InStock",
      keywords: property.keywords,
      datePosted: property.datePosted,
      additionalProperty: property.additionalProperty,
      highPrice: property.highPrice,
    });

  const webPageSchema = property
    ? buildPropertyWebPageSchema({
        name: property.schemaName ?? property.seoTitle ?? property.title,
        description: property.metaDescription ?? property.description,
        path,
        image: property.image,
        keywords: property.keywords,
        location: property.location,
        county: property.county,
      })
    : null;

  const breadcrumbSchema = property
    ? buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Properties for Sale", path: "/for-sale" },
        { name: property.schemaName ?? property.title, path },
      ])
    : null;

  const faqSchema =
    property?.faq && property.faq.length > 0
      ? buildFaqSchema(property.faq)
      : null;

  const trackFacebookPixel = id === FACEBOOK_CAMPAIGN_PROPERTY_ID;

  return (
    <>
      <FacebookAdLandingCapture />
      {trackFacebookPixel ? (
        <FacebookPixel propertyId={id} pagePath={path} />
      ) : null}
      {listingSchema ? <JsonLd data={listingSchema} /> : null}
      {webPageSchema ? <JsonLd data={webPageSchema} /> : null}
      {breadcrumbSchema ? <JsonLd data={breadcrumbSchema} /> : null}
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      {children}
      {property ? <PropertySeoBlock propertyId={id} /> : null}
    </>
  );
}
