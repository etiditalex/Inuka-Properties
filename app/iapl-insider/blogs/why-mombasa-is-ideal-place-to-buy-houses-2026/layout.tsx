import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inukaproperties.co.ke'),
  title: "Why the Coastal region Is The Ideal Place To Buy Land In 2026 | Inuka Afrika Properties",
  description: "Discover why the Coastal region is the perfect destination to buy land in 2026. Explore Mariakani, Mtwapa, Kikambala, Kilifi, Malindi, Watamu, and Diani. Learn about infrastructure growth, affordable housing initiatives, and tourism opportunities. Expert insights from Inuka Afrika Properties.",
  keywords: [
    "buy land in Coastal region",
    "buy land Mombasa 2026",
    "land for sale Coastal Kenya",
    "Mariakani land for sale",
    "Mtwapa land",
    "Kikambala land",
    "Kilifi land for sale",
    "Malindi land",
    "Watamu land",
    "Diani land for sale",
    "Bofa land",
    "coastal land investment Kenya",
    "Mombasa land investment",
    "coastal real estate Kenya",
    "buy land Kenya 2026",
    "coastal land market",
    "land investment Coastal region",
    "coastal property investment",
    "Mombasa County land",
    "affordable land Kenya"
  ],
  openGraph: {
    type: "article",
    locale: "en_KE",
    url: "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-mombasa-is-ideal-place-to-buy-houses-2026",
    siteName: "Inuka Afrika Properties Limited",
    title: "Why the Coastal region Is The Ideal Place To Buy Land In 2026",
    description: "Discover why the Coastal region is the perfect destination to buy land in 2026. Explore Mariakani, Mtwapa, Kikambala, Kilifi, Malindi, Watamu, and Diani. Learn about infrastructure growth, affordable housing initiatives, and tourism opportunities.",
    images: [
      {
        url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768631111/mombasa_2_dazxqj.jpg",
        width: 1200,
        height: 630,
        alt: "Why the Coastal region Is The Ideal Place To Buy Land In 2026 - Inuka Afrika Properties",
      },
    ],
    authors: ["IAPL Investment Team"],
    publishedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Why the Coastal region Is The Ideal Place To Buy Land In 2026",
    description: "Discover why the Coastal region is the perfect destination to buy land in 2026. Explore Mariakani, Mtwapa, Kikambala, Kilifi, Malindi, Watamu, and Diani.",
    images: ["https://res.cloudinary.com/dyfnobo9r/image/upload/v1768631111/mombasa_2_dazxqj.jpg"],
    creator: "@InukaAfrikaProperties",
  },
  alternates: {
    canonical: "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-mombasa-is-ideal-place-to-buy-houses-2026",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function WhyMombasaIsIdealPlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
