import { BLOG_ARTICLE_SLUGS, BLOG_POSTS } from "@/lib/blogPosts";
import { STATIC_MARKET_INSIGHTS, STATIC_MARKET_REPORTS } from "@/lib/market-research/catalog";
import { STATIC_NEWS_CATALOG } from "@/lib/news/catalog";
import { STATIC_TESTIMONIALS } from "@/lib/testimonials/catalog";
import { normalizeChatText } from "./text";
import type { ChatbotPage, LiveBlogPost, LiveNewsItem } from "./types";

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const normalized = normalizeChatText(value);
    if (normalized.length < 3 || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out.sort((a, b) => b.length - a.length);
}

function page(
  id: string,
  kind: ChatbotPage["kind"],
  title: string,
  path: string,
  summary: string,
  aliases: string[] = [],
  extraSearch = ""
): ChatbotPage {
  return {
    id,
    kind,
    title,
    path,
    aliases: unique([title, path.replace(/[-/]/g, " "), ...aliases]),
    summary,
    searchText: normalizeChatText(`${title} ${summary} ${aliases.join(" ")} ${extraSearch}`),
  };
}

const BLOG_GUIDES: ChatbotPage[] = [
  page(
    "blog-mariakani-hotspot",
    "blog",
    "Why Mariakani is the New Property Hotspot in Kilifi",
    "/iapl-insider/blogs/why-mariakani-is-new-property-hotspot-kilifi",
    "Mariakani, about 36km from Mombasa on the Nairobi–Mombasa Highway, is shifting from a stopover town into a Kilifi County growth centre. Land is more affordable than Mombasa, Nyali, or Kilifi Town, with the Mariakani–Kaloleni–Mavueni corridor and a KSh 3 billion power substation supporting industry and appreciation. Inuka Afrika’s Tulivu Haven in Kibao Kiche offers 1/8-acre plots from KES 450,000 with water, electricity, and a 12-month plan.",
    ["mariakani hotspot", "why mariakani", "property hotspot kilifi", "invest in mariakani", "mariakani land investment"]
  ),
  page(
    "blog-kilifi-land-demand",
    "blog",
    "Why More Kenyans Are Investing in Land for Sale in Kilifi County",
    "/iapl-insider/blogs/why-more-kenyans-investing-land-for-sale-kilifi-county",
    "Demand for title-deed land in Kilifi County is rising because plots are more affordable than Nairobi or Mombasa, with flexible 12-month installments. Buyers focus on Tezo, Msabaha, Matsangoni, and other coastal growth towns. Inuka Afrika Properties Ltd sells verified plots with title processing and no hidden charges.",
    ["why kenyans investing kilifi", "land for sale kilifi county", "buy land kilifi", "kilifi investment"]
  ),
  page(
    "blog-kikambala-land",
    "blog",
    "Land for Sale Near Kikambala: Prime Coastal Plots, Prices & Why Buyers Are Moving Now",
    "/iapl-insider/blogs/land-for-sale-near-kikambala",
    "Land near Kikambala sits on the North Coast growth path between Mombasa, Kilifi Town, and Malindi. Buyers want affordable coastal plots for homes, holiday use, or land banking — but title-deed searches and due diligence come first. Kikambala Phase 2 is an Inuka Afrika ongoing project with 1/8-acre plots from KES 1,250,000, utilities, and a perimeter fence.",
    ["land near kikambala", "kikambala plots", "plots for sale kikambala", "buy land kikambala"]
  ),
  page(
    "blog-tezo-2026",
    "blog",
    "Why Investing in Tezo Is a Smart Move in 2026",
    "/iapl-insider/blogs/why-investing-in-tezo-is-a-smart-move-2026",
    "Tezo, near Kilifi Town on the North Coast, is growing on the back of better roads, tourist demand, and affordable coastal land. Inuka Afrika’s Tezo projects — including Rafiki @10 and Miliki Tezo na Inuka — offer gated or installment plots from about KES 450,000, close to town amenities.",
    ["why tezo", "invest in tezo", "tezo 2026", "tezo hotspot", "tezo land investment"]
  ),
  page(
    "blog-coastal-2026",
    "blog",
    "Why the Coastal Region Is the Ideal Place to Buy Land in 2026",
    "/iapl-insider/blogs/why-coastal-region-is-ideal-place-to-buy-land-2026",
    "Kenya’s coast — Mariakani, Mtwapa, Kikambala, Kilifi, Malindi, Watamu, Diani, and Bofa — is a 2026 land destination because of infrastructure, tourism, and affordable housing demand. Inuka Afrika helps buyers compare these Kilifi County locations with title-deed plots and flexible payment.",
    ["coastal region 2026", "buy land coast 2026", "why coastal land", "watamu diani mtwapa land"]
  ),
  page(
    "blog-why-land",
    "blog",
    "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate",
    "/iapl-insider/blogs/why-land-investment",
    "Land is a finite, tangible asset that has historically appreciated — especially in Kilifi County along highways and the coast. It can outperform volatile stocks because you can hold, develop, or bank it. Inuka Afrika focuses on title-deed plots in Mariakani, Mtwapa, Tezo, Malindi, and Bofa with installment plans.",
    [
      "why land investment",
      "land vs stocks",
      "building wealth land",
      "land investment guide kenya",
      "why should i invest",
      "should i invest in land",
      "is land a good investment",
    ]
  ),
  page(
    "blog-mombasa-houses",
    "blog",
    "Why Mombasa Is an Ideal Place to Buy Houses in 2026",
    "/iapl-insider/blogs/why-mombasa-is-ideal-place-to-buy-houses-2026",
    "Mombasa remains a core coastal housing market, but many buyers also look just outside the city — Nyali for the office, and Kilifi County towns such as Mariakani, Mtwapa, and Kikambala for more affordable land and houses. Inuka Afrika’s head office is in Nyali, with plots across Kilifi County.",
    ["buy houses mombasa", "mombasa housing 2026", "why mombasa houses"]
  ),
];

function blogPagesFromCatalog(): ChatbotPage[] {
  return BLOG_POSTS.filter((post) => !BLOG_GUIDES.some((guide) => guide.path.endsWith(post.slug))).map((post) =>
    page(
      `blog-${post.slug}`,
      "blog",
      post.title,
      BLOG_ARTICLE_SLUGS.has(post.slug) ? `/iapl-insider/blogs/${post.slug}` : "/iapl-insider/blogs",
      post.excerpt,
      [post.slug.replace(/-/g, " "), post.category, post.title],
      post.category
    )
  );
}

function newsPages(): ChatbotPage[] {
  return STATIC_NEWS_CATALOG.map((item) =>
    page(
      `news-${item.id}`,
      "news",
      item.title,
      "/iapl-insider/news",
      [item.excerpt, ...(item.details ?? [])].join(" "),
      [item.category, item.title]
    )
  );
}

const SITE_PAGES: ChatbotPage[] = [
  page(
    "page-home",
    "faq",
    "Inuka Afrika Properties homepage FAQs",
    "/",
    "Inuka Afrika Properties Limited has plots in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi. The Nyali office is on Links Road opposite Kigothos Hotel. We sell residential, commercial, beach, and affordable housing, plus property management and title issuance. Founded in 2016 (10+ years). Call 0711 082084 or email info@inukaproperties.co.ke. Featured projects: Miliki Tezo na Inuka, Tulivu Haven, Bofa Phase 21, and Malindi Airport Gardens. Most plots use a deposit plus 12-month installments, sometimes with zero interest.",
    ["faq", "frequently asked", "homepage", "where are you located"]
  ),
  page(
    "page-who",
    "about",
    "Who we are",
    "/about-us/who-we-are",
    "Inuka Afrika Properties Limited (IAPL) is a registered developer headquartered in Nyali, Mombasa, with 10+ years in coastal real estate. We sell affordable title-deed land in Kilifi County: Mariakani, Mtwapa, Kikambala, Bofa, Mtondia, Tezo, Chumani, Matsangoni, Mida, Msabaha, Malindi, Chakama, and Marereni. Mission: affordable land, housing, and property services. Vision: regional leader in professional real estate delivery.",
    ["who we are", "about inuka", "company history", "mission vision"]
  ),
  page(
    "page-why-us",
    "about",
    "Why choose Inuka Afrika Properties",
    "/about-us/why-us",
    "Clients choose Inuka Afrika for guaranteed ROI in strategic locations, amenities nearby, prices from about KES 250,000, flexible zero-interest plans, title deeds with fast processing, and value-add such as fencing, access roads, and bush clearing. We won the 2022 Real Estate Investor of the Year award.",
    [
      "why us",
      "why choose inuka",
      "why buy from you",
      "why should i invest",
      "why invest with inuka",
      "reasons to invest",
    ]
  ),
  page(
    "page-team",
    "about",
    "Our team",
    "/about-us/our-team",
    "Leadership includes Joseph Mbugua (Director – Marketing), Josphat Muchere (Director – Projects & IT), Kelvin Ngigi Mbugua (Director – Finance), Ruth Mueni (General Manager), Esther Kibandi (Sales & Marketing Manager), Valentine Kerubo (Head Accountant), Alex Etidit (IT Manager), plus logistics, design, and office administration. Sales, legal, and operations teams cover Kilifi, Mariakani, Mtwapa, and Malindi.",
    ["our team", "directors", "staff", "who runs inuka", "management"]
  ),
  page(
    "page-csr",
    "about",
    "Corporate social responsibility",
    "/about-us/csr",
    "IAPL CSR covers affordable housing access, education support and scholarships, community development in areas we operate, and environmental conservation with sustainable project practices.",
    ["csr", "corporate social", "community", "scholarships", "social responsibility", "corporate social responsibility"]
  ),
  page(
    "page-partners",
    "about",
    "Our partners",
    "/about-us/our-partners",
    "Inuka Afrika works with professional partners across legal, finance, and development to deliver title processing, mortgages, and quality projects. A partnership with a leading financial institution supports mortgage options for clients.",
    ["partners", "partnership", "mortgage partner"]
  ),
  page(
    "service-residential",
    "service",
    "Residential properties",
    "/services/residential-properties",
    "Residential plots and homes across Kilifi County — from affordable starter plots to coastal living — with title deeds and installment plans.",
    ["residential properties", "homes", "houses for sale kilifi"]
  ),
  page(
    "service-commercial",
    "service",
    "Commercial properties",
    "/services/commercial-properties",
    "Commercial plots and spaces on the Kenyan coast for retail, offices, and mixed-use development in growing Kilifi County towns.",
    ["commercial properties", "business plot", "shop space"]
  ),
  page(
    "service-beach",
    "service",
    "Beach properties",
    "/services/beach-properties",
    "Beachfront and ocean-view plots for holiday homes and coastal investment, including Bofa Platinum (about 30m from the beach) and Malindi Airport Gardens.",
    ["beach properties", "beachfront", "holiday home"]
  ),
  page(
    "service-farm",
    "service",
    "Farm land",
    "/services/farm-land",
    "Agricultural land in Chakama and other coastal locations for farming and livestock, with fertile soil and a favourable climate. Title transfer is handled through Inuka Afrika.",
    ["farm land", "farmland", "chakama", "agricultural land", "livestock land"]
  ),
  page(
    "service-housing",
    "service",
    "Affordable housing",
    "/services/affordable-housing",
    "Accessible home-ownership options from about KES 250,000 with flexible zero-interest payment plans across Kilifi County.",
    ["affordable housing", "cheap housing", "low cost houses"]
  ),
  page(
    "service-management",
    "service",
    "Property management",
    "/services/property-management",
    "End-to-end estate management for residential and commercial property, including 24/7 support with engineers, electricians, and plumbers.",
    ["property management", "manage my property", "estate management"]
  ),
  page(
    "service-title",
    "service",
    "Title issuance",
    "/services/title-issuance",
    "We facilitate title deed processing, searches, and transfers. Over 4,513 title deeds have been issued. All marketed plots go through proper documentation.",
    ["title issuance", "title processing", "how to get title deed", "stamp duty"]
  ),
  page(
    "page-services",
    "service",
    "Our services",
    "/services",
    "Full-service coastal real estate: residential, commercial, beach, farm land, affordable housing, property management, and title issuance in Kilifi County.",
    ["services", "what services"]
  ),
  page(
    "page-contact",
    "page",
    "Contact us",
    "/contact-us",
    "Head office: Links Road opposite Kigothos Hotel, P.O. BOX 525-80100, Nyali, Mombasa. Phone/WhatsApp 0711 082084. Email info@inukaproperties.co.ke. Hours: Mon–Fri 8:00 AM–5:00 PM, Sat 9:00 AM–2:00 PM, Sunday closed.",
    ["contact us", "get in touch"]
  ),
  page(
    "page-book-visit",
    "page",
    "Book a site visit",
    "#book-site-visit",
    "Use the Book Site Visit button in the header to schedule a guided visit, or WhatsApp 0711 082084. Kibao Kiche Haven visits run every Wednesday and Saturday; other projects can be scheduled with the sales team.",
    ["book site visit", "schedule viewing", "see the land"]
  ),
  page(
    "page-ongoing",
    "page",
    "Ongoing projects",
    "/for-sale/ongoing-projects",
    "Ongoing developments include Bofa Platinum (beach gated community), Chumani Phase 6, Kikambala Phase 2, and Chumani Phase 3, with sold percentages and target completion dates on the ongoing-projects page.",
    ["ongoing projects", "construction progress", "projects under development"]
  ),
  page(
    "page-showcase",
    "page",
    "Project showcase",
    "/project-showcase",
    "A rotating showcase of Inuka Afrika projects across Kilifi County. Use it for a visual overview, then open a listing for prices and payment plans.",
    ["project showcase", "gallery of projects"]
  ),
  page(
    "page-blogs",
    "blog",
    "IAPL Insider blogs",
    "/iapl-insider/blogs",
    "Investment guides on Mariakani, Tezo, Kikambala, Kilifi County land, coastal buying in 2026, first-time buyers, and title deeds. Ask about any article by topic.",
    ["blog", "blogs", "articles", "iapl insider", "guides"]
  ),
  page(
    "page-news",
    "news",
    "Company news",
    "/iapl-insider/news",
    "Latest IAPL news: project launches such as Rafiki @10 in Tezo, site visits in Mariakani and Kilifi, 10-year anniversary, Kikambala affordable housing, and finance partnerships.",
    ["news", "latest news", "announcements"]
  ),
  page(
    "page-research",
    "page",
    "Market research",
    "/iapl-insider/market-research",
    `Kilifi coastal market insights: about 15% year-over-year growth in coastal values, 9 prime locations served, and typical investment returns around 12–18%. Reports cover the Kilifi 2024 market, coastal investment, and affordable housing. ${STATIC_MARKET_REPORTS.map((r) => r.title).join("; ")}. ${STATIC_MARKET_INSIGHTS.map((i) => `${i.title} ${i.value} ${i.description}`).join("; ")}`,
    ["market research", "market report", "investment returns", "property trends"]
  ),
  page(
    "page-testimonials",
    "page",
    "Client testimonials",
    "/testimonials/client-testimonials",
    `Buyers praise transparent processes and title handling. Examples: John Mwangi (Kilifi residential), Sarah Wanjiku (Mtwapa beachfront), David Ochieng (Mariakani commercial), Grace Akinyi (Kikambala affordable housing), Peter Kamau (Chakama farm land), Mary Njeri (Malindi beach plot).`,
    ["testimonials", "reviews", "client stories", "what clients say"],
    STATIC_TESTIMONIALS.map((t) => `${t.name} ${t.location} ${t.text}`).join(" ")
  ),
  page(
    "page-videos",
    "page",
    "Video gallery",
    "/testimonials/video-gallery",
    "Watch Inuka Afrika project and company videos on the video gallery page (YouTube). Useful if you want a visual walkthrough before a site visit.",
    ["videos", "youtube", "video gallery", "watch video"]
  ),
  page(
    "page-newsletters",
    "page",
    "Newsletters",
    "/testimonials/newsletters",
    "Subscribe for listings, exclusive offers, market insights, company news, and investment tips.",
    ["newsletter", "subscribe", "email updates"]
  ),
  page(
    "page-downloads",
    "page",
    "Downloads",
    "/testimonials/downloads",
    "Download the company profile PDF, current property listings catalog, and project maps (Ridge View, Chumani, Bofa, Rafiki, Msabaha, Mwanda, Mida, Matsangoni, and more).",
    ["downloads page", "brochures page"]
  ),
  page(
    "page-privacy",
    "page",
    "Privacy policy",
    "/privacy-policy",
    "The privacy policy explains how Inuka Afrika Properties collects and uses personal data from the website, lead forms, and WhatsApp enquiries. Read the full policy on the site.",
    ["privacy policy", "data protection", "personal data"]
  ),
  page(
    "page-terms",
    "page",
    "Terms of service",
    "/terms-of-service",
    "Website and service terms (updated January 19, 2026) cover use of inukaproperties.co.ke, listings information, and client responsibilities. Read the full terms on the site.",
    ["terms of service", "terms and conditions", "website terms"]
  ),
  page(
    "page-cookies",
    "page",
    "Cookie policy",
    "/cookie-policy",
    "We use cookies for site function, analytics, and marketing (including Facebook pixel). You can accept or manage cookies from the banner. Details are in the cookie policy.",
    ["cookie policy", "cookies"]
  ),
  page(
    "page-support",
    "page",
    "Support",
    "/support",
    "For after-sales or technical support, use the public support form or call 0711 082084 / email info@inukaproperties.co.ke.",
    ["support", "help desk", "complaint"]
  ),
];

export function getStaticChatbotPages(): ChatbotPage[] {
  return [...BLOG_GUIDES, ...blogPagesFromCatalog(), ...newsPages(), ...SITE_PAGES];
}

export function mergeLiveChatbotPages(
  pages: ChatbotPage[],
  liveBlogs?: LiveBlogPost[],
  liveNews?: LiveNewsItem[]
): ChatbotPage[] {
  const merged = [...pages];
  const known = new Set(pages.map((item) => normalizeChatText(item.title)));

  for (const post of liveBlogs ?? []) {
    const key = normalizeChatText(post.title);
    if (!post.title || known.has(key)) continue;
    const slug = post.slug || "";
    merged.push(
      page(
        `live-blog-${slug || key}`,
        "blog",
        post.title,
        slug ? `/iapl-insider/blogs/${slug}` : "/iapl-insider/blogs",
        post.excerpt || post.title,
        [slug.replace(/-/g, " "), post.category || "blog"]
      )
    );
    known.add(key);
  }

  for (const item of liveNews ?? []) {
    const key = normalizeChatText(item.title);
    if (!item.title || known.has(key)) continue;
    merged.push(
      page(
        `live-news-${key}`,
        "news",
        item.title,
        "/iapl-insider/news",
        [item.excerpt, ...(item.details ?? [])].filter(Boolean).join(" ") || item.title,
        [item.title]
      )
    );
    known.add(key);
  }

  return merged;
}

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "your", "our", "with", "from", "this", "that",
  "what", "when", "who", "how", "can", "does", "do", "is", "in", "on", "of", "to", "a", "an",
  "please", "tell", "give", "need", "want", "about", "any", "have", "has", "was", "were", "they",
]);

export function contentQuestion(message: string): boolean {
  return [
    "why",
    "blog",
    "article",
    "news",
    "guide",
    "tips",
    "invest",
    "investment",
    "hotspot",
    "csr",
    "team",
    "partner",
    "testimonial",
    "review",
    "privacy",
    "cookie",
    "newsletter",
    "video",
    "research",
    "market",
    "first time",
    "first-time",
    "who we are",
    "why us",
    "farm land",
    "farmland",
    "management",
    "terms",
  ].some((word) => (word.includes(" ") ? message.includes(word) : new RegExp(`(?:^|\\W)${word}(?:$|\\W)`).test(message)));
}

export function scoreChatbotPage(message: string, item: ChatbotPage): number {
  let score = 0;
  const compact = message.replace(/\s+/g, "");
  for (const alias of item.aliases) {
    if (!message.includes(alias) && !compact.includes(alias.replace(/\s+/g, ""))) continue;
    if (alias.length >= 8) score += Math.min(40, alias.length);
    else if (alias.length >= 3) score += 24;
  }
  const tokens = message.split(" ").filter((token) => token.length >= 4 && !STOP_WORDS.has(token));
  for (const token of tokens) {
    if (normalizeChatText(item.title).includes(token)) score += 10;
    if (item.aliases.some((alias) => alias.includes(token))) score += 6;
    if (item.searchText.includes(token)) score += 3;
  }
  if (item.kind === "blog" && /\b(why|invest|hotspot|guide|blog|article)\b/.test(message)) score += 8;
  return score;
}

export function findBestChatbotPages(
  message: string,
  pages: ChatbotPage[],
  limit = 3,
  minScore = 14
): { page: ChatbotPage; score: number }[] {
  return pages
    .map((item) => ({ page: item, score: scoreChatbotPage(message, item) }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
