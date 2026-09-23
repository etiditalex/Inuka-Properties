export const MARKET_RESEARCH_CATEGORY = "Market Research";

export function isMarketResearchPost(category: string | null | undefined): boolean {
  return (category || "").trim().toLowerCase() === MARKET_RESEARCH_CATEGORY.toLowerCase();
}

export type WebsiteMarketReport = {
  id: number;
  title: string;
  description: string;
  report_date: string;
  report_type: string;
  sort_order: number;
  file_url?: string | null;
  image_url?: string | null;
};

export type WebsiteMarketInsight = {
  id: number;
  icon: string;
  title: string;
  value: string;
  description: string;
  sort_order: number;
};

export const STATIC_MARKET_REPORTS: WebsiteMarketReport[] = [
  {
    id: 1,
    title: "Kilifi County Real Estate Market Report 2024",
    description:
      "Comprehensive analysis of property trends, prices, and investment opportunities in Kilifi County.",
    report_date: "2024-01-15",
    report_type: "Market Report",
    sort_order: 0,
    image_url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767596630/kilifi_investment_swq82s.jpg",
  },
  {
    id: 2,
    title: "Coastal Property Investment Guide",
    description:
      "Detailed guide on investing in coastal properties, including beachfront and residential developments.",
    report_date: "2024-01-10",
    report_type: "Investment Guide",
    sort_order: 1,
    image_url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
  },
  {
    id: 3,
    title: "Affordable Housing Market Analysis",
    description:
      "In-depth analysis of the affordable housing sector and emerging opportunities.",
    report_date: "2024-01-05",
    report_type: "Sector Analysis",
    sort_order: 2,
    image_url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774342011/Msabaha_phase_8_fc1tuh.jpg",
  },
];

export const STATIC_MARKET_INSIGHTS: WebsiteMarketInsight[] = [
  {
    id: 1,
    icon: "TrendingUp",
    title: "Market Growth",
    value: "15%",
    description: "Year-over-year growth in coastal property values",
    sort_order: 0,
  },
  {
    id: 2,
    icon: "MapPin",
    title: "Hot Locations",
    value: "9",
    description: "Prime locations we serve across Kilifi County",
    sort_order: 1,
  },
  {
    id: 3,
    icon: "BarChart3",
    title: "Investment Returns",
    value: "12-18%",
    description: "Average annual returns on coastal properties",
    sort_order: 2,
  },
];
