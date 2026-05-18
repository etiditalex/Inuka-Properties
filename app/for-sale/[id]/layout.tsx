import type { Metadata } from "next";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { getPropertySeo, propertyDetailPath } from "@/lib/propertySeo";
import { buildPageMetadata, buildRealEstateListingSchema } from "@/lib/seo";

type Props = {
  children: ReactNode;
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  const property = getPropertySeo(id);

  if (!property) {
    return buildPageMetadata({
      title: "Property Not Found",
      description: "Browse land and property for sale in Kilifi County with Inuka Afrika Properties.",
      path: "/for-sale",
      noIndex: true,
    });
  }

  const path = propertyDetailPath(property.id);
  const title = `${property.title} | Land for Sale in ${property.location}`;
  const description = `${property.description} Price: ${property.price}. Title deed plots with flexible payment plans from Inuka Afrika Properties.`;

  return buildPageMetadata({
    title,
    description,
    path,
    keywords: [
      `${property.title} for sale`,
      `land for sale ${property.location}`,
      "plots for sale Kilifi County",
      "title deed land Kenya",
      "Inuka Afrika Properties",
    ],
    ogImage: property.image,
    ogImageAlt: `${property.title} — ${property.location}`,
    noIndex: property.soldOut,
  });
}

export default function PropertyDetailLayout({ children, params }: Props) {
  const id = Number(params.id);
  const property = getPropertySeo(id);

  const listingSchema =
    property &&
    buildRealEstateListingSchema({
      name: property.title,
      description: property.description,
      image: property.image,
      path: propertyDetailPath(property.id),
      price: property.price,
      location: property.location,
    });

  return (
    <>
      {listingSchema ? <JsonLd data={listingSchema} /> : null}
      {children}
    </>
  );
}
