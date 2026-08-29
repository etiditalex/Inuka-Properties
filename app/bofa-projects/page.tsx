import Link from "next/link";
import PropertyListingCard from "@/components/PropertyListingCard";
import { getPropertySeo } from "@/lib/propertySeo";

const BOFA_LISTINGS = [
  { id: 1, type: "beach", size: "1/8 & 1/4 Acre" },
  { id: 8, type: "residential", size: "1/8 Acre" },
];

export default function BofaProjectsPage() {
  const properties = BOFA_LISTINGS.map((listing) => {
    const seo = getPropertySeo(listing.id);
    return {
      id: listing.id,
      title: seo?.title ?? `Bofa project ${listing.id}`,
      location: seo?.location ?? "Bofa, Kilifi County",
      type: listing.type,
      price: seo?.price ?? "",
      size: listing.size,
      image: seo?.image ?? "",
      status: seo?.soldOut ? ("sold" as const) : ("available" as const),
    };
  });

  return (
    <div className="pt-24 pb-20">
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-sm text-dark-500 font-montserrat">
            <Link href="/" className="hover:text-primary-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/for-sale" className="hover:text-primary-700">
              For Sale
            </Link>
            <span className="mx-2">/</span>
            <span className="text-dark-800">Bofa Projects</span>
          </p>
          <h1 className="font-montserrat text-3xl font-bold text-dark-900 md:text-4xl">
            Bofa Projects
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-dark-600 font-montserrat md:text-lg">
            Beachfront and roadside plots in Bofa, Kilifi County — Bofa Platinum
            and Bofa Phase 21.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-5xl">
          {properties.map((property) => (
            <PropertyListingCard
              key={property.id}
              property={property}
              imageHeightClass="h-[220px] sm:h-[260px]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
