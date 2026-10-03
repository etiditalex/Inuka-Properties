/** Coastal search coverage. Keyword arrays are for <meta> and JSON-LD only. */

export const BRAND_SLOGAN = "The best real estate company in the coast region";
export const BRAND_HASHTAG = "#The best real estate company in the coast region";

export const HOME_META_DESCRIPTION =
  "Inuka Properties: land, plots and property for sale in Mombasa, Kilifi and Kwale — Kikambala, Bofa, Chumani, Msabaha, Malindi and Diani. The best real estate company in the coast region.";

export const COASTAL_SEARCH_KEYWORDS = [
  "Inuka Properties",
  "Inuka Afrika Properties",
  "Inuka Properties Mombasa",
  "Inuka Properties Kilifi",
  "Inuka Properties Kwale",
  "land for sale Mombasa",
  "plots for sale Mombasa",
  "property for sale Mombasa",
  "land for sale Kilifi",
  "plots for sale Kilifi County",
  "property for sale Kilifi",
  "land for sale Kikambala",
  "plots for sale Kikambala",
  "land for sale Bofa",
  "plots for sale Bofa",
  "land for sale Chumani",
  "plots for sale Chumani",
  "land for sale Msabaha",
  "plots for sale Msabaha",
  "land for sale Malindi",
  "plots for sale Malindi",
  "land for sale Diani",
  "plots for sale Diani",
  "property for sale Diani",
  "land for sale Kwale",
  "plots for sale Kwale County",
  "real estate coast Kenya",
  "real estate company Mombasa",
  "real estate company Kilifi",
  "best real estate company coast region",
  BRAND_SLOGAN,
  BRAND_HASHTAG,
];

export type CoastalLocation = {
  slug: string;
  name: string;
  county: string;
  summary: string;
  detail: string;
  searchQuery: string;
  /** True when a current /for-sale search for searchQuery returns live plots. */
  hasListings: boolean;
  highlights: string[];
  related: string[];
  keywords: string[];
};

export const COASTAL_LOCATIONS: CoastalLocation[] = [
  {
    slug: "mombasa",
    name: "Mombasa",
    county: "Mombasa County",
    summary:
      "Inuka Properties is based in Nyali, Mombasa, on Links Road opposite Kigothos Hotel. Buyers searching for land, plots, and property in Mombasa County start here.",
    detail:
      "Mombasa town prices push many buyers toward serviced plots a short drive north into Kilifi — Mtwapa, Kikambala, and the wider coast corridor — or south toward Kwale and Diani. The Nyali office handles site visits, title questions, and installment plans for those coastal searches.",
    searchQuery: "Mombasa",
    hasListings: false,
    highlights: [
      "Head office in Nyali, Mombasa",
      "Phone 0711 082084",
      "Plots for buyers who live or work in Mombasa",
    ],
    related: ["kilifi", "kikambala", "kwale", "diani"],
    keywords: [
      "Inuka Properties Mombasa",
      "land for sale Mombasa",
      "plots for sale Mombasa",
      "property for sale Nyali",
      "real estate company Mombasa",
    ],
  },
  {
    slug: "kilifi",
    name: "Kilifi",
    county: "Kilifi County",
    summary:
      "Most open Inuka Properties plots are in Kilifi County, from Mariakani through Kikambala, Bofa, Chumani, and Tezo up to Msabaha and Malindi.",
    detail:
      "Kilifi remains the main land market for coast buyers who want title-deed plots, a deposit, and a 12-month balance. Listings include Miliki Tezo na Inuka, Tulivu Haven in Mariakani, Bofa Phase 21, Chumani phases, Kikambala Phase 2, and Malindi Airport Gardens.",
    searchQuery: "Kilifi",
    hasListings: true,
    highlights: [
      "Plots from KES 395,000 on selected sites",
      "Mariakani, Tezo, Bofa, Chumani, Kikambala, Msabaha, Malindi",
      "Title processing support for buyers",
    ],
    related: ["kikambala", "bofa", "chumani", "malindi", "msabaha"],
    keywords: [
      "Inuka Properties Kilifi",
      "land for sale Kilifi County",
      "plots for sale Kilifi",
      "property for sale Kilifi",
    ],
  },
  {
    slug: "kwale",
    name: "Kwale",
    county: "Kwale County",
    summary:
      "Inuka Properties advises buyers searching for land and plots in Kwale County, including the Diani and Ukunda beach belt south of Mombasa.",
    detail:
      "Kwale demand is driven by holiday homes and tourism along the south coast. The Nyali office compares that search with current Kilifi plot projects when a buyer wants a lower entry price, a payment plan, or a site visit this week.",
    searchQuery: "Kwale",
    hasListings: false,
    highlights: [
      "Kwale County and south-coast searches",
      "Diani and Ukunda buyer enquiries",
      "Office support from Nyali, Mombasa",
    ],
    related: ["diani", "mombasa", "kilifi"],
    keywords: [
      "Inuka Properties Kwale",
      "land for sale Kwale",
      "plots for sale Kwale County",
      "property for sale Kwale",
    ],
  },
  {
    slug: "kikambala",
    name: "Kikambala",
    county: "Kilifi County",
    summary:
      "Kikambala sits on the Mombasa–Malindi road in Kilifi County, between Mtwapa and Kilifi town. Buyers look here for residential plots near the beach and the highway.",
    detail:
      "Inuka Properties has marketed Kikambala Phase 2 opposite the Sultan Palace junction, about 2.5 km from the highway, with water, electricity, and a perimeter fence. Ask the Nyali office which Kikambala plots are open, or compare current Kilifi listings in Bofa and Tezo.",
    searchQuery: "Kikambala",
    hasListings: false,
    highlights: [
      "Kikambala Phase 2 — 1/8-acre plots",
      "About 2.5 km from the highway",
      "Water and electricity on site",
    ],
    related: ["mombasa", "kilifi", "bofa"],
    keywords: [
      "land for sale Kikambala",
      "plots for sale Kikambala",
      "Kikambala Phase 2",
      "property Kikambala Kilifi",
    ],
  },
  {
    slug: "bofa",
    name: "Bofa",
    county: "Kilifi County",
    summary:
      "Bofa is a Kilifi town neighbourhood on tarmacked Bofa Road. Inuka Properties sells residential plots here for buyers who want to be close to Kilifi town.",
    detail:
      "Bofa Phase 21 offers 1/8-acre plots with water, electricity, a perimeter fence, and flexible payment terms. Bofa Platinum is the other Bofa address buyers ask for when they search land for sale in Bofa.",
    searchQuery: "Bofa",
    hasListings: true,
    highlights: [
      "Bofa Phase 21 on Bofa Road",
      "Water, electricity, and a perimeter fence",
      "Close to Kilifi town",
    ],
    related: ["kilifi", "chumani", "tezo"],
    keywords: [
      "land for sale Bofa",
      "plots for sale Bofa",
      "Bofa Phase 21",
      "property for sale Bofa Kilifi",
    ],
  },
  {
    slug: "chumani",
    name: "Chumani",
    county: "Kilifi County",
    summary:
      "Chumani is on the Kilifi–Malindi highway in Kilifi County. Plots here suit buyers who want highway access without Malindi or Mombasa town prices.",
    detail:
      "Inuka has offered Chumani Phase 3 about 300 metres from the highway and Chumani Phase 6 about 400 metres away, with 1/8-acre and 1/4-acre options. Ask the office what is open in Chumani now, or browse Bofa and Malindi plots that are listed today.",
    searchQuery: "Chumani",
    hasListings: false,
    highlights: [
      "Chumani Phase 3 and Phase 6",
      "300–400 metres from the Kilifi–Malindi highway",
      "1/8-acre and 1/4-acre plot options",
    ],
    related: ["kilifi", "bofa", "malindi"],
    keywords: [
      "land for sale Chumani",
      "plots for sale Chumani",
      "Chumani Phase 6",
      "property Chumani Kilifi",
    ],
  },
  {
    slug: "msabaha",
    name: "Msabaha",
    county: "Kilifi County",
    summary:
      "Msabaha is on the Malindi side of Kilifi County, after Kizingo Police Station. Buyers searching plots near Malindi often start with this stretch of the highway.",
    detail:
      "Msabaha Phase 8 is about 800 metres from the Malindi highway, with 1/8-acre and 1/4-acre plots from KES 395,000. Earlier Msabaha phases in the Kizingo area are listed separately when plots are still open.",
    searchQuery: "Msabaha",
    hasListings: true,
    highlights: [
      "Msabaha Phase 8 from KES 395,000",
      "About 800 metres from the Malindi highway",
      "1/8-acre and 1/4-acre plots",
    ],
    related: ["malindi", "kilifi", "chumani"],
    keywords: [
      "land for sale Msabaha",
      "plots for sale Msabaha",
      "Msabaha Phase 8",
      "property Msabaha Malindi",
    ],
  },
  {
    slug: "malindi",
    name: "Malindi",
    county: "Kilifi County",
    summary:
      "Malindi is the northern coast town buyers search for holiday plots, airport access, and land near the beach road.",
    detail:
      "Malindi Airport Gardens in Ganda Furunzi is the featured Malindi project, with 1/8-acre plots aimed at holiday homes and coastal investment. Msabaha Phase 8, just south of town, is the lower-priced Malindi-area option.",
    searchQuery: "Malindi",
    hasListings: true,
    highlights: [
      "Malindi Airport Gardens, Ganda Furunzi",
      "Msabaha plots south of Malindi town",
      "Holiday-home and investment buyers",
    ],
    related: ["msabaha", "kilifi", "diani"],
    keywords: [
      "land for sale Malindi",
      "plots for sale Malindi",
      "Malindi Airport Gardens",
      "property for sale Malindi",
    ],
  },
  {
    slug: "diani",
    name: "Diani",
    county: "Kwale County",
    summary:
      "Diani, in Kwale County, is the south-coast beach market buyers compare with Kilifi and Malindi when they search land and plots.",
    detail:
      "Inuka Properties takes Diani and Ukunda enquiries from the Nyali office. If a Diani budget is above current beach-plot prices, the team also shows Kilifi projects — Kikambala, Bofa, Tezo, and Malindi — that can be visited from Mombasa in a day.",
    searchQuery: "Diani",
    hasListings: false,
    highlights: [
      "Diani and Ukunda property searches",
      "Kwale County south coast",
      "Compared with Kilifi plot projects on request",
    ],
    related: ["kwale", "mombasa", "kikambala"],
    keywords: [
      "land for sale Diani",
      "plots for sale Diani",
      "property for sale Diani",
      "Inuka Properties Diani",
      "real estate Diani Kwale",
    ],
  },
  {
    slug: "mariakani",
    name: "Mariakani",
    county: "Kilifi County",
    summary:
      "Mariakani is on the Mombasa–Nairobi highway in Kilifi County. It is the plot market Mombasa and upcountry buyers use when they want land near the bypass.",
    detail:
      "Tulivu Haven in Kibao Kiche offers 1/8-acre plots at KES 450,000, about 600 metres from the Mariakani–Mavueni bypass, with water and electricity on site. Kibao Kiche Haven is the other Mariakani listing on the same corridor.",
    searchQuery: "Mariakani",
    hasListings: true,
    highlights: [
      "Tulivu Haven — KES 450,000",
      "About 600 metres from the Mariakani–Mavueni bypass",
      "Popular with Mombasa and Nairobi buyers",
    ],
    related: ["mombasa", "kilifi", "tezo"],
    keywords: [
      "land for sale Mariakani",
      "plots for sale Mariakani",
      "Tulivu Haven",
      "property Mariakani Kilifi",
    ],
  },
  {
    slug: "tezo",
    name: "Tezo",
    county: "Kilifi County",
    summary:
      "Tezo is between Kilifi town and the Malindi road. Inuka Properties sells gated and open plots here under the Miliki Tezo na Inuka name.",
    detail:
      "Miliki Tezo na Inuka lists 1/8-acre and 1/4-acre plots from KES 450,000 with a 12-month plan. Rafiki @10 and Ocean View Gardens are the other Tezo projects buyers can filter on the listings page.",
    searchQuery: "Tezo",
    hasListings: true,
    highlights: [
      "Miliki Tezo na Inuka from KES 450,000",
      "12-month installment plan",
      "Off the Kilifi–Malindi corridor",
    ],
    related: ["kilifi", "bofa", "chumani"],
    keywords: [
      "land for sale Tezo",
      "plots for sale Tezo",
      "Miliki Tezo na Inuka",
      "property Tezo Kilifi",
    ],
  },
  {
    slug: "nyali",
    name: "Nyali",
    county: "Mombasa County",
    summary:
      "The Inuka Properties office is in Nyali, Mombasa. Walk-in buyers and site-visit bookings are handled from Links Road opposite Kigothos Hotel.",
    detail:
      "Nyali is the base for coast clients who search property, land, and plots across Mombasa, Kilifi, and Kwale. Call 0711 082084 or email info@inukaproperties.co.ke to book a visit to Kikambala, Bofa, Chumani, Msabaha, Malindi, or another open project.",
    searchQuery: "Nyali",
    hasListings: false,
    highlights: [
      "Links Road, opposite Kigothos Hotel",
      "P.O. Box 525-80100, Nyali",
      "Weekday office hours 8:00–17:00",
    ],
    related: ["mombasa", "kikambala", "diani"],
    keywords: [
      "Inuka Properties Nyali",
      "real estate office Nyali",
      "property company Mombasa Nyali",
    ],
  },
];

const bySlug = new Map(COASTAL_LOCATIONS.map((location) => [location.slug, location]));

export function getCoastalLocation(slug: string): CoastalLocation | undefined {
  return bySlug.get(slug);
}

export function relatedCoastalLocations(location: CoastalLocation): CoastalLocation[] {
  return location.related
    .map((slug) => bySlug.get(slug))
    .filter((item): item is CoastalLocation => Boolean(item));
}
