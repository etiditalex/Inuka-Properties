import type { Metadata } from "next";
import { Dancing_Script, Inter, Playfair_Display, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import AdminAwareWidgets from "@/components/AdminAwareWidgets";
import ContactAutoCapture from "@/components/ContactAutoCapture";
import { BookSiteVisitProvider } from "@/components/BookSiteVisitContext";
import JsonLd from "@/components/JsonLd";
import {
  DEFAULT_OG_IMAGE,
  organizationSchema,
  siteNavigationSchema,
  websiteSchema,
} from "@/lib/seo";
import { COASTAL_SEARCH_KEYWORDS, HOME_META_DESCRIPTION } from "@/lib/coastalSeo";
import { SITE_ORIGIN } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Inuka Properties | Land & Plots in Mombasa, Kilifi & Kwale",
    template: "%s | Inuka Properties"
  },
  description: HOME_META_DESCRIPTION,
  keywords: COASTAL_SEARCH_KEYWORDS,
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
    title: "Inuka Properties | Land & Plots in Mombasa, Kilifi & Kwale",
    description: HOME_META_DESCRIPTION,
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
    title: "Inuka Properties | Land & Plots in Mombasa, Kilifi & Kwale",
    description: HOME_META_DESCRIPTION,
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
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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
        <JsonLd data={siteNavigationSchema} />
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
            <BookSiteVisitProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <ContactAutoCapture />
              <AdminAwareWidgets />
            </BookSiteVisitProvider>
      </body>
    </html>
  );
}

