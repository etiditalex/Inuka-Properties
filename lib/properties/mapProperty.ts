import type { Property } from "@/lib/supabase/types";

export type PropertyDetail = {
  id: number;
  title: string;
  h1?: string;
  location: string;
  type: string;
  price: string;
  size: string;
  bedrooms?: number;
  image: string;
  imageAltPrefix?: string;
  mapLink?: string;
  gallery?: string[];
  description?: string;
  features?: string[];
  pricing?: Record<string, string>;
  paymentPlan?: Record<string, string>;
  quickInfo?: Record<string, string>;
  status?: string;
};

export function mapDbPropertyToDetail(db: Property): PropertyDetail {
  let paymentPlan: Record<string, string> | undefined;
  if (db.payment_plan) {
    if (typeof db.payment_plan === "object") {
      paymentPlan = db.payment_plan as Record<string, string>;
    } else {
      try {
        paymentPlan = JSON.parse(db.payment_plan) as Record<string, string>;
      } catch {
        paymentPlan = undefined;
      }
    }
  }

  return {
    id: db.id,
    title: db.title,
    h1: db.h1 ?? undefined,
    location: db.location,
    type: db.type,
    price: db.price,
    size: db.size,
    bedrooms: db.bedrooms ?? undefined,
    image: db.image,
    mapLink: db.map_link ?? undefined,
    gallery: db.gallery?.length ? db.gallery : [db.image],
    description: db.description ?? undefined,
    features: db.features ?? [],
    pricing: db.pricing ?? {},
    paymentPlan,
    quickInfo: db.quick_info ?? {},
    status: db.status,
  };
}

export function mapDetailToDbRow(
  detail: PropertyDetail,
  catalog?: { featured?: boolean; status?: string; features?: string[] }
) {
  const priceAmount = parseInt(detail.price.replace(/[^\d]/g, ""), 10) || null;
  return {
    id: detail.id,
    title: detail.title,
    location: detail.location,
    type: detail.type,
    price: detail.price,
    price_amount: priceAmount,
    size: detail.size,
    image: detail.image,
    gallery: detail.gallery ?? [detail.image],
    status: catalog?.status ?? detail.status ?? "available",
    featured: catalog?.featured ?? false,
    features: catalog?.features ?? detail.features ?? [],
    description: detail.description ?? null,
    h1: detail.h1 ?? null,
    map_link: detail.mapLink ?? null,
    pricing: detail.pricing ?? {},
    payment_plan: detail.paymentPlan ?? {},
    quick_info: detail.quickInfo ?? {},
    published: true,
  };
}
