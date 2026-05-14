export type BlogPostListItem = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  /** ISO yyyy-mm-dd */
  date: string;
  image: string;
  category: string;
  slug: string;
};

/** Posts that have a dedicated article page under `/iapl-insider/blogs/[slug]`. */
export const BLOG_ARTICLE_SLUGS: ReadonlySet<string> = new Set([
  "land-for-sale-near-kikambala",
  "why-investing-in-tezo-is-a-smart-move-2026",
  "why-coastal-region-is-ideal-place-to-buy-land-2026",
  "why-land-investment",
]);

export const BLOG_POSTS: BlogPostListItem[] = [
  {
    id: 7,
    title:
      "Land for Sale Near Kikambala: Prime Coastal Plots, Prices & Why Buyers Are Moving Now",
    excerpt:
      "Looking for verified land for sale near Kikambala? Compare coastal plots in Kilifi County, title-deed checks, access to Mombasa–Malindi highway growth, and how to secure competitive land before prices rise.",
    author: "IAPL Investment Team",
    date: "2026-05-14",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1778739554/land_for_sale_in_kikambala_u9t8mn.jpg",
    category: "Investment",
    slug: "land-for-sale-near-kikambala",
  },
  {
    id: 6,
    title:
      "Why Investing in Tezo Is a Smart Move in 2026: Spotlight on Inuka Afrika Properties’ New Project",
    excerpt:
      "Tezo is quickly becoming one of Kenya’s most promising coastal investment destinations. Here’s why early buyers are moving in now — and how Inuka Afrika Properties’ newest Tezo project creates strong opportunities for investors and homebuyers.",
    author: "IAPL Investment Team",
    date: "2026-02-16",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771578534/WhatsApp_Image_2026-02-16_at_10.12.29_zor4t2.jpg",
    category: "Investment",
    slug: "why-investing-in-tezo-is-a-smart-move-2026",
  },
  {
    id: 5,
    title: "Why the Coastal region Is The Ideal Place To Buy Land In 2026",
    excerpt:
      "Discover why the Coastal region is the perfect destination to buy land in 2026. Explore Mariakani, Mtwapa, Kikambala, Kilifi, Malindi, Watamu, and Diani. Learn about infrastructure growth, affordable housing initiatives, and tourism opportunities.",
    author: "IAPL Investment Team",
    date: "2026-02-20",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768631111/mombasa_2_dazxqj.jpg",
    category: "Investment",
    slug: "why-coastal-region-is-ideal-place-to-buy-land-2026",
  },
  {
    id: 4,
    title:
      "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate",
    excerpt:
      "Discover why land investment is one of the smartest financial decisions you can make. Learn about land investment benefits, strategies, and opportunities in Kenya.",
    author: "IAPL Investment Team",
    date: "2026-02-20",
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767954926/why_land_investment_2_pryhrf.jpg",
    category: "Investment",
    slug: "why-land-investment",
  },
  {
    id: 1,
    title: "10 Tips for First-Time Property Buyers in Kenya",
    excerpt:
      "Essential guidance for navigating your first property purchase in the Kenyan real estate market.",
    author: "IAPL Team",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    category: "Buying Guide",
    slug: "10-tips-first-time-buyers",
  },
  {
    id: 2,
    title: "Understanding Title Deeds: A Complete Guide",
    excerpt:
      "Everything you need to know about property titles and how to ensure a smooth transfer process.",
    author: "IAPL Legal Team",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    category: "Legal",
    slug: "understanding-title-deeds",
  },
  {
    id: 3,
    title: "Investment Opportunities in Kilifi County",
    excerpt:
      "Exploring the growing real estate market in Kilifi and why it's becoming a hotspot for investors.",
    author: "IAPL Research",
    date: "2024-01-05",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    category: "Investment",
    slug: "kilifi-investment-opportunities",
  },
];

export function formatIsoDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function parseLocalNoon(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00`);
}

/** e.g. "MAY 14, 2026" for blog hero cards */
export function formatBlogDateCarousel(isoDate: string): string {
  const date = parseLocalNoon(isoDate);
  return date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function formatLongDateFromIso(isoDate: string): string {
  const date = parseLocalNoon(isoDate);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function getSidebarArticlePosts(
  currentSlug: string,
  limit = 6
): BlogPostListItem[] {
  return BLOG_POSTS.filter(
    (p) => BLOG_ARTICLE_SLUGS.has(p.slug) && p.slug !== currentSlug
  )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
