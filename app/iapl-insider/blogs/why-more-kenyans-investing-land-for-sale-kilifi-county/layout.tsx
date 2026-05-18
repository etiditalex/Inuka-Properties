import type { Metadata } from "next";
import type { ReactNode } from "react";

const HERO =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767954926/why_land_investment_2_pryhrf.jpg";

const CANONICAL =
  "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-more-kenyans-investing-land-for-sale-kilifi-county";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inukaproperties.co.ke"),
  title:
    "Why More Kenyans Are Investing in Land for Sale in Kilifi County | Inuka Afrika Properties",
  description:
    "Discover why land for sale in Kilifi County is attracting Kenyan investors. Affordable plots, title deed security, Tezo, Msabaha, Matsangoni, and flexible installment plans from Inuka Afrika Properties Ltd.",
  keywords: [
    "land for sale in Kilifi County",
    "affordable plots in Kilifi",
    "buy land in Kilifi Kenya",
    "title deed plots for sale in Kilifi",
    "Kilifi real estate investment",
    "plots for sale in Tezo",
    "installment land payment in Kilifi",
    "property for sale in Kilifi",
    "cheap land near Mombasa",
    "genuine land selling companies in Kenya",
  ],
  openGraph: {
    type: "article",
    locale: "en_KE",
    url: CANONICAL,
    siteName: "Inuka Afrika Properties Limited",
    title: "Why More Kenyans Are Investing in Land for Sale in Kilifi County",
    description:
      "The demand for land for sale in Kilifi County continues to rise. Learn why investors choose Kilifi and how Inuka Afrika Properties Ltd can help.",
    images: [
      {
        url: HERO,
        width: 1200,
        height: 630,
        alt: "Land for sale in Kilifi County — coastal land investment Kenya",
      },
    ],
    authors: ["IAPL Investment Team"],
    publishedTime: "2026-05-18T08:00:00+03:00",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why More Kenyans Are Investing in Land for Sale in Kilifi County",
    description:
      "Affordable coastal plots, title deeds, and flexible payment plans in Kilifi County.",
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

export default function WhyMoreKenyansInvestingLandKilifiLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
