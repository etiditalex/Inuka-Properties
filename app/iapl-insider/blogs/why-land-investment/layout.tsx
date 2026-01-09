import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inukaproperties.co.ke'),
  title: "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate | Inuka Afrika Properties",
  description: "Discover why land investment is one of the smartest financial decisions you can make. Learn about land investment benefits, strategies, and opportunities in Kenya. Expert insights from Inuka Afrika Properties.",
  keywords: [
    "land investment",
    "real estate investment Kenya",
    "land for sale Kenya",
    "property investment",
    "land investment benefits",
    "real estate investment guide",
    "land investment opportunities",
    "property investment Kenya",
    "land investment strategy",
    "real estate wealth building"
  ],
  openGraph: {
    type: "article",
    locale: "en_KE",
    url: "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-land-investment",
    siteName: "Inuka Afrika Properties Limited",
    title: "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate",
    description: "Discover why land investment is one of the smartest financial decisions you can make. Learn about land investment benefits, strategies, and opportunities in Kenya.",
    images: [
      {
        url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767954926/why_land_investment_2_pryhrf.jpg",
        width: 1200,
        height: 630,
        alt: "Why Land Investment - Real Estate Investment Guide by Inuka Afrika Properties",
      },
    ],
    authors: ["IAPL Investment Team"],
    publishedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate",
    description: "Discover why land investment is one of the smartest financial decisions you can make. Learn about land investment benefits, strategies, and opportunities in Kenya.",
    images: ["https://res.cloudinary.com/dyfnobo9r/image/upload/v1767954926/why_land_investment_2_pryhrf.jpg"],
    creator: "@InukaAfrikaProperties",
  },
  alternates: {
    canonical: "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-land-investment",
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

export default function WhyLandInvestmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

