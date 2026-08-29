/** Key selling projects promoted as Google sitelinks and local search landing pages. */

export const GOOGLE_PLACE_ID = "ChIJh7mWVCcTQBgRz0n0qhSMn1Q";
export const GOOGLE_MAPS_PLACE_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;
export const OFFICE_MAPS_SEARCH_URL =
  "https://www.google.com/maps/search/?api=1&query=Links+Road+Opposite+Kigothos+Hotel+Nyali+Mombasa+Kenya";

export type FeaturedSitelinkPage = {
  name: string;
  href: string;
  /** Listing id when this sitelink is a single property page. */
  propertyId: number | null;
  location: string;
  description: string;
};

export const FEATURED_SITELINK_PAGES: FeaturedSitelinkPage[] = [
  {
    name: "Miliki Tezo na Inuka",
    href: "/miliki-tezo-na-inuka",
    propertyId: 3,
    location: "Tezo, Kilifi County",
    description:
      "Affordable 1/8 and 1/4-acre plots for sale in Tezo, Kilifi from KES 450,000 with 12-month installments.",
  },
  {
    name: "Tulivu Haven",
    href: "/tulivu-haven",
    propertyId: 14,
    location: "Kibao Kiche, Mariakani",
    description:
      "1/8-acre plots for sale in Mariakani, Kilifi County from KES 450,000 with water and electricity on site.",
  },
  {
    name: "Bofa Projects",
    href: "/bofa-projects",
    propertyId: null,
    location: "Bofa, Kilifi County",
    description:
      "Bofa Platinum beachfront and Bofa Phase 21 plots for sale on tarmacked Bofa Road, Kilifi County.",
  },
  {
    name: "Malindi Airport Gardens",
    href: "/malindi-airport-gardens",
    propertyId: 6,
    location: "Ganda Furunzi, Malindi",
    description:
      "1/8-acre plots for sale near Malindi Airport — holiday homes and coastal investment in Kilifi County.",
  },
];

export const BOFA_PROJECT_IDS = [1, 8] as const;

export const FEATURED_PROPERTY_REWRITES = [
  { source: "/miliki-tezo-na-inuka", destination: "/for-sale/3" },
  { source: "/tulivu-haven", destination: "/for-sale/14" },
  { source: "/malindi-airport-gardens", destination: "/for-sale/6" },
  { source: "/bofa-platinum", destination: "/for-sale/1" },
  { source: "/bofa-phase-21", destination: "/for-sale/8" },
] as const;

const FEATURED_PATHS = new Set<string>([
  ...FEATURED_SITELINK_PAGES.map((page) => page.href),
  ...FEATURED_PROPERTY_REWRITES.map((rule) => rule.source),
]);

export function isFeaturedProjectPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return FEATURED_PATHS.has(pathname);
}
