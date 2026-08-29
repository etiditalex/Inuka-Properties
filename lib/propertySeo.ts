export type PropertyFaqItem = {
  question: string;
  answer: string;
};

export type PropertySeoContentSection = {
  heading: string;
  paragraphs: string[];
};

export type PropertySeoEntry = {
  id: number;
  title: string;
  /** SEO-optimized page H1 (falls back to title) */
  h1?: string;
  /** Custom `<title>` before site suffix */
  seoTitle?: string;
  location: string;
  county?: string;
  price: string;
  /** Numeric price for structured data, e.g. 450000 */
  priceAmount?: number;
  image: string;
  gallery?: string[];
  description: string;
  metaDescription?: string;
  keywords?: string[];
  faq?: PropertyFaqItem[];
  seoSections?: PropertySeoContentSection[];
  relatedPropertyIds?: number[];
  mapLink?: string;
  geo?: { latitude: number; longitude: number };
  /** JSON-LD listing name when it should differ from the visible page heading */
  schemaName?: string;
  /** Use seoTitle as the full document title (no site-name suffix) */
  exactSeoTitle?: boolean;
  /** FAQ and SEO copy stay in metadata/JSON-LD only — not rendered on the page */
  schemaOnly?: boolean;
  /** Public sitelink URL, e.g. `/tulivu-haven`. Numbered `/for-sale/[id]` still works. */
  slug?: string;
  sitemapPriority?: number;
  datePosted?: string;
  additionalProperty?: { name: string; value: string }[];
  highPrice?: number;
  /** Lower sitemap priority; optional noindex for sold inventory */
  soldOut?: boolean;
};

/** SEO fields for property detail pages — kept in sync with `/for-sale/[id]`. */
export const PROPERTY_SEO: PropertySeoEntry[] = [
  {
    id: 14,
    title: "Tulivu Haven",
    slug: "tulivu-haven",
    schemaOnly: true,
    sitemapPriority: 0.98,
    h1: "Tulivu Haven — Land for Sale in Kibao Kiche, Mariakani, Kilifi County",
    seoTitle:
      "Tulivu Haven | Land for Sale in Mariakani & Kilifi — KES 450,000",
    location: "Kibao Kiche, Mariakani",
    county: "Kilifi County",
    price: "KES 450,000",
    priceAmount: 450000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934536/Tulivu_haven_2_huxl0k.jpg",
    gallery: [
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934536/Tulivu_haven_2_huxl0k.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934536/Tulivu_haven_1_vau8kg.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934535/Tulivu_haven_7_znzmct.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934535/Tulivu_haven_5_rusy8s.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934535/Tulivu_haven_4_h2befh.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934535/Tulivu_haven_3_p2wbfk.jpg",
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934535/Tulivu_haven_6_veuhfn.jpg",
    ],
    description:
      "Tulivu Haven land for sale in Kibao Kiche, Mariakani — 1/8-acre plots from KES 450,000, water and electricity on site, 600m from Mariakani–Mavueni Bypass, flexible 12-month payment plan.",
    metaDescription:
      "Tulivu Haven: verified 1/8-acre plots for sale in Kibao Kiche, Mariakani, Kilifi County at KES 450,000. Title deed land with water & electricity on site, 600m from Mariakani–Mavueni Bypass. Deposit KES 150,000, 12-month plan. Popular with Mombasa & Nairobi buyers.",
    keywords: [
      "land for sale Mariakani",
      "plots for sale Kilifi County",
      "Tulivu Haven",
      "Kibao Kiche plots for sale",
      "affordable land Kilifi",
      "land for sale near Mombasa",
      "property for sale Mariakani",
      "1/8 acre plots Mariakani",
      "title deed land Kilifi",
      "installment land payment Kenya",
      "land investment Kilifi County",
      "plots for sale coastal Kenya",
      "Mariakani Mavueni bypass land",
      "cheap land for sale Kenya",
      "real estate Mariakani Kilifi",
      "land for sale Nairobi investors",
      "Inuka Afrika Properties Mariakani",
      "serviced plots Mariakani",
      "residential plots Kilifi County",
      "land for sale Mombasa road corridor",
    ],
    mapLink: "https://maps.google.com/?q=Kibao+Kiche+Mariakani+Kilifi+Kenya",
    geo: { latitude: -3.8626, longitude: 39.4753 },
    relatedPropertyIds: [10, 11, 13],
    faq: [
      {
        question: "How much is a plot at Tulivu Haven, Mariakani?",
        answer:
          "Each 1/8-acre plot at Tulivu Haven, Kibao Kiche, Mariakani is priced at KES 450,000. You pay a deposit of KES 150,000 and clear the KES 300,000 balance within 12 months (approximately KES 25,000 per month).",
      },
      {
        question: "Where is Tulivu Haven located in Kilifi County?",
        answer:
          "Tulivu Haven is in Kibao Kiche, Mariakani, Kilifi County — along the fast-growing Nairobi–Mombasa corridor. The project sits just 600 metres from the Mariakani–Mavueni Bypass, making it easy to reach from Mombasa, Voi, and Nairobi via the A109 highway.",
      },
      {
        question: "Is Tulivu Haven a good land investment for Mombasa and Nairobi buyers?",
        answer:
          "Yes. Mariakani is one of Kilifi County's fastest-growing towns on the Mombasa–Nairobi route. Buyers from Mombasa (under one hour) and Nairobi (approximately 7–8 hours by road, or a short flight to Mombasa then drive) choose Mariakani for affordable title-deed plots, bypass access, and strong long-term appreciation compared to city prices.",
      },
      {
        question: "Does Tulivu Haven have water and electricity?",
        answer:
          "Yes. Water and electricity are already on site at Tulivu Haven, so you can plan residential development or investment without waiting for basic utility connections.",
      },
      {
        question: "Are title deeds available for Tulivu Haven plots?",
        answer:
          "Inuka Afrika Properties Limited issues plots with proper title deed processing. Contact our team at 0711 082 084 to confirm current availability, legal documentation, and the transfer process for Tulivu Haven, Mariakani.",
      },
      {
        question: "How do I book a site visit to Tulivu Haven?",
        answer:
          "Call or WhatsApp 0711 082 084, email info@inukaproperties.co.ke, or use our online Book a Site Visit form. We arrange guided visits to Tulivu Haven in Kibao Kiche, Mariakani so you can see the plots before you buy.",
      },
    ],
    seoSections: [
      {
        heading: "Affordable land for sale in Mariakani, Kilifi County",
        paragraphs: [
          "Tulivu Haven offers some of the most competitively priced title-deed land for sale in Mariakani and the wider Kilifi County market. At KES 450,000 for a 1/8-acre plot, the project targets first-time buyers, diaspora investors, and families looking for affordable property along Kenya's coastal growth corridor.",
          "Kibao Kiche is a well-positioned neighbourhood within Mariakani town — close to schools, markets, and the Mariakani–Mavueni Bypass that connects the A109 Nairobi–Mombasa highway to local residential and commercial growth nodes.",
        ],
      },
      {
        heading: "Why Mombasa, Nairobi, and upcountry buyers choose Mariakani plots",
        paragraphs: [
          "Property search interest in Mariakani, Kilifi County has surged as Mombasa prices rise and Nairobi investors seek land with better entry points and coastal proximity. Tulivu Haven sits on the Mombasa side of the corridor — ideal for buyers who want weekend access to the coast without paying Mombasa CBD plot premiums.",
          "Whether you are searching for land for sale in Kilifi, plots near Mombasa, or a long-term hold from Nairobi, Mariakani combines highway access, utility-ready plots, and flexible installment plans through Inuka Afrika Properties Limited — a trusted Kilifi County developer with over 10 years of experience.",
        ],
      },
      {
        heading: "Flexible payment plan — own land with KES 150,000 deposit",
        paragraphs: [
          "Tulivu Haven makes land ownership accessible: pay KES 150,000 upfront and spread the remaining KES 300,000 over 12 months. This installment structure helps salaried buyers in Mombasa, Nairobi, and across Kenya secure plots while prices along the Mariakani bypass corridor continue to appreciate.",
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Msabaha Phase 8",
    location: "Msabaha, Malindi",
    county: "Kilifi County",
    price: "From KES 395,000",
    priceAmount: 395000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774342011/Msabaha_phase_8_fc1tuh.jpg",
    description:
      "Msabaha Phase 8 land for sale in Malindi — 1/8 and 1/4 acre plots with title deed, flexible 12-month payment plans, and highway access near Kizingo.",
  },
  {
    id: 12,
    title: "Rafiki @10 – Prime Plots Now Selling",
    location: "Tezo, Kilifi County",
    county: "Kilifi County",
    price: "KES 650,000",
    priceAmount: 650000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771129318/Rafriki_10_Prime_plots_for_sale_s89vom.jpg",
    description:
      "Rafiki @10 plots for sale in Tezo, Kilifi — gated community, murram roads, water on site, 500m from Tezo Town off the Kilifi–Malindi Highway.",
  },
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    county: "Kilifi County",
    price: "KES 325,000",
    priceAmount: 325000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    description:
      "Mwanda Phase 3 in Mariakani — sold-out reference listing. Browse similar land for sale in Mariakani and Kilifi County with Inuka Afrika Properties.",
    soldOut: true,
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    county: "Kilifi County",
    price: "KES 399,000",
    priceAmount: 399000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    description:
      "Kibao Kiche Haven plots for sale in Mariakani — 50×100 plots from KES 399,000 with zero-interest 12-month payment plan near Mariakani bypasses.",
  },
  {
    id: 9,
    title: "Ocean View Gardens",
    location: "Tezo, Kilifi County",
    county: "Kilifi County",
    price: "KES 495,000",
    priceAmount: 495000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
    description:
      "Ocean View Gardens land for sale in Tezo — serviced 1/8 acre plots, 1km from the beach, utilities on site, all-inclusive pricing from KES 495,000.",
  },
  {
    id: 8,
    title: "Bofa Phase 21",
    slug: "bofa-phase-21",
    schemaOnly: true,
    sitemapPriority: 0.9,
    seoTitle: "Bofa Phase 21 | Plots for Sale on Bofa Road, Kilifi",
    location: "Bofa, Kilifi County",
    county: "Kilifi County",
    price: "KES 1,850,000",
    priceAmount: 1850000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767291293/Bofa_Phase_21_17_ss7xhv.jpg",
    description:
      "Bofa Phase 21 plots for sale on tarmacked Bofa Road (B69) — demarcated plots with water, electricity, perimeter fence, and flexible payment terms.",
    metaDescription:
      "Bofa Phase 21: 1/8-acre plots for sale on tarmacked Bofa Road (B69), Kilifi County. Water, electricity, beacons, perimeter fence. Deposit KES 700,000, 12-month plan. Inuka Afrika Properties.",
    keywords: [
      "Bofa Phase 21",
      "plots for sale Bofa Kilifi",
      "land for sale Bofa Road",
      "Bofa Kilifi properties",
      "tarmacked Bofa Road plots",
      "1/8 acre plots Kilifi",
      "Inuka Afrika Properties Bofa",
    ],
    mapLink: "https://maps.google.com/?q=Bofa+Road+Kilifi+Kenya",
    geo: { latitude: -3.59, longitude: 39.87 },
    faq: [
      {
        question: "Where is Bofa Phase 21 located?",
        answer:
          "Bofa Phase 21 is in Bofa, Kilifi County, off the newly tarmacked Bofa Road (B69). Plots are demarcated with beacons, with water, electricity, access roads, and a perimeter fence.",
      },
      {
        question: "How much is a plot at Bofa Phase 21?",
        answer:
          "1/8-acre plots at Bofa Phase 21 are KES 1,850,000. Pay a KES 700,000 deposit and the remaining KES 1,150,000 over 12 months. Call 0711 082 084 to confirm availability.",
      },
    ],
  },
  {
    id: 7,
    title: "Msabaha Phase 6",
    location: "Malindi, Kizingo Area",
    county: "Kilifi County",
    price: "KES 450,000",
    priceAmount: 450000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287397/Msabaha_Phase_6_2_vebo06.jpg",
    description:
      "Msabaha Phase 6 land for sale in Malindi Kizingo — 1/8 acre plots near Mombasa–Malindi highway with water and electricity on site.",
  },
  {
    id: 6,
    title: "Malindi Airport Gardens",
    slug: "malindi-airport-gardens",
    schemaOnly: true,
    sitemapPriority: 0.98,
    seoTitle: "Malindi Airport Gardens | Plots for Sale near Malindi Airport",
    location: "Ganda Furunzi, Malindi",
    county: "Kilifi County",
    price: "KES 950,000",
    priceAmount: 950000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287215/Malindi_Airport_Gardens_dphmr6.jpg",
    description:
      "Malindi Airport Gardens plots for sale — 1/8 acre near Malindi Airport and the coast, ideal for holiday homes and coastal investment.",
    metaDescription:
      "Malindi Airport Gardens: 1/8-acre plots for sale in Ganda Furunzi, Malindi — 3km from Malindi Airport, minutes from the beach, 10km to Watamu. KES 950,000. Holiday homes and coastal investment from Inuka Afrika Properties.",
    keywords: [
      "Malindi Airport Gardens",
      "plots for sale Malindi",
      "land for sale near Malindi Airport",
      "Malindi plots for sale",
      "Ganda Furunzi land",
      "holiday homes Malindi",
      "Watamu land investment",
      "coastal plots Kilifi County",
      "Inuka Afrika Properties Malindi",
    ],
    mapLink: "https://maps.google.com/?q=Ganda+Furunzi+Malindi+Kenya",
    geo: { latitude: -3.2524, longitude: 40.1006 },
    faq: [
      {
        question: "Where is Malindi Airport Gardens?",
        answer:
          "Malindi Airport Gardens is in Ganda Furunzi, Malindi, Kilifi County — about 3km from Malindi Airport, minutes from the ocean, and 10km from Watamu. It suits holiday homes and coastal investment.",
      },
      {
        question: "How much are plots at Malindi Airport Gardens?",
        answer:
          "1/8-acre plots at Malindi Airport Gardens are KES 950,000. Contact Inuka Afrika Properties on 0711 082 084 or info@inukaproperties.co.ke to book a site visit.",
      },
    ],
  },
  {
    id: 5,
    title: "Mtondia Highway Gardens",
    location: "Mtondia, Kilifi County",
    county: "Kilifi County",
    price: "KES 1,250,000",
    priceAmount: 1250000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
    description:
      "Mtondia Highway Gardens land touching Kilifi–Malindi Highway — serviced plots for residential, commercial, and student housing near Pwani University.",
  },
  {
    id: 4,
    title: "Chumani Phase 3",
    location: "Chumani, Kilifi County",
    county: "Kilifi County",
    price: "KES 550,000",
    priceAmount: 550000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286100/chumani_phase_3_2_muym3y.jpg",
    description:
      "Chumani Phase 3 plots for sale — 1/8 acre from KES 550,000, 300m from Kilifi–Malindi Highway, ready for immediate settlement with utilities.",
  },
  {
    id: 3,
    title: "MILIKI TEZO NA INUKA",
    slug: "miliki-tezo-na-inuka",
    schemaName: "Affordable Land & Plots for Sale in Tezo, Kilifi County",
    seoTitle: "Land for Sale in Tezo Kilifi from KES 450K | Miliki Tezo na Inuka",
    exactSeoTitle: true,
    schemaOnly: true,
    sitemapPriority: 0.98,
    datePosted: "2026-08-21",
    location: "Tezo, Kilifi County",
    county: "Kilifi County",
    price: "KES 450,000",
    priceAmount: 450000,
    highPrice: 950000,
    additionalProperty: [
      { name: "Plot sizes", value: "1/8 acre (50x100) and 1/4 acre" },
      { name: "Payment plan", value: "12-month installment" },
      { name: "Access", value: "Kwa Mwancha Access Road, near Tezo Town" },
      { name: "Project", value: "Miliki Tezo na Inuka" },
    ],
    image:
      "https://slqalqvtsqrloaxjrtza.supabase.co/storage/v1/object/public/admin-uploads/properties/1787292087079-kg9108raxss.jpeg",
    gallery: [
      "https://slqalqvtsqrloaxjrtza.supabase.co/storage/v1/object/public/admin-uploads/properties/1787292087079-kg9108raxss.jpeg",
    ],
    mapLink: "https://maps.google.com/?q=-3.5333,39.85",
    geo: { latitude: -3.5333, longitude: 39.85 },
    description:
      "Land for sale in Tezo, Kilifi from KES 450K. Own 1/8 or 1/4-acre plots with flexible 12-month installments. Miliki Tezo na Inuka today.",
    metaDescription:
      "Land for sale in Tezo, Kilifi from KES 450K. Own 1/8 or 1/4-acre plots with flexible 12-month installments. Miliki Tezo na Inuka today.",
    keywords: [
      "Land for sale in Tezo Kilifi",
      "Plots for sale in Tezo Kilifi",
      "Land for sale in Kilifi County",
      "Plots for sale in Kilifi",
      "Affordable plots for sale in Kilifi",
      "50x100 plots for sale in Kilifi",
      "1/8 acre plots for sale in Kilifi",
      "1/4 acre land for sale in Kilifi",
      "Affordable land for sale in Tezo",
      "Residential land for sale in Tezo",
      "Land investment in Kilifi County",
      "Property for sale in Kilifi County",
      "Land for sale near Kilifi Town",
      "Coastal land for sale in Kenya",
      "Plots for sale in Coastal Kenya",
      "Land for sale near Mombasa",
      "Affordable land in Coastal Kenya",
      "Land with installment payment in Kilifi",
      "Plots on installment in Kilifi",
      "Miliki Tezo na Inuka",
      "Inuka Afrika Properties Kilifi",
      "Inuka Properties land for sale",
      "Kwa Mwancha Access Road Tezo",
      "land for sale near Tezo Town",
    ],
    faq: [
      {
        question: "Where can I find land for sale in Tezo, Kilifi?",
        answer:
          "Miliki Tezo na Inuka offers land for sale in Tezo, Kilifi County — residential 1/8-acre and 1/4-acre plots on Kwa Mwancha Access Road, near Tezo Town. Plots start from KES 450,000 with a flexible 12-month installment plan from Inuka Afrika Properties Kilifi.",
      },
      {
        question: "How much are plots for sale in Tezo, Kilifi?",
        answer:
          "Plots for sale in Tezo, Kilifi at Miliki Tezo na Inuka start at KES 450,000 for a 1/8-acre (50x100) plot. 1/4-acre land for sale in Kilifi at this project is KES 950,000. Prices are all-inclusive, with no hidden charges.",
      },
      {
        question: "Are there 50x100 and 1/8 acre plots for sale in Kilifi?",
        answer:
          "Yes. Miliki Tezo na Inuka has 50x100 plots for sale in Kilifi — the same as 1/8 acre plots for sale in Kilifi — from KES 450,000. Larger 1/4 acre land for sale in Kilifi is available at KES 950,000 on the same 10-acre Tezo project.",
      },
      {
        question: "Can I buy land with installment payment in Kilifi?",
        answer:
          "Yes. Plots on installment in Kilifi are available at Miliki Tezo na Inuka. For 1/8-acre plots, pay a KES 150,000 deposit and KES 25,000 per month for 12 months. For 1/4-acre plots, pay a KES 250,000 deposit and the balance over 12 months. This is affordable land for sale in Tezo with a 12-month installment plan.",
      },
      {
        question: "Is Miliki Tezo na Inuka a good land investment in Kilifi County?",
        answer:
          "Miliki Tezo na Inuka is residential land for sale in Tezo in a growing neighbourhood near Tezo Town, with schools, hospitals, shopping facilities, and hotels such as Gabs Gate Hotel and Rossy Hotel nearby. It is positioned for buyers searching for affordable plots for sale in Kilifi, land for sale near Kilifi Town, land for sale near Mombasa, and coastal land for sale in Kenya.",
      },
      {
        question: "Who sells Inuka Properties land for sale in Kilifi?",
        answer:
          "Inuka Afrika Properties Kilifi (Inuka Afrika Properties Limited) sells Miliki Tezo na Inuka. Call or WhatsApp 0711 082 084 or email info@inukaproperties.co.ke to book a site visit and view plots for sale in Coastal Kenya.",
      },
    ],
  },
  {
    id: 2,
    title: "Chumani Phase 6",
    location: "Chumani, Kilifi County",
    county: "Kilifi County",
    price: "KES 595,000",
    priceAmount: 595000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
    description:
      "Chumani Phase 6 coastal plots for sale — 400m from Kilifi–Malindi Highway, 1/8 and 1/4 acre options in a fast-growing Kilifi community.",
  },
  {
    id: 1,
    title: "Bofa Platinum",
    slug: "bofa-platinum",
    schemaOnly: true,
    sitemapPriority: 0.9,
    seoTitle: "Bofa Platinum | Beachfront Gated Community in Bofa, Kilifi",
    location: "Bofa, Kilifi County",
    county: "Kilifi County",
    price: "KES 5,990,000",
    priceAmount: 5990000,
    highPrice: 5990000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    description:
      "Bofa Platinum beachfront gated community — controlled development 30m from the beach on Bofa Road, Kilifi County premium coastal property.",
    metaDescription:
      "Bofa Platinum: gated beachfront plots 30m from the sand on Bofa Road, Kilifi. 1/8 acre from KES 2,990,000 and 1/4 acre at KES 5,990,000. Water, electricity, perimeter walls. Inuka Afrika Properties.",
    keywords: [
      "Bofa Platinum",
      "Bofa beach plots",
      "beachfront land Kilifi",
      "gated community Bofa",
      "Bofa Road properties",
      "land for sale Bofa Kilifi",
      "Inuka Afrika Properties Bofa",
    ],
    additionalProperty: [
      { name: "Distance to beach", value: "30 metres" },
      { name: "Access", value: "Bofa Road, Kilifi County" },
      { name: "Plot sizes", value: "1/8 acre and 1/4 acre" },
    ],
    mapLink: "https://maps.google.com/?q=Bofa+Beach+Kilifi+Kenya",
    geo: { latitude: -3.5985, longitude: 39.878 },
    faq: [
      {
        question: "What is Bofa Platinum?",
        answer:
          "Bofa Platinum is a controlled gated community on Bofa Road, Kilifi County, about 30 metres from the beach. It offers 1/8-acre plots from KES 2,990,000 and 1/4-acre plots at KES 5,990,000, with water, electricity, and perimeter walls.",
      },
      {
        question: "How do I view Bofa projects?",
        answer:
          "See all Bofa listings at inukaproperties.co.ke/bofa-projects, or call/WhatsApp 0711 082 084 to book a site visit to Bofa Platinum and Bofa Phase 21.",
      },
    ],
  },
];

const byId = new Map(PROPERTY_SEO.map((p) => [p.id, p]));
const bySlug = new Map(
  PROPERTY_SEO.filter((p) => p.slug).map((p) => [p.slug as string, p])
);

export function getPropertySeo(id: number): PropertySeoEntry | undefined {
  return byId.get(id);
}

export function getPropertySeoBySlug(slug: string): PropertySeoEntry | undefined {
  return bySlug.get(slug);
}

export function getAllPropertyIds(): number[] {
  return PROPERTY_SEO.map((p) => p.id);
}

export function propertyDetailPath(id: number): string {
  const slug = byId.get(id)?.slug;
  return slug ? `/${slug}` : `/for-sale/${id}`;
}

export function getPropertyIdFromPathname(
  pathname: string | null | undefined
): number | null {
  if (!pathname) return null;
  const numbered = pathname.match(/^\/for-sale\/(\d+)$/);
  if (numbered) return Number(numbered[1]);
  const slug = pathname.replace(/^\//, "").replace(/\/$/, "");
  return bySlug.get(slug)?.id ?? null;
}

export function propertyImageAlt(
  property: Pick<PropertySeoEntry, "title" | "location" | "county">,
  imageIndex?: number
): string {
  const suffix =
    imageIndex !== undefined ? ` — photo ${imageIndex + 1}` : "";
  const county = property.county ?? "Kilifi County";
  return `${property.title} land for sale in ${property.location}, ${county}${suffix}`;
}
