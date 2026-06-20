import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site";

export const SITE_NAME = "Inuka Afrika Properties Limited";
export const SITE_SHORT_NAME = "Inuka Afrika Properties";
export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg";

const DEFAULT_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${SITE_ORIGIN}${normalized}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = `${SITE_NAME} Logo`,
  ogType = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_SHORT_NAME)
    ? title
    : `${title} | ${SITE_SHORT_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      type: ogType,
      locale: "en_KE",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : DEFAULT_ROBOTS,
  };
}

type ArticleMetadataOptions = PageMetadataOptions & {
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
};

export function buildArticleMetadata({
  title,
  description,
  path,
  keywords,
  ogImage,
  ogImageAlt,
  publishedTime,
  modifiedTime,
  author = "IAPL Investment Team",
}: ArticleMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const base = buildPageMetadata({
    title,
    description,
    path,
    keywords,
    ogImage,
    ogImageAlt,
    ogType: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime,
      modifiedTime: modifiedTime ?? publishedTime,
      authors: [author],
    },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE_NAME,
  alternateName: "IAPL",
  url: SITE_ORIGIN,
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  description:
    "Leading real estate company in Kenya specializing in affordable residential, commercial, and beach properties in Kilifi County. 10 years of excellence in property solutions.",
  foundingDate: "2016",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Links Road Opposite Kigothos Hotel",
    addressLocality: "Nyali",
    addressRegion: "Mombasa",
    postalCode: "80100",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -4.048,
    longitude: 39.709,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254-711-082084",
    contactType: "Customer Service",
    email: "info@inukaproperties.co.ke",
    areaServed: "KE",
    availableLanguage: ["en", "sw"],
  },
  sameAs: [
    "https://www.facebook.com/InukaAfrikaProperties",
    "https://www.instagram.com/inukafrikaproperties",
    "https://www.linkedin.com/company/inuka-afrika-properties-limited",
  ],
  areaServed: [
    "Kilifi",
    "Mariakani",
    "Mtwapa",
    "Kikambala",
    "Bofa",
    "Chumani",
    "Tezo",
    "Msabaha",
    "Mtondia",
    "Malindi",
    "Nyali",
    "Mombasa",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_ORIGIN,
  description:
    "Land and property for sale in Kilifi County, Kenya — Mariakani, Mtwapa, Kikambala, Tezo, Malindi, and the Kenyan coast.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_ORIGIN}/for-sale?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildBlogPostingSchema(options: {
  headline: string;
  description: string;
  image: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}): Record<string, unknown> {
  const pageUrl = absoluteUrl(options.path);
  const published = `${options.datePublished}T08:00:00+03:00`;
  const modified = `${options.dateModified ?? options.datePublished}T08:00:00+03:00`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.headline,
    description: options.description,
    image: options.image,
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };
}

export function buildRealEstateListingSchema(options: {
  name: string;
  description: string;
  image: string | string[];
  path: string;
  price: string;
  priceAmount?: number;
  location: string;
  county?: string;
  geo?: { latitude: number; longitude: number };
  availability?: "InStock" | "SoldOut";
}): Record<string, unknown> {
  const images = Array.isArray(options.image) ? options.image : [options.image];
  const parsed = Number(String(options.price).replace(/[^\d]/g, ""));
  const numericPrice =
    options.priceAmount ?? (parsed > 0 ? parsed : undefined);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: options.name,
    description: options.description,
    image: images,
    url: absoluteUrl(options.path),
    datePosted: new Date().toISOString().split("T")[0],
    offers: {
      "@type": "Offer",
      ...(numericPrice ? { price: numericPrice } : { price: options.price }),
      priceCurrency: "KES",
      availability:
        options.availability === "SoldOut"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: {
        "@type": "RealEstateAgent",
        name: SITE_NAME,
        url: SITE_ORIGIN,
      },
    },
    ...(options.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: options.geo.latitude,
            longitude: options.geo.longitude,
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: options.location,
      addressRegion: options.county ?? "Kilifi County",
      addressCountry: "KE",
    },
  };
}

export function buildFaqSchema(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
