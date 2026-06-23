export type WebsiteMarketReport = {
  id: number;
  title: string;
  description: string;
  report_date: string;
  report_type: string;
  sort_order: number;
  file_url?: string | null;
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
  },
  {
    id: 2,
    title: "Coastal Property Investment Guide",
    description:
      "Detailed guide on investing in coastal properties, including beachfront and residential developments.",
    report_date: "2024-01-10",
    report_type: "Investment Guide",
    sort_order: 1,
  },
  {
    id: 3,
    title: "Affordable Housing Market Analysis",
    description:
      "In-depth analysis of the affordable housing sector and emerging opportunities.",
    report_date: "2024-01-05",
    report_type: "Sector Analysis",
    sort_order: 2,
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
