import type { Metadata } from "next";
import type { ReactNode } from "react";

const HERO =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778739554/land_for_sale_in_kikambala_u9t8mn.jpg";

const CANONICAL =
  "https://www.inukaproperties.co.ke/iapl-insider/blogs/land-for-sale-near-kikambala";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inukaproperties.co.ke"),
  title:
    "Land for Sale Near Kikambala | Coastal Plots Kilifi County | Inuka Afrika Properties",
  description:
    "Land for sale near Kikambala, Kilifi County: prime coastal plots, verified titles, Mombasa–Malindi corridor access, and investment outlook. Expert guidance from Inuka Afrika Properties.",
  keywords: [
    "land for sale near Kikambala",
    "Kikambala land for sale",
    "plots for sale Kikambala",
    "land for sale Kilifi County",
    "coastal land for sale Kenya",
    "buy land near Mtwapa",
    "Kilifi plots for sale",
    "affordable land Kikambala",
    "title deed land Kilifi",
    "real estate Kikambala Kenya",
    "North Coast Kenya land investment",
    "land banking Kilifi County",
  ],
  openGraph: {
    type: "article",
    locale: "en_KE",
    url: CANONICAL,
    siteName: "Inuka Afrika Properties Limited",
    title:
      "Land for Sale Near Kikambala: Prime Coastal Plots & Investment Outlook",
    description:
      "Discover why land for sale near Kikambala is attracting buyers and investors along Kenya’s North Coast—and how to buy with confidence.",
    images: [
      {
        url: HERO,
        width: 1200,
        height: 630,
        alt: "Land for sale near Kikambala — coastal plots in Kilifi County",
      },
    ],
    authors: ["IAPL Investment Team"],
    publishedTime: "2026-05-14T08:00:00+03:00",
  },
  twitter: {
    card: "summary_large_image",
    title: "Land for Sale Near Kikambala | Coastal Plots Kilifi County",
    description:
      "Prime coastal plots, verified titles, and strong North Coast demand—your guide to land for sale near Kikambala.",
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

export default function LandForSaleNearKikambalaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
