export type WebsiteNewsItem = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  featured: boolean;
  details?: string[];
};

export const STATIC_NEWS_CATALOG: WebsiteNewsItem[] = [
  {
    id: 5,
    title: "Rafiki @10 (Tezo Plots) – Prime Plots Now Selling",
    excerpt:
      "Rafiki @10 is strategically located off the Kilifi–Malindi Highway, just 500m from Tezo Town, in a fast-growing and well-developed area. Enjoy graded access with internal all-weather murram roads, a perimeter fence with a common gated entrance, reliable water availability, and close proximity to schools, hospitals, and markets — ideal for immediate residential use or long-term investment.",
    date: "2026-02-14",
    category: "Project Launch",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771130486/Tezo_Plots_kbcorr.jpg",
    featured: true,
    details: [
      "Location: Tezo, Kilifi County (500m from Tezo Town)",
      "Access: Off the Kilifi–Malindi Highway",
      "10 acres subdivided into 72 units",
      "Perimeter fence with common gated entrance",
      "Graded access & internal all-weather murram roads",
      "Reliable water availability",
      "Close to schools, hospitals & markets",
      "Uncontrolled development — build at your own pace",
      "Price: KES 650,000 per plot",
      "Valentine + Inuka @10 Combo Offer (valid until end of February): Pay 50% (KES 325,000) → 10% off (KES 585,000) OR pay KES 200,000 → 5% off (KES 617,500)",
      "Map location: https://maps.google.com/?q=-3.535695,39.896584",
    ],
  },
  {
    id: 1,
    title: "Site Visits Happening in Mariakani and Kilifi",
    excerpt:
      "Join us for exciting site visits to our plots of land in Mariakani and Kilifi. Clients are visiting our prime land plots to explore exceptional investment opportunities in these strategic locations. Book your visit today to see the plots firsthand with our expert sales team.",
    date: "2026-02-01",
    category: "Site Visits",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768629737/site_visit_highlight_i53mqx.jpg",
    featured: true,
    details: [
      "Site visits available in Mariakani and Kilifi",
      "Explore our plots of land in prime locations",
      "Personalized attention from our expert sales team",
      "Book in advance to secure your spot",
    ],
  },
  {
    id: 2,
    title: "Inuka Afrika Properties Celebrates 10 Years of Excellence",
    excerpt:
      "We're proud to mark a decade of transforming the real estate landscape in Kenya with quality properties and exceptional service.",
    date: "2024-01-20",
    category: "Company News",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    featured: false,
  },
  {
    id: 3,
    title: "New Affordable Housing Project Launched in Kikambala",
    excerpt:
      "Exciting new development offering affordable housing solutions in prime coastal location with flexible payment plans.",
    date: "2024-01-18",
    category: "Project Launch",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    featured: false,
  },
  {
    id: 4,
    title: "Partnership with Leading Financial Institution Announced",
    excerpt:
      "New mortgage solutions now available for our clients through strategic partnership with major financial institutions.",
    date: "2024-01-12",
    category: "Partnership",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    featured: false,
  },
];
