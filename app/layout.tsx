import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import AdminAwareWidgets from "@/components/AdminAwareWidgets";
import ContactAutoCapture from "@/components/ContactAutoCapture";
import SiteMetaPixel from "@/components/SiteMetaPixel";
import { BookSiteVisitProvider } from "@/components/BookSiteVisitContext";
import JsonLd from "@/components/JsonLd";
import {
  DEFAULT_OG_IMAGE,
  organizationSchema,
  siteNavigationSchema,
  websiteSchema,
} from "@/lib/seo";
import { COASTAL_SEARCH_KEYWORDS, HOME_META_DESCRIPTION } from "@/lib/coastalSeo";
import { FACEBOOK_PIXEL_ID } from "@/lib/facebook/pixel";
import { SITE_ORIGIN } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
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
      className={`${montserrat.variable} ${montserrat.className}`}
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
        <script
          id="meta-pixel-header"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body>
            {/* Google tag (gtag.js) */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-GHFER2PFLE"
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GHFER2PFLE');
              `}
            </Script>
            <SiteMetaPixel />
            <BookSiteVisitProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <ContactAutoCapture />
              <AdminAwareWidgets />
            </BookSiteVisitProvider>
      </body>
    </html>
  );
}

