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
import { fetchPropertyDetail, fetchPublishedProperties } from "@/lib/properties/getProperties";
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

export async function generateStaticParams() {
  const liveIds = await fetchPublishedProperties()
    .then((properties) => properties.map((property) => property.id))
    .catch(() => [] as number[]);
  const ids = [...new Set([...getAllPropertyIds(), ...liveIds])];
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return buildPageMetadata({
      title: "Property Not Found",
      description:
        "Browse land and property for sale in Kilifi County with Inuka Afrika Properties.",
      path: "/for-sale",
      noIndex: true,
    });
  }

  const seo = getPropertySeo(id);
  const live = await fetchPropertyDetail(id).catch(() => null);

  if (!seo && !live) {
    return buildPageMetadata({
      title: "Property Not Found",
      description:
        "Browse land and property for sale in Kilifi County with Inuka Afrika Properties.",
      path: "/for-sale",
      noIndex: true,
    });
  }

  const path = propertyDetailPath(id);
  const location = live?.location || seo?.location || "Kilifi County";
  const county = seo?.county ?? "Kilifi County";
  const displayTitle = live?.title || seo?.title || "Property";
  const title =
    seo?.seoTitle && (!live || seo.title === live.title)
      ? seo.seoTitle
      : `${displayTitle} | Land for Sale in ${location}, ${county}`;
  const description =
    (seo?.metaDescription && (!live || seo.title === live.title)
      ? seo.metaDescription
      : null) ??
    live?.description ??
    seo?.description ??
    `Land for sale in ${location}. Title deed plots with flexible payment plans from Inuka Afrika Properties.`;

  const defaultKeywords = [
    `${live?.title || seo?.title} for sale`,
    `land for sale ${location}`,
    `plots for sale ${county}`,
    "title deed land Kenya",
    "Inuka Afrika Properties",
  ];

  return buildPageMetadata({
    title,
    description,
    path,
    keywords: seo?.keywords && (!live || seo.title === live.title) ? seo.keywords : defaultKeywords,
    ogImage: live?.image || seo?.image,
    ogImageAlt: `${displayTitle} — ${location}, ${county}`,
    exactTitle: Boolean(seo?.exactSeoTitle && (!live || seo.title === live.title)),
    geo: seo?.geo
      ? {
          latitude: seo.geo.latitude,
          longitude: seo.geo.longitude,
          placename: location,
        }
      : undefined,
  });
}

export default async function PropertyDetailLayout({ children, params }: Props) {
  const id = Number(params.id);
  const seo = getPropertySeo(id);
  const live = await fetchPropertyDetail(id).catch(() => null);
  const path = propertyDetailPath(id);
  const title = seo?.schemaName ?? seo?.h1 ?? live?.title ?? seo?.title;
  const description = seo?.metaDescription ?? live?.description ?? seo?.description ?? "";
  const image = live?.gallery?.length ? live.gallery : live?.image || seo?.gallery || seo?.image;
  const location = live?.location || seo?.location || "Kilifi County";
  const soldOut = seo?.soldOut || live?.status === "sold";

  const listingSchema =
    title &&
    buildRealEstateListingSchema({
      name: title,
      alternateName: seo?.schemaName ? seo.title : undefined,
      description,
      image: image || seo?.image || "",
      path,
      price: live?.price || seo?.price || "",
      priceAmount: seo?.priceAmount,
      location,
      county: seo?.county,
      geo: seo?.geo,
      availability: soldOut ? "SoldOut" : "InStock",
      keywords: seo?.keywords,
      datePosted: seo?.datePosted,
      additionalProperty: seo?.additionalProperty,
      highPrice: seo?.highPrice,
    });

  const webPageSchema = title
    ? buildPropertyWebPageSchema({
        name: seo?.schemaName ?? seo?.seoTitle ?? title,
        description,
        path,
        image: live?.image || seo?.image,
        keywords: seo?.keywords,
        location,
        county: seo?.county,
      })
    : null;

  const breadcrumbSchema = title
    ? buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Properties for Sale", path: "/for-sale" },
        { name: title, path },
      ])
    : null;

  const faqSchema =
    seo?.faq && seo.faq.length > 0 ? buildFaqSchema(seo.faq) : null;

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
      {seo ? <PropertySeoBlock propertyId={id} /> : null}
    </>
  );
}
