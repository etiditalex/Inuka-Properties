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
import {
  formatPriceRangeLine,
  hasPriceIntent,
  listingPriceRange,
  propertyHasPublishedPrice,
  unknownPriceSubject,
} from "./pricing";
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

function pricedAvailable(knowledge: ChatbotKnowledge): ChatbotProperty[] {
  return availableProperties(knowledge).filter((property) => propertyHasPublishedPrice(property));
}

function rangeLineFor(properties: ChatbotProperty[], scope = "available listings"): string {
  const range = listingPriceRange(properties);
  return range ? formatPriceRangeLine(range, scope) : "";
}

function investWhyResponse(knowledge: ChatbotKnowledge, locationPages: { page: { title: string; summary: string; path: string } }[]): ChatbotReply {
  const range = rangeLineFor(pricedAvailable(knowledge), "available listings on the website");
  const extra = locationPages[0]
    ? `\n\nOn ${locationPages[0].page.title.toLowerCase().includes("why") ? "this location" : "your topic"}:\n${locationPages[0].page.summary}`
    : "";
  return {
    text: [
      "Why invest with Inuka Afrika Properties",
      "",
      "• Title-deed land — we have processed 4,513+ title deeds, so ownership is documented.",
      "• Affordable entry — published plots on the site start in the mid-KES 300,000s, with flexible 12-month plans (often zero interest).",
      "• Kilifi County growth — Mariakani, Tezo, Kikambala, Bofa, Malindi and the coast are seeing new roads, power, and tourism demand.",
      "• Market context — our research notes about 15% year-over-year coastal value growth and typical investor talk of 12–18% annual returns (not a guarantee).",
      "• Land is finite — you can hold, build, or bank it; Inuka adds roads, fencing, and utilities on many projects.",
      "• Track record — 10+ years, 70+ projects, 10,000+ clients, and 2022 Real Estate Investor of the Year.",
      range ? `\n${range}` : "",
      extra,
      "",
      "Read the guides below, or ask about a specific project. If you want a personal recommendation, share your name and phone and I’ll send it to our sales team.",
    ]
      .filter((line) => line !== "")
      .join("\n"),
    links: [
      { label: "Why invest in land", href: "/iapl-insider/blogs/why-land-investment" },
      { label: "Why choose Inuka", href: "/about-us/why-us" },
      { label: "Kilifi land demand", href: "/iapl-insider/blogs/why-more-kenyans-investing-land-for-sale-kilifi-county" },
      { label: "Market research", href: "/iapl-insider/market-research" },
      ...locationPages.slice(0, 2).map((item) => ({ label: item.page.title, href: item.page.path })),
      { label: "Browse listings", href: FOR_SALE_PATH },
    ],
  };
}

function unansweredInquiry(question: string, knowledge: ChatbotKnowledge): ChatbotReply {
  const range = rangeLineFor(pricedAvailable(knowledge));
  return {
    text: `I don’t have a complete answer for that on the website yet.${range ? `\n\n${range}` : ""}\n\nI’ll send your question to our sales team on the admin inquiries dashboard so they can follow up.\n\nPlease share your name plus a phone number or email.`,
    collectInquiry: {
      kind: "question",
      question,
      subject: `Chatbot question — ${question.slice(0, 80)}`,
    },
    links: [{ label: "Or use the contact form", href: "/contact-us" }],
  };
}

function missingPriceInquiry(
  property: ChatbotProperty | null,
  question: string,
  knowledge: ChatbotKnowledge,
  hint?: string | null
): ChatbotReply {
  const title = property?.title || hint || "that project";
  const range = rangeLineFor(pricedAvailable(knowledge));
  const rangeNote = range ? `\n\n${range}` : "";
  return {
    text: `I checked our live listings and don’t have a published price for ${title} right now.${rangeNote}\n\nI’ll send this to the sales team as an inquiry on the admin dashboard so they can confirm the current figure and get back to you.\n\nPlease share your name plus a phone number or email.`,
    collectInquiry: {
      kind: "price",
      propertyId: property && property.id < 1000 ? property.id : null,
      propertyTitle: property?.title || hint || null,
      question,
    },
    links: [{ label: "Or use the contact form", href: "/contact-us" }, { label: "Browse listings", href: FOR_SALE_PATH }],
  };
}

function livePriceResponse(property: ChatbotProperty, knowledge: ChatbotKnowledge): ChatbotReply {
  const pricing = formatRecord(property.pricing);
  const payment = formatRecord(property.paymentPlan);
  const range = rangeLineFor(pricedAvailable(knowledge), "all live listings on the website");
  const lines = [
    `Live price — ${property.title}`,
    `📍 ${property.location}`,
    `💰 ${property.price}${property.size ? `  •  ${property.size}` : ""}`,
    `Status: ${statusLabel(property.status)}`,
  ];
  if (pricing) lines.push("", "Plot prices:", pricing);
  if (payment) lines.push("", "Payment plan:", payment);
  if (range) lines.push("", range);
  lines.push("", "This figure is from our current published listing. Ask if you want a site visit.");
  return {
    text: lines.join("\n"),
    links: propertyLinks(property, knowledge.downloads),
  };
}

function detailResponse(property: ChatbotProperty, knowledge: ChatbotKnowledge, intent: string): ChatbotReply {
  if (intent === "price") {
    return propertyHasPublishedPrice(property)
      ? livePriceResponse(property, knowledge)
      : missingPriceInquiry(property, `${property.title} price`, knowledge);
  }

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

function listResponse(title: string, properties: ChatbotProperty[], rangeScope?: string): ChatbotReply {
  if (!properties.length) {
    return {
      text: "I don't have a matching listing in that category right now. Browse all current plots or download our property catalog.",
      links: listingLinks(),
      suggestWhatsApp: true,
    };
  }

  const range = rangeLineFor(
    properties.filter((property) => propertyHasPublishedPrice(property)),
    rangeScope
  );
  const body = properties.map(summarizeProperty).join("\n");
  return {
    text: `${title}${range ? `\n${range}` : ""}\n\n${body}\n\nAsk me about any project by name for prices, payment plans, and downloadable maps.`,
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
      text: `Hello! Welcome to Inuka Afrika Properties. I can share current plots, live prices, payment plans, blog guides, and downloadable maps.\n\n${rangeLineFor(featured, "these featured listings")}\n\nPopular listings:\n${featured.map(summarizeProperty).join("\n")}\n\nAsk about a project by name, say "price range", or "downloads" for brochures and maps.`,
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
  const priceIntent = hasPriceIntent(message) || hasAny(message, ["affordable", "cheap", "cheapest"]);
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

  if (priceIntent && !hasAny(message, ["cheapest", "lowest", "budget", "affordable"])) {
    if (hasAny(message, ["range", "between", "from and to", "starting from"])) {
      const scoped = propertyHits.length
        ? propertyHits.filter((property) => propertyHasPublishedPrice(property))
        : pricedAvailable(knowledge);
      return listResponse(
        "Live price range for listings on the website:",
        scoped.slice().sort((a, b) => parsePriceAmount(a.price) - parsePriceAmount(b.price)),
        propertyHits.length ? "these matching listings" : "available listings on the website"
      );
    }
    const named = distinctProps[0] || (propertyHits.length === 1 ? propertyHits[0] : undefined);
    if (named) {
      return propertyHasPublishedPrice(named)
        ? livePriceResponse(named, knowledge)
        : missingPriceInquiry(named, userMessage, knowledge);
    }
    if (propertyHits.length > 1) {
      const missing = propertyHits.filter((property) => !propertyHasPublishedPrice(property));
      if (missing.length === propertyHits.length) {
        return missingPriceInquiry(propertyHits[0], userMessage, knowledge);
      }
      return listResponse(
        "Live published prices for matching projects:",
        propertyHits.filter(propertyHasPublishedPrice),
        "these matching listings"
      );
    }
    const hint = unknownPriceSubject(message);
    if (hint) {
      return missingPriceInquiry(null, userMessage, knowledge, hint);
    }
  }

  const investIntent =
    hasAny(message, [
      "why invest",
      "should i invest",
      "should we invest",
      "reason to invest",
      "reasons to invest",
      "good investment",
      "why buy land",
      "why land",
      "why choose",
      "why inuka",
      "roi",
      "return on investment",
      "appreciation",
    ]) ||
    (hasWord(message, "why") && hasAny(message, ["invest", "investment", "kilifi", "coast", "coastal"]));

  if (investIntent) {
    return investWhyResponse(knowledge, pageHits.filter((item) => item.page.kind === "blog" || item.page.id === "page-why-us"));
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
    return listResponse(`Properties in that area:`, byLocation, "listings in that area");
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
      .filter((property) => propertyHasPublishedPrice(property))
      .slice()
      .sort((a, b) => parsePriceAmount(a.price) - parsePriceAmount(b.price))
      .slice(0, 5);
    return listResponse(
      "Most affordable available plots right now (live published prices):",
      cheapest,
      "these affordable listings"
    );
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
    return listResponse("Current Inuka Afrika properties:", availableProperties(knowledge), "available listings");
  }

  if (paymentIntent) {
    return {
      text: "Yes — most plots have a flexible 12-month plan: pay a deposit, then clear the balance in monthly installments (often with zero interest).\n\nExamples:\n• Tulivu Haven — KES 450,000 (deposit KES 150,000, ~KES 25,000/month)\n• Kibao Kiche Haven — KES 399,000 (deposit KES 100,000, zero interest)\n• Msabaha Phase 8 — from KES 395,000 (deposit KES 150,000)\n• Bofa Phase 21 — KES 1,850,000 (deposit KES 700,000)\n\nAsk me about a specific project for its exact plan, or download the listings PDF.",
      links: listingLinks(),
    };
  }

  if (priceIntent) {
    const named = distinctProps[0] || propertyHits[0];
    if (named) {
      return propertyHasPublishedPrice(named)
        ? livePriceResponse(named, knowledge)
        : missingPriceInquiry(named, userMessage, knowledge);
    }
    const hint = unknownPriceSubject(message);
    if (hint) {
      return missingPriceInquiry(null, userMessage, knowledge, hint);
    }
    const priced = pricedAvailable(knowledge)
      .slice()
      .sort((a, b) => parsePriceAmount(a.price) - parsePriceAmount(b.price));
    return listResponse("Current published prices (live from our listings):", priced, "available listings on the website");
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

  const fallbackPages = findBestChatbotPages(message, knowledge.pages ?? [], 2, 12);
  if (fallbackPages.length) {
    return pageResponse(fallbackPages);
  }

  return unansweredInquiry(userMessage, knowledge);
}

export function peekNamedPropertyIds(userMessage: string, knowledge: ChatbotKnowledge): number[] {
  const message = normalizeChatText(userMessage);
  const hits = distinctlyNamedProperties(message, matchProperties(message, knowledge));
  return (hits.length ? hits : matchProperties(message, knowledge))
    .map((property) => property.id)
    .filter((id) => id < 1000);
}
