export type PropertyType = "all" | "residential" | "commercial" | "beach" | "farm" | "affordable";

export interface CatalogProperty {
  id: number;
  title: string;
  location: string;
  type: PropertyType | string;
  price: string;
  size: string;
  bedrooms?: number;
  image: string;
  featured?: boolean;
  status?: "available" | "ongoing" | "sold";
  features?: string[];
}

export const STATIC_PROPERTY_CATALOG: CatalogProperty[] = [
  {
    id: 14,
    title: "Tulivu Haven",
    location: "Kibao Kiche, Mariakani, Kilifi County",
    type: "residential",
    price: "KES 450,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1781934536/Tulivu_haven_2_huxl0k.jpg",
    status: "available",
    featured: true,
    features: [
      "Land for sale in Mariakani, Kilifi County",
      "600m from Mariakani–Mavueni Bypass",
      "Water & electricity on site",
      "Title deed 1/8-acre plots — KES 450,000",
      "Deposit KES 150,000 — 12-month balance",
      "Ideal for Mombasa & Nairobi investors",
    ],
  },
  {
    id: 13,
    title: "Msabaha Phase 8",
    location: "Msabaha, Malindi (after Kizingo Police Station)",
    type: "residential",
    price: "From KES 395,000",
    size: "1/8 & 1/4 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774342011/Msabaha_phase_8_fc1tuh.jpg",
    status: "available",
    featured: true,
    features: [
      "~800m from Malindi Highway",
      "Access via Children of the Rising Sun junction",
      "19 acres — 1/8 & 1/4 acre plots",
      "Anniversary pricing — all-inclusive, no hidden charges",
      "Deposit + 12-month balance (see listing for plot sizes)",
      "Neighbours sold-out Msabaha Phase 3 & Phase 7",
    ],
  },
  {
    id: 12,
    title: "Rafiki @10",
    location: "Tezo, Kilifi County",
    type: "residential",
    price: "KES 650,000",
    size: "10 Acres (72 Units)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771129318/Rafriki_10_Prime_plots_for_sale_s89vom.jpg",
    status: "available",
    featured: true,
    features: [
      "500m from Tezo Town",
      "Off the Kilifi–Malindi Highway",
      "Perimeter fence with common gated entrance",
      "Graded access & internal all-weather murram roads",
      "Reliable water availability",
      "Close to schools, hospitals & markets",
      "Uncontrolled development — build at your own pace",
    ],
  },
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    type: "residential",
    price: "KES 325,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    status: "sold",
    features: ["Prime Location - 1km off Mariakani-Kaloleni Bypass", "Water & Electricity on-site", "Ready to Build", "Perfect for Home or Investment", "Affordable Pricing - KES 325,000", "Flexible Payment - KES 100,000 deposit, balance over 12 months"],
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    type: "residential",
    price: "KES 399,000",
    size: "50x100 (1/8 Acre)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    status: "available",
    featured: true,
    features: ["Prime Location - 500m from Mariakani-Mavueni & Mkapuni bypasses", "Affordable Pricing - KES 399,000", "Flexible Payments - KES 100,000 deposit, zero-interest balance in 12 months", "High Growth Potential", "Ideal for residential, commercial, or long-term investment", "Site visits every Wednesday and Saturday"],
  },
  {
    id: 9,
    title: "Ocean View Gardens",
    location: "Tezo, Kilifi County",
    type: "residential",
    price: "KES 495,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
    status: "available",
    features: ["All-Inclusive Pricing", "Beach Proximity", "Highway Access", "Serviced Plots", "Utilities on Site"],
  },
  {
    id: 5,
    title: "Mtondia Highway Gardens",
    location: "Mtondia, Kilifi County",
    type: "residential",
    price: "KES 1,250,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
    status: "available",
    features: ["Highway Access", "University Proximity", "Serviced Plots", "Water & Electricity", "Secure Location"],
  },
  {
    id: 6,
    title: "Malindi Airport Gardens",
    location: "Ganda Furunzi Area, Malindi",
    type: "beach",
    price: "KES 950,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287215/Malindi_Airport_Gardens_dphmr6.jpg",
    status: "available",
    features: ["Prime Location", "Airport Proximity", "Coastal Bliss", "High Growth Potential", "Secure Community"],
  },
  {
    id: 7,
    title: "Msabaha Phase 6",
    location: "Malindi, Kizingo Area",
    type: "residential",
    price: "KES 450,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287397/Msabaha_Phase_6_2_vebo06.jpg",
    status: "available",
    features: ["Strategic Location", "Perfect for Holiday Homes", "Airport Proximity", "Fast-Growing Area", "Water & Electricity Available"],
  },
  {
    id: 8,
    title: "Bofa Phase 21",
    location: "Bofa, Kilifi County",
    type: "residential",
    price: "KES 1,850,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767291293/Bofa_Phase_21_17_ss7xhv.jpg",
    status: "available",
    features: ["Tarmacked Road Access", "Water & Electricity", "Well Demarcated", "Perimeter Fence", "Flexible Payment Terms"],
  },
];
