import type { Metadata } from "next";
import type { ReactNode } from "react";

const HERO =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934535/Tulivu_haven_7_znzmct.jpg";

const CANONICAL =
  "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-mariakani-is-new-property-hotspot-kilifi";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inukaproperties.co.ke"),
  title:
    "Why Mariakani is the New Property Hotspot in Kilifi | Inuka Afrika Properties",
  description:
    "Discover why Mariakani is Kilifi County's fastest-growing property investment destination — affordable land, highway access, infrastructure growth, and Tulivu Haven plots from Inuka Afrika Properties.",
  keywords: [
    "property for sale Mariakani",
    "land for sale Mariakani Kilifi",
    "Mariakani real estate investment",
    "plots for sale Mariakani",
    "affordable land near Mombasa",
    "Kilifi County property hotspot",
    "Tulivu Haven Kibao Kiche",
    "Mariakani Mavueni bypass land",
    "land investment Kenya coast",
    "Inuka Afrika Properties Mariakani",
  ],
  openGraph: {
    type: "article",
    locale: "en_KE",
    url: CANONICAL,
    siteName: "Inuka Afrika Properties Limited",
    title: "Why Mariakani is the New Property Hotspot in Kilifi",
    description:
      "Mariakani is transforming into one of Kilifi County's most promising real estate destinations. Learn why smart investors are buying land today.",
    images: [
      {
        url: HERO,
        width: 1200,
        height: 630,
        alt: "Mariakani town along Mombasa–Nairobi Highway — Kilifi County property investment",
      },
    ],
    authors: ["IAPL Investment Team"],
    publishedTime: "2026-06-20T08:00:00+03:00",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Mariakani is the New Property Hotspot in Kilifi",
    description:
      "Affordable land, infrastructure growth, and strong returns — why Mariakani is Kilifi's next property frontier.",
    images: [HERO],
    creator: "@InukaAfrikaProperties",
  },
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function WhyMariakaniPropertyHotspotLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
