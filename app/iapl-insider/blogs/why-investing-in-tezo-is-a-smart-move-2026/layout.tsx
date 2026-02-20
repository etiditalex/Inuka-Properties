import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inukaproperties.co.ke"),
  title:
    "Why Investing in Tezo Is a Smart Move in 2026 | Inuka Afrika Properties",
  description:
    "Discover why Tezo is emerging as a high-growth real estate hotspot in 2026 — from infrastructure and coastal demand to investor-friendly pricing. Spotlight on Inuka Afrika Properties’ new Tezo project.",
  keywords: [
    "Invest in Tezo Kenya",
    "Tezo real estate investment",
    "Inuka Afrika Properties Tezo project",
    "land for sale in Tezo",
    "coastal property Kenya",
    "Kilifi land investment",
    "affordable coastal land Kenya",
    "Tezo property opportunities",
    "Tezo plots",
    "Kilifi County real estate",
    "coastal land investment Kenya",
  ],
  openGraph: {
    type: "article",
    locale: "en_KE",
    url: "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-investing-in-tezo-is-a-smart-move-2026",
    siteName: "Inuka Afrika Properties Limited",
    title:
      "Why Investing in Tezo Is a Smart Move in 2026: Spotlight on Inuka Afrika Properties’ New Project",
    description:
      "Tezo is quickly becoming one of Kenya’s most promising coastal investment destinations. Learn what’s driving growth and why early investors are moving in now.",
    images: [
      {
        url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771578534/WhatsApp_Image_2026-02-16_at_10.12.29_zor4t2.jpg",
        width: 1200,
        height: 630,
        alt: "Why Investing in Tezo Is a Smart Move in 2026 - Inuka Afrika Properties",
      },
    ],
    authors: ["IAPL Investment Team"],
    publishedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Why Investing in Tezo Is a Smart Move in 2026 | Inuka Afrika Properties",
    description:
      "Tezo is emerging as a high-growth real estate hotspot in 2026. Explore the key drivers and opportunities for investors and homebuyers.",
    images: [
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771578534/WhatsApp_Image_2026-02-16_at_10.12.29_zor4t2.jpg",
    ],
    creator: "@InukaAfrikaProperties",
  },
  alternates: {
    canonical:
      "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-investing-in-tezo-is-a-smart-move-2026",
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

export default function WhyInvestingInTezoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

