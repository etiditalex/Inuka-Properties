import { isValidKenyaMobile } from "@/lib/phone/kenya";

const MISSING_PRICE = /ask for pricing|price on request|on request|^poa$|^tba$|^n\/?a$|^tbd$|contact (us )?for|call for|available on request|to be confirmed/i;

export function hasUsablePrice(price?: string | null): boolean {
  if (!price) return false;
  const trimmed = price.trim();
  if (!trimmed) return false;
  if (MISSING_PRICE.test(trimmed)) return false;
  return /\d/.test(trimmed);
}

export function propertyHasPublishedPrice(property: {
  price?: string | null;
  pricing?: Record<string, string>;
}): boolean {
  if (hasUsablePrice(property.price)) return true;
  return Object.values(property.pricing ?? {}).some((value) => hasUsablePrice(value));
}

export function parseKesAmount(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function propertyPriceAmounts(property: {
  price?: string | null;
  pricing?: Record<string, string>;
}): number[] {
  const values = [property.price, ...Object.values(property.pricing ?? {})];
  return values
    .filter((value): value is string => typeof value === "string" && hasUsablePrice(value))
    .map(parseKesAmount)
    .filter((amount) => amount > 0);
}

export type ListingPriceRange = {
  min: number;
  max: number;
  minTitle: string;
  maxTitle: string;
  count: number;
};

export function listingPriceRange(
  properties: { title: string; price?: string | null; pricing?: Record<string, string> }[]
): ListingPriceRange | null {
  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  let minTitle = "";
  let maxTitle = "";
  let count = 0;

  for (const property of properties) {
    const amounts = propertyPriceAmounts(property);
    if (!amounts.length) continue;
    count += 1;
    const localMin = Math.min(...amounts);
    const localMax = Math.max(...amounts);
    if (localMin < min) {
      min = localMin;
      minTitle = property.title;
    }
    if (localMax > max) {
      max = localMax;
      maxTitle = property.title;
    }
  }

  if (!count || !Number.isFinite(min) || max <= 0) return null;
  return { min, max, minTitle, maxTitle, count };
}

export function formatPriceRangeLine(range: ListingPriceRange, scope = "available listings"): string {
  if (range.min === range.max) {
    return `Current ${scope} are priced at ${formatKes(range.min)} (${range.count} published project${range.count === 1 ? "" : "s"}).`;
  }
  return `Price range for ${scope}: ${formatKes(range.min)} – ${formatKes(range.max)} (${range.count} published project${range.count === 1 ? "" : "s"}). Lowest: ${range.minTitle}. Highest: ${range.maxTitle}.`;
}

const PRICE_PHRASES = [
  "price",
  "prices",
  "pricing",
  "cost",
  "how much",
  "bei",
  "quote",
  "quotation",
  "range",
];

export function hasPriceIntent(message: string): boolean {
  return PRICE_PHRASES.some((phrase) =>
    phrase.includes(" ") ? message.includes(phrase) : new RegExp(`(?:^|\\W)${phrase}(?:$|\\W)`, "i").test(message)
  );
}

export function unknownPriceSubject(message: string): string | null {
  const leftover = message
    .replace(/\b(how much|what is|what's|whats|please|tell me|the|a|an|for|of|is|are|price|prices|pricing|cost|quote|quotation|bei)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (leftover.length < 4) return null;
  if (
    /^(they|them|it|this|that|your|our|any|some|current|available|listings?|projects?|plots?|properties|land|range)$/i.test(
      leftover
    )
  ) {
    return null;
  }
  return leftover;
}

export function parseChatContact(text: string): { name?: string; email?: string; phone?: string } {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?254|0)?7\d{8}\b/);
  const withoutContacts = text
    .replace(emailMatch?.[0] ?? "", " ")
    .replace(phoneMatch?.[0] ?? "", " ")
    .replace(/\b(my name is|i am|i'm|name|email|phone|number|call me)\b/gi, " ")
    .replace(/[,:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const phone = phoneMatch?.[0]
    ? phoneMatch[0].startsWith("0") || phoneMatch[0].startsWith("7") || phoneMatch[0].startsWith("+") || phoneMatch[0].startsWith("254")
      ? phoneMatch[0]
      : phoneMatch[0]
    : undefined;

  return {
    email: emailMatch?.[0],
    phone: phone && (isValidKenyaMobile(phone) || /^(?:\+?254|0)7\d{8}$/.test(phone.replace(/\s/g, ""))) ? phone : phoneMatch?.[0],
    name: withoutContacts.length >= 2 ? withoutContacts : undefined,
  };
}

export function hasInquiryContact(contact: { name?: string; email?: string; phone?: string }): boolean {
  return Boolean(contact.name?.trim() && (contact.email?.trim() || contact.phone?.trim()));
}
