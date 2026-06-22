import type { Metadata } from "next";
import { Dancing_Script, Inter, Playfair_Display, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import AdminAwareWidgets from "@/components/AdminAwareWidgets";
import JsonLd from "@/components/JsonLd";
import {
  DEFAULT_OG_IMAGE,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import { SITE_ORIGIN } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Inuka Afrika Properties Limited | Real Estate in Kilifi, Mariakani, Mtwapa, Malindi",
    template: "%s | Inuka Afrika Properties"
  },
  description: "Leading real estate company in Kenya specializing in affordable residential, commercial, and beach properties in Kilifi County. Properties available in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi. 10 years of excellence in property solutions. Office located in Nyali, Mombasa.",
  keywords: [
    "real estate Kenya",
    "properties Kilifi",
    "land for sale Mariakani",
    "properties Mtwapa",
    "real estate Kikambala",
    "land for sale Bofa",
    "properties Chumani",
    "real estate Tezo",
    "properties Msabaha",
    "land for sale Mtondia",
    "real estate Malindi",
    "affordable housing Kilifi County",
    "beach properties Kenya",
    "commercial properties coastal Kenya",
    "residential plots Kilifi",
    "property for sale Nyali",
    "real estate developer Kenya",
    "title deed issuance Kenya",
    "property management Kenya",
    "affordable housing Kenya"
  ],
  authors: [{ name: "Inuka Afrika Properties Limited" }],
  creator: "Inuka Afrika Properties Limited",
  publisher: "Inuka Afrika Properties Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_ORIGIN,
    siteName: "Inuka Afrika Properties Limited",
    title: "Inuka Afrika Properties Limited | Real Estate in Coastal Kenya",
    description: "Leading real estate company in Kenya specializing in affordable residential, commercial, and beach properties in Kilifi County. Properties in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Inuka Afrika Properties Limited Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inuka Afrika Properties Limited | Real Estate in Coastal Kenya",
    description: "Leading real estate company in Kenya specializing in affordable properties in Kilifi County. 10 years of excellence.",
    images: [DEFAULT_OG_IMAGE],
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
  alternates: {
    canonical: SITE_ORIGIN,
  },
  category: "Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${dancingScript.variable}`}
    >
      <head>
        <link rel="icon" type="image/jpeg" href={DEFAULT_OG_IMAGE} />
        <link rel="apple-touch-icon" href={DEFAULT_OG_IMAGE} />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href={`${SITE_ORIGIN}/sitemap.xml`}
        />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body>
            {/* Google tag (gtag.js) */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-GHFER2PFLE"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GHFER2PFLE');
              `}
            </Script>
            <ConditionalLayout>{children}</ConditionalLayout>
            <AdminAwareWidgets />
      </body>
    </html>
  );
}

