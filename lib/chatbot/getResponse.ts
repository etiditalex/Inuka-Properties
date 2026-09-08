import {
  allChatbotProperties,
  BOOK_VISIT_PATH,
  COMPANY_PROFILE_PATH,
  DOWNLOADS_PAGE_PATH,
  FOR_SALE_PATH,
  PROPERTY_LISTINGS_PDF_PATH,
  relatedDownloadsForProperty,
} from "./knowledge";
import { contentQuestion, findBestChatbotPages } from "./sitePages";
import { normalizeChatText } from "./text";
import type { ChatbotDownload, ChatbotKnowledge, ChatbotProperty, ChatbotReply, ChatLink } from "./types";

const GREETING_RE = /(?:^|\s)(hello|hi|hey|habari|hujambo|mambo|good morning|good afternoon|good evening)(?:\s|$|[!.?])/i;

function hasWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, "i").test(text);
}

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => (word.includes(" ") ? text.includes(word) : hasWord(text, word)));
}

function parsePriceAmount(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : Number.MAX_SAFE_INTEGER;
}

function statusLabel(status: string): string {
  const value = status.toLowerCase();
  if (value === "sold") return "Sold out";
  if (value === "ongoing") return "Ongoing project";
  return "Available";
}

function availableProperties(knowledge: ChatbotKnowledge): ChatbotProperty[] {
  return allChatbotProperties(knowledge).filter((property) => property.status !== "sold");
}

function formatRecord(record?: Record<string, string>): string {
  if (!record) return "";
  return Object.entries(record)
    .map(([key, value]) => `• ${key}: ${value}`)
    .join("\n");
}

function propertyLinks(property: ChatbotProperty, downloads: ChatbotDownload[]): ChatLink[] {
  const links: ChatLink[] = [
    { label: `View ${property.title}`, href: property.path },
    { label: "Book a site visit", href: BOOK_VISIT_PATH },
  ];
  if (property.mapLink) {
    links.push({ label: "Open map location", href: property.mapLink });
  }
  for (const download of relatedDownloadsForProperty(property, downloads).slice(0, 3)) {
    links.push({ label: download.title, href: download.fileUrl });
  }
  return links;
}

function listingLinks(): ChatLink[] {
  return [
    { label: "Browse all properties", href: FOR_SALE_PATH },
    { label: "Property listings PDF", href: PROPERTY_LISTINGS_PDF_PATH },
    { label: "Company profile", href: COMPANY_PROFILE_PATH },
    { label: "All downloads", href: DOWNLOADS_PAGE_PATH },
    { label: "Book a site visit", href: BOOK_VISIT_PATH },
  ];
}

const LOCATION_ALIASES = new Set([
  "mariakani",
  "tezo",
  "malindi",
  "bofa",
  "chumani",
  "mtwapa",
  "kikambala",
  "mtondia",
  "msabaha",
  "watamu",
  "mombasa",
  "kilifi",
]);

function distinctlyNamedProperties(message: string, hits: ChatbotProperty[]): ChatbotProperty[] {
  return hits.filter((property) =>
    property.aliases.some((alias) => {
      if (!message.includes(alias)) return false;
      if (alias.split(" ").length >= 2) return true;
      return !LOCATION_ALIASES.has(alias);
    })
  );
}

function pageResponse(
  matches: { page: { title: string; summary: string; path: string; kind: string } }[]
): ChatbotReply {
  const primary = matches[0].page;
  const extras = matches.slice(1);
  const extraLines = extras.length
    ? `\n\nRelated reading:\n${extras.map((item) => `• ${item.page.title}`).join("\n")}`
    : "";
  return {
    text: `${primary.title}\n\n${primary.summary}${extraLines}\n\nOpen the page below for the full write-up.`,
    links: [
      {
        label: primary.kind === "blog" ? "Read the article" : `Open: ${primary.title}`,
        href: primary.path,
      },
      ...extras.slice(0, 3).map((item) => ({ label: item.page.title, href: item.page.path })),
      { label: "All blogs", href: "/iapl-insider/blogs" },
    ],
  };
}

function summarizeProperty(property: ChatbotProperty): string {
  const size = property.size ? ` • ${property.size}` : "";
  return `• ${property.title} — ${property.price}${size}\n  ${property.location} (${statusLabel(property.status)})`;
}

function detailResponse(property: ChatbotProperty, knowledge: ChatbotKnowledge, intent: string): ChatbotReply {
  const highlights = property.features.slice(0, 6).map((feature) => `• ${feature}`).join("\n");
  const pricing = formatRecord(property.pricing);
  const payment = formatRecord(property.paymentPlan);
  const faqHit = property.faqs.find((faq) => {
    const q = normalizeChatText(faq.question);
    return (
      (intent === "price" && (q.includes("how much") || q.includes("price") || q.includes("plot"))) ||
      (intent === "visit" && q.includes("site visit")) ||
      (intent === "title" && q.includes("title"))
    );
  });

  const lines = [
    `${property.title} — ${statusLabel(property.status)}`,
    `📍 ${property.location}`,
    `💰 ${property.price}${property.size ? `  •  ${property.size}` : ""}`,
  ];

  if (intent === "payment" && payment) {
    lines.push("", "Payment plan:", payment);
  } else if (intent === "price" && (pricing || payment)) {
    if (pricing) lines.push("", "Plot prices:", pricing);
    if (payment) lines.push("", "Payment plan:", payment);
  } else {
    if (highlights) lines.push("", highlights);
    if (payment) lines.push("", "Payment plan:", payment);
  }

  if (faqHit) {
    lines.push("", faqHit.answer);
  } else if (property.status === "sold") {
    lines.push(
      "",
      "This project is sold out. I can show similar available plots, or you can download our current listings."
    );
  }

  lines.push("", "Tap a link below for the listing, maps, or to book a site visit.");

  return {
    text: lines.join("\n"),
    links: propertyLinks(property, knowledge.downloads),
  };
}

function listResponse(title: string, properties: ChatbotProperty[]): ChatbotReply {
  if (!properties.length) {
    return {
      text: "I don't have a matching listing in that category right now. Browse all current plots or download our property catalog.",
      links: listingLinks(),
      suggestWhatsApp: true,
    };
  }

  const body = properties.map(summarizeProperty).join("\n");
  return {
    text: `${title}\n\n${body}\n\nAsk me about any project by name for prices, payment plans, and downloadable maps.`,
    links: [
      ...properties.slice(0, 4).map((property) => ({ label: property.title, href: property.path })),
      ...listingLinks(),
    ],
  };
}

function matchProperties(message: string, knowledge: ChatbotKnowledge): ChatbotProperty[] {
  const scored: { property: ChatbotProperty; length: number }[] = [];
  for (const property of allChatbotProperties(knowledge)) {
    const alias = property.aliases.find((item) => message.includes(item));
    if (alias) scored.push({ property, length: alias.length });
  }
  if (!scored.length) return [];
  const max = Math.max(...scored.map((item) => item.length));
  const specific = scored.filter((item) => item.length === max).map((item) => item.property);
  const unique = new Map(specific.map((property) => [property.id, property]));
  return [...unique.values()];
}

function matchDownloads(message: string, knowledge: ChatbotKnowledge): ChatbotDownload[] {
  const compactMessage = message.replace(/\s+/g, "");
  const scored: { download: ChatbotDownload; length: number }[] = [];
  for (const download of knowledge.downloads) {
    for (const alias of download.aliases) {
      const compactAlias = alias.replace(/\s+/g, "");
      const hit =
        (alias.length >= 5 && message.includes(alias)) ||
        (compactAlias.length >= 8 && compactMessage.includes(compactAlias));
      if (hit) {
        scored.push({ download, length: alias.length });
        break;
      }
    }
  }
  if (!scored.length) return [];
  const max = Math.max(...scored.map((item) => item.length));
  const unique = new Map(scored.filter((item) => item.length === max).map((item) => [item.download.id, item.download]));
  return [...unique.values()];
}

function locationMatches(message: string, knowledge: ChatbotKnowledge): ChatbotProperty[] {
  const locations = [
    "mariakani",
    "kibao kiche",
    "mtwapa",
    "kikambala",
    "bofa",
    "chumani",
    "tezo",
    "msabaha",
    "mtondia",
    "malindi",
    "watamu",
    "matsangoni",
    "mida",
    "nyali",
    "mombasa",
  ];
  const hit = locations.find((location) => message.includes(location));
  if (!hit) return [];
  return allChatbotProperties(knowledge).filter((property) =>
    normalizeChatText(`${property.title} ${property.location}`).includes(hit)
  );
}

function downloadCatalogReply(knowledge: ChatbotKnowledge, specific?: ChatbotDownload[]): ChatbotReply {
  if (specific?.length) {
    const lines = specific.map((item) => `• ${item.title}`);
    return {
      text: `Here ${specific.length === 1 ? "is the file" : "are the files"} you can download:\n\n${lines.join("\n")}\n\nYou can also get the full company profile and current property listings.`,
      links: [
        ...specific.map((item) => ({ label: item.title, href: item.fileUrl })),
        { label: "Property listings PDF", href: PROPERTY_LISTINGS_PDF_PATH },
        { label: "Company profile", href: COMPANY_PROFILE_PATH },
        { label: "All downloads", href: DOWNLOADS_PAGE_PATH },
      ],
    };
  }

  const maps = knowledge.downloads.filter((item) => item.parentId != null).slice(0, 8);
  const roots = knowledge.downloads.filter((item) => item.parentId == null);
  const mapLines = maps.map((item) => `• ${item.title}`).join("\n");
  return {
    text: `You can download our materials first-hand from the website:\n\n• Inuka Afrika Company Profile\n• Current Property Listings catalog\n• Project maps (Ridge View, Chumani, Bofa, Rafiki, Msabaha, Mwanda, Mida, Matsangoni, and more)\n\n${mapLines ? `Sample maps:\n${mapLines}\n\n` : ""}Ask me for a specific project map, for example "Ocean View map" or "Mwanda Phase 3 map".`,
    links: [
      ...roots.map((item) => ({ label: item.title, href: item.fileUrl })),
      { label: "All downloads & maps", href: DOWNLOADS_PAGE_PATH },
    ],
  };
}

export function getChatbotResponse(
  userMessage: string,
  knowledge: ChatbotKnowledge,
  options?: { lastBotText?: string }
): ChatbotReply {
  const message = normalizeChatText(userMessage);
  if (!message) {
    return { text: "Please type a question about our properties, prices, payment plans, or downloads." };
  }

  const lastBot = options?.lastBotText ? normalizeChatText(options.lastBotText) : "";
  const askedWhatsApp = lastBot.includes("whatsapp");
  if (askedWhatsApp && /^(yes|yeah|yep|sure|ok|okay|please|do it|open it)\b/.test(message)) {
    return {
      text: "Great — I’ll open WhatsApp so our team can assist you personally.",
      suggestWhatsApp: true,
      openWhatsApp: true,
    };
  }

  if (GREETING_RE.test(userMessage) && message.split(" ").length <= 4) {
    const featured = availableProperties(knowledge).slice(0, 4);
    return {
      text: `Hello! Welcome to Inuka Afrika Properties. I can share current plots, prices, payment plans, blog guides, and downloadable maps.\n\nPopular listings:\n${featured.map(summarizeProperty).join("\n")}\n\nAsk about a project by name, a blog topic (for example why Mariakani), or say "downloads" for brochures and maps.`,
      links: listingLinks(),
    };
  }

  if (hasAny(message, ["thank", "thanks", "asante"])) {
    return { text: "You’re welcome. Ask me about any project, blog article, payment plan, or download anytime." };
  }

  const downloadIntent = hasAny(message, [
    "download",
    "brochure",
    "catalog",
    "catalogue",
    "pdf",
    "map",
    "maps",
    "company profile",
    "listings pdf",
  ]);
  const priceIntent = hasAny(message, ["price", "prices", "cost", "how much", "affordable", "cheap", "cheapest"]);
  const paymentIntent = hasAny(message, ["payment", "installment", "instalment", "deposit", "plan", "monthly"]);
  const visitIntent = hasAny(message, ["visit", "viewing", "tour", "site visit"]);
  const titleIntent = hasAny(message, ["title", "deed", "title deed"]);

  const propertyHits = matchProperties(message, knowledge);
  const downloadHits = downloadIntent ? matchDownloads(message, knowledge) : [];
  const pageHits = findBestChatbotPages(message, knowledge.pages ?? []);
  const askingContent = contentQuestion(message);
  const listingIntent = hasAny(message, [
    "property",
    "properties",
    "plot",
    "plots",
    "land",
    "listing",
    "listings",
    "available",
    "for sale",
    "buy",
  ]);
  const distinctProps = distinctlyNamedProperties(message, propertyHits);

  if (downloadIntent) {
    if (propertyHits.length === 1) {
      const related = relatedDownloadsForProperty(propertyHits[0], knowledge.downloads);
      if (related.length) return downloadCatalogReply(knowledge, related);
    }
    if (downloadHits.length || !propertyHits.length) {
      return downloadCatalogReply(knowledge, downloadHits.length ? downloadHits : undefined);
    }
  }

  if (
    pageHits.length &&
    askingContent &&
    !hasAny(message, ["tulivu", "rafiki", "mwanda", "platinum", "miliki"])
  ) {
    return pageResponse(pageHits);
  }

  if (distinctProps.length === 1) {
    const intent = paymentIntent ? "payment" : priceIntent ? "price" : visitIntent ? "visit" : titleIntent ? "title" : "detail";
    return detailResponse(distinctProps[0], knowledge, intent);
  }

  if (distinctProps.length > 1) {
    return listResponse("I found more than one matching project:", distinctProps);
  }

  if (pageHits.length && (!listingIntent || pageHits[0].score >= 28)) {
    return pageResponse(pageHits);
  }

  if (propertyHits.length === 1) {
    const intent = paymentIntent ? "payment" : priceIntent ? "price" : visitIntent ? "visit" : titleIntent ? "title" : "detail";
    return detailResponse(propertyHits[0], knowledge, intent);
  }

  if (propertyHits.length > 1) {
    return listResponse("I found more than one matching project:", propertyHits);
  }

  const byLocation = locationMatches(message, knowledge);
  if (byLocation.length && listingIntent) {
    return listResponse(`Properties in that area:`, byLocation);
  }

  if (hasAny(message, ["beach", "beachfront", "ocean", "coastal"])) {
    return listResponse(
      "Beach and coastal listings:",
      allChatbotProperties(knowledge).filter((property) =>
        /beach|bofa|malindi|ocean/i.test(`${property.type} ${property.title} ${property.location}`)
      )
    );
  }

  if (hasAny(message, ["cheapest", "lowest", "budget", "affordable"])) {
    const cheapest = availableProperties(knowledge)
      .slice()
      .sort((a, b) => parsePriceAmount(a.price) - parsePriceAmount(b.price))
      .slice(0, 5);
    return listResponse("Most affordable available plots right now:", cheapest);
  }

  if (hasAny(message, ["sold out", "sold-out"])) {
    return listResponse(
      "Sold-out reference projects (similar plots may still be available):",
      allChatbotProperties(knowledge).filter((property) => property.status === "sold")
    );
  }

  if (
    hasAny(message, ["property", "properties", "plot", "plots", "listing", "listings", "available", "for sale", "buy"])
  ) {
    return listResponse("Current Inuka Afrika properties:", availableProperties(knowledge));
  }

  if (paymentIntent) {
    return {
      text: "Yes — most plots have a flexible 12-month plan: pay a deposit, then clear the balance in monthly installments (often with zero interest).\n\nExamples:\n• Tulivu Haven — KES 450,000 (deposit KES 150,000, ~KES 25,000/month)\n• Kibao Kiche Haven — KES 399,000 (deposit KES 100,000, zero interest)\n• Msabaha Phase 8 — from KES 395,000 (deposit KES 150,000)\n• Bofa Phase 21 — KES 1,850,000 (deposit KES 700,000)\n\nAsk me about a specific project for its exact plan, or download the listings PDF.",
      links: listingLinks(),
    };
  }

  if (priceIntent) {
    const cheapest = availableProperties(knowledge)
      .slice()
      .sort((a, b) => parsePriceAmount(a.price) - parsePriceAmount(b.price))
      .slice(0, 6);
    return listResponse("Current starting prices (available plots):", cheapest);
  }

  if (visitIntent) {
    return {
      text: "Site visits are available for all current projects. Kibao Kiche Haven visits run every Wednesday and Saturday. Tell me which project you want to see, or book online / continue on WhatsApp.",
      links: [
        { label: "Book a site visit", href: BOOK_VISIT_PATH },
        { label: "View properties", href: FOR_SALE_PATH },
      ],
      suggestWhatsApp: true,
    };
  }

  if (hasAny(message, ["office", "address", "head office", "nyali", "located"])) {
    return {
      text: "Our head office is at Links Road, opposite Kigothos Hotel, P.O. BOX 525-80100, Nyali, Mombasa, Kenya.\n\nHours: Mon–Fri 8:00 AM–5:00 PM, Sat 9:00 AM–2:00 PM, Sunday closed.\nPhone: 0711 082084\nEmail: info@inukaproperties.co.ke",
      links: [{ label: "Contact us", href: "/contact-us" }],
    };
  }

  if (hasAny(message, ["contact", "phone", "email", "number", "call", "whatsapp"])) {
    return {
      text: "You can reach Inuka Afrika Properties at:\n📞 0711 082084 (call or WhatsApp)\n📧 info@inukaproperties.co.ke\n📍 Links Road, opposite Kigothos Hotel, Nyali, Mombasa\n\nWould you like me to open WhatsApp for you?",
      links: [{ label: "Contact us", href: "/contact-us" }, { label: "Book a site visit", href: BOOK_VISIT_PATH }],
      suggestWhatsApp: true,
    };
  }

  if (hasAny(message, ["hour", "hours", "opening hours", "business hours"])) {
    return {
      text: "Business hours:\n• Monday–Friday: 8:00 AM – 5:00 PM\n• Saturday: 9:00 AM – 2:00 PM\n• Sunday: Closed",
    };
  }

  if (hasAny(message, ["service", "services", "what do you offer", "what do you do"])) {
    return {
      text: "We offer:\n✅ Residential, commercial, beach, and farm land sales\n✅ Affordable housing\n✅ Property management\n✅ Title issuance (4,513+ title deeds processed)\n✅ Site visits and investor guidance across Kilifi County\n\nPlots are in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, Malindi, Matsangoni, Mida, Chakama, and Marereni.",
      links: [
        { label: "Our services", href: "/services" },
        { label: "Properties for sale", href: FOR_SALE_PATH },
      ],
    };
  }

  if (titleIntent) {
    return {
      text: "All Inuka Afrika plots are processed with title deeds. We have issued over 4,513 title deeds and our legal team handles documentation, stamp duty, and transfer. Ask about a specific project if you want its current paperwork status.",
      links: [{ label: "Title issuance", href: "/services/title-issuance" }],
      suggestWhatsApp: true,
    };
  }

  if (hasAny(message, ["about", "company", "who are you", "inuka", "iapl", "experience", "founded", "established"])) {
    return {
      text: "Inuka Afrika Properties Limited (IAPL) is a coastal Kenya developer founded in 2016, with over 10 years in real estate. We have delivered 70+ projects and served 10,000+ clients.\n\nWe sell affordable title-deed land in Kilifi County — residential, commercial, beach, and farm plots — with flexible payment plans from our Nyali, Mombasa head office.\n\nDownload the company profile for the full overview.",
      links: [
        { label: "Company profile PDF", href: COMPANY_PROFILE_PATH },
        { label: "Who we are", href: "/about-us/who-we-are" },
        { label: "All downloads", href: DOWNLOADS_PAGE_PATH },
      ],
    };
  }

  if (hasAny(message, ["award", "awards", "achievement", "recognition"])) {
    return {
      text: "Inuka Afrika Properties won the 2022 Real Estate Investor of the Year Award, reflecting our work on affordable title-deed land and customer service across the Kenyan coast.",
    };
  }

  const featured = availableProperties(knowledge).slice(0, 4);
  const fallbackPages = findBestChatbotPages(message, knowledge.pages ?? [], 2, 10);
  if (fallbackPages.length) {
    return pageResponse(fallbackPages);
  }

  return {
    text: `I can help with that from our website. Here are current listings:\n\n${featured.map(summarizeProperty).join("\n")}\n\nYou can also ask about a blog topic (Mariakani, Tezo, Kikambala, land investment), download our catalog, or name a project.`,
    links: [
      ...listingLinks(),
      { label: "Blogs & guides", href: "/iapl-insider/blogs" },
      { label: "News", href: "/iapl-insider/news" },
    ],
    suggestWhatsApp: true,
  };
}
