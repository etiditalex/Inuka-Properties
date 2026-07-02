"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import FacebookPixel from "@/components/FacebookPixel";
import FacebookAdLandingCapture from "@/components/FacebookAdLandingCapture";
import PropertyDetailsForm from "@/components/property/PropertyDetailsForm";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID } from "@/lib/facebook/pixel";

type PropertyPreview = {
  id: number;
  title: string;
  location: string;
  price: string;
  size: string;
  image: string;
  description: string | null;
};

function GetPropertyDetailsForm() {
  const searchParams = useSearchParams();
  const propertyIdParam = searchParams.get("property_id");
  const campaignPropertyId = propertyIdParam
    ? Number(propertyIdParam)
    : FACEBOOK_CAMPAIGN_PROPERTY_ID;
  const isCampaignPage = campaignPropertyId === FACEBOOK_CAMPAIGN_PROPERTY_ID;

  const [property, setProperty] = useState<PropertyPreview | null>(null);

  useEffect(() => {
    if (!propertyIdParam) return;
    fetch(`/api/content/properties/${propertyIdParam}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.property) {
          setProperty({
            id: data.property.id,
            title: data.property.title,
            location: data.property.location,
            price: data.property.price,
            size: data.property.size,
            image: data.property.image,
            description: data.property.description ?? null,
          });
        }
      })
      .catch(() => {});
  }, [propertyIdParam]);

  const propertyId = property?.id ?? campaignPropertyId;
  const propertyTitle = property?.title ?? "this property";

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <FacebookAdLandingCapture />
      {isCampaignPage ? (
        <FacebookPixel
          propertyId={FACEBOOK_CAMPAIGN_PROPERTY_ID}
          pagePath="/get-property-details"
        />
      ) : null}
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 font-montserrat mb-3">
            Get Property Details
          </h1>
          <p className="text-dark-600 text-lg max-w-xl mx-auto">
            Enter your details below and we&apos;ll email you full project information instantly.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {property && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white"
            >
              <div className="relative h-48">
                <Image src={property.image} alt={property.title} fill className="object-cover" unoptimized />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-dark-900 font-montserrat">{property.title}</h2>
                <p className="flex items-center gap-1 text-dark-600 mt-1 text-sm">
                  <MapPin size={14} className="text-primary-600" /> {property.location}
                </p>
                <p className="text-2xl font-bold text-primary-700 mt-3">{property.price}</p>
                <p className="text-sm text-dark-500 mt-1">{property.size}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <PropertyDetailsForm
              propertyId={propertyId}
              propertyTitle={propertyTitle}
              source="facebook_ad"
              message="Requested property details via Facebook ad / landing page"
              trackLead={isCampaignPage}
              showHeading={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function GetPropertyDetailsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-dark-500">Loading...</div>}>
      <GetPropertyDetailsForm />
    </Suspense>
  );
}
