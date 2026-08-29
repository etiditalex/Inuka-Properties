import type { Metadata } from "next";
import {
  FEATURED_SITELINK_PAGES,
  GOOGLE_MAPS_PLACE_URL,
  OFFICE_MAPS_SEARCH_URL,
} from "@/lib/featuredProjects";
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
  exactTitle?: boolean;
  geo?: { latitude: number; longitude: number; placename?: string };
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
  exactTitle = false,
  geo,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle =
    exactTitle || title.includes(SITE_SHORT_NAME)
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
    ...(geo
      ? {
          other: {
            "geo.region": "KE-03",
            "geo.placename": geo.placename ?? "Kilifi County",
            "geo.position": `${geo.latitude};${geo.longitude}`,
            ICBM: `${geo.latitude}, ${geo.longitude}`,
          },
        }
      : {}),
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
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${SITE_ORIGIN}/#organization`,
  name: SITE_NAME,
  alternateName: ["IAPL", "Inuka Afrika Properties", "Inuka Properties"],
  url: SITE_ORIGIN,
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  description:
    "Leading real estate company in Kenya specializing in affordable residential, commercial, and beach properties in Kilifi County. 10 years of excellence in property solutions.",
  foundingDate: "2016",
  telephone: "+254-711-082084",
  email: "info@inukaproperties.co.ke",
  priceRange: "KES",
  currenciesAccepted: "KES",
  paymentAccepted: "Cash, Bank Transfer, M-Pesa, Installment Plan",
  hasMap: GOOGLE_MAPS_PLACE_URL,
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
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
    GOOGLE_MAPS_PLACE_URL,
    OFFICE_MAPS_SEARCH_URL,
  ],
  areaServed: [
    { "@type": "AdministrativeArea", name: "Kilifi County" },
    { "@type": "City", name: "Mariakani" },
    { "@type": "City", name: "Mtwapa" },
    { "@type": "Place", name: "Kikambala" },
    { "@type": "Place", name: "Bofa" },
    { "@type": "Place", name: "Chumani" },
    { "@type": "Place", name: "Tezo" },
    { "@type": "Place", name: "Msabaha" },
    { "@type": "Place", name: "Mtondia" },
    { "@type": "City", name: "Malindi" },
    { "@type": "City", name: "Nyali" },
    { "@type": "City", name: "Mombasa" },
  ],
  knowsAbout: [
    "Land for sale in Kilifi County",
    "Plots for sale in Mariakani",
    "Land for sale in Tezo",
    "Bofa beach plots",
    "Malindi Airport Gardens",
    "Tulivu Haven",
    "Miliki Tezo na Inuka",
    "Affordable housing Kenya coast",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Featured land and plots for sale",
    itemListElement: FEATURED_SITELINK_PAGES.map((page, index) => ({
      "@type": "Offer",
      position: index + 1,
      url: absoluteUrl(page.href),
      itemOffered: {
        "@type": "RealEstateListing",
        name: page.name,
        description: page.description,
        url: absoluteUrl(page.href),
        areaServed: {
          "@type": "Place",
          name: page.location,
        },
      },
    })),
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  name: SITE_NAME,
  url: SITE_ORIGIN,
  description:
    "Land and property for sale in Kilifi County, Kenya — Mariakani, Mtwapa, Kikambala, Tezo, Malindi, Bofa, and the Kenyan coast.",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
    },
  },
  inLanguage: "en-KE",
  hasPart: FEATURED_SITELINK_PAGES.map((page) => ({
    "@type": "WebPage",
    name: page.name,
    url: absoluteUrl(page.href),
    description: page.description,
  })),
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_ORIGIN}/for-sale?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** Hidden JSON-LD used to signal important sitelink pages to Google. */
export const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Inuka Afrika Properties key pages",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: FEATURED_SITELINK_PAGES.length + 4,
  itemListElement: [
    ...FEATURED_SITELINK_PAGES.map((page, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: page.name,
      url: absoluteUrl(page.href),
      description: page.description,
    })),
    {
      "@type": "SiteNavigationElement",
      position: FEATURED_SITELINK_PAGES.length + 1,
      name: "Properties for Sale",
      url: absoluteUrl("/for-sale"),
    },
    {
      "@type": "SiteNavigationElement",
      position: FEATURED_SITELINK_PAGES.length + 2,
      name: "About Us",
      url: absoluteUrl("/about-us"),
    },
    {
      "@type": "SiteNavigationElement",
      position: FEATURED_SITELINK_PAGES.length + 3,
      name: "Services",
      url: absoluteUrl("/services"),
    },
    {
      "@type": "SiteNavigationElement",
      position: FEATURED_SITELINK_PAGES.length + 4,
      name: "Testimonials",
      url: absoluteUrl("/testimonials"),
    },
  ],
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
  alternateName?: string;
  keywords?: string[];
  datePosted?: string;
  additionalProperty?: { name: string; value: string }[];
  highPrice?: number;
}): Record<string, unknown> {
  const images = Array.isArray(options.image) ? options.image : [options.image];
  const parsed = Number(String(options.price).replace(/[^\d]/g, ""));
  const numericPrice =
    options.priceAmount ?? (parsed > 0 ? parsed : undefined);
  const offerPrice = numericPrice
    ? options.highPrice && options.highPrice > numericPrice
      ? {
          "@type": "AggregateOffer",
          lowPrice: numericPrice,
          highPrice: options.highPrice,
          priceCurrency: "KES",
        }
      : {
          "@type": "Offer",
          price: numericPrice,
          priceCurrency: "KES",
        }
    : {
        "@type": "Offer",
        price: options.price,
        priceCurrency: "KES",
      };

  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateListing", "Product"],
    name: options.name,
    ...(options.alternateName ? { alternateName: options.alternateName } : {}),
    description: options.description,
    image: images,
    url: absoluteUrl(options.path),
    datePosted: options.datePosted ?? new Date().toISOString().split("T")[0],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    ...(options.keywords?.length ? { keywords: options.keywords.join(", ") } : {}),
    ...(options.additionalProperty?.length
      ? {
          additionalProperty: options.additionalProperty.map((item) => ({
            "@type": "PropertyValue",
            name: item.name,
            value: item.value,
          })),
        }
      : {}),
    offers: {
      ...offerPrice,
      availability:
        options.availability === "SoldOut"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      businessFunction: "http://purl.org/goodrelations/v1#Sell",
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
      streetAddress: options.location,
      addressLocality: options.location,
      addressRegion: options.county ?? "Kilifi County",
      addressCountry: "KE",
    },
    areaServed: [
      { "@type": "Place", name: options.location },
      { "@type": "AdministrativeArea", name: options.county ?? "Kilifi County" },
      { "@type": "Place", name: "Coastal Kenya" },
    ],
  };
}

export function buildPropertyWebPageSchema(options: {
  name: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  location?: string;
  county?: string;
}): Record<string, unknown> {
  const pageUrl = absoluteUrl(options.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: options.name,
    headline: options.name,
    description: options.description,
    inLanguage: "en-KE",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    about: {
      "@type": "Place",
      name: options.location ?? "Kilifi County",
      address: {
        "@type": "PostalAddress",
        addressLocality: options.location,
        addressRegion: options.county ?? "Kilifi County",
        addressCountry: "KE",
      },
    },
    ...(options.keywords?.length ? { keywords: options.keywords.join(", ") } : {}),
    ...(options.image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: options.image,
          },
        }
      : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "title", "meta[name='description']"],
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
