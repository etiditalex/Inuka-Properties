import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import CookieBanner from "@/components/CookieBanner";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inukaproperties.co.ke'),
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
    url: "https://www.inukaproperties.co.ke",
    siteName: "Inuka Afrika Properties Limited",
    title: "Inuka Afrika Properties Limited | Real Estate in Coastal Kenya",
    description: "Leading real estate company in Kenya specializing in affordable residential, commercial, and beach properties in Kilifi County. Properties in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi.",
    images: [
      {
        url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg",
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
    images: ["https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg"],
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
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'your-verification-code',
  },
  alternates: {
    canonical: "https://www.inukaproperties.co.ke",
  },
  category: "Real Estate",
};

// Structured Data for SEO (JSON-LD)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Inuka Afrika Properties Limited",
  "alternateName": "IAPL",
  "url": "https://www.inukaproperties.co.ke",
  "logo": "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg",
  "description": "Leading real estate company in Kenya specializing in affordable residential, commercial, and beach properties in Kilifi County. 10 years of excellence in property solutions.",
  "foundingDate": "2016",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Links Road Opposite Kigothos Hotel",
    "addressLocality": "Nyali",
    "addressRegion": "Mombasa",
    "postalCode": "80100",
    "addressCountry": "KE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+254-711-082084",
    "contactType": "Customer Service",
    "email": "info@inukaproperties.co.ke",
    "areaServed": "KE",
    "availableLanguage": ["en", "sw"]
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Kilifi"
    },
    {
      "@type": "City",
      "name": "Mariakani"
    },
    {
      "@type": "City",
      "name": "Mtwapa"
    },
    {
      "@type": "City",
      "name": "Kikambala"
    },
    {
      "@type": "City",
      "name": "Bofa"
    },
    {
      "@type": "City",
      "name": "Chumani"
    },
    {
      "@type": "City",
      "name": "Tezo"
    },
    {
      "@type": "City",
      "name": "Msabaha"
    },
    {
      "@type": "City",
      "name": "Mtondia"
    },
    {
      "@type": "City",
      "name": "Malindi"
    },
    {
      "@type": "City",
      "name": "Nyali"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" type="image/jpeg" href="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Chatbot />
            <CookieBanner />
      </body>
    </html>
  );
}

