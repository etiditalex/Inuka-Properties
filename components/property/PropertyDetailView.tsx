"use client";

import { useState, useEffect, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { Phone, Mail, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PROPERTY_DETAILS } from "@/lib/properties/detailFallback";
import type { PropertyDetail } from "@/lib/properties/mapProperty";
import { parseGalleryUrls, propertyImageProps } from "@/lib/images";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID } from "@/lib/facebook/pixel";
import { trackFacebookEvent } from "@/lib/facebook/trackClient";
import PropertyDetailsForm from "@/components/property/PropertyDetailsForm";
import BookSiteVisitButton from "@/components/BookSiteVisitButton";
import PropertyLocationMap from "@/components/PropertyLocationMap";
import PropertyEngagementBar from "@/components/property/PropertyEngagementBar";
import PropertyShareButtons from "@/components/property/PropertyShareButtons";
import PropertyPaymentCalculator from "@/components/property/PropertyPaymentCalculator";
import PropertyDetailSidebar from "@/components/property/PropertyDetailSidebar";
import PropertyDetailResources from "@/components/property/PropertyDetailResources";
import { pricingNotes } from "@/components/property/pricingNotes";
import { hydratePropertyEngagement } from "@/lib/properties/engagementClient";
import { buildMapEmbedSrc } from "@/lib/maps";

const ACTION_BUTTON =
  "inline-flex min-h-[43px] w-full items-center justify-center gap-2 rounded-[5px] bg-primary-700 px-[29px] py-[13px] text-center font-montserrat text-sm font-normal uppercase tracking-[2px] text-white transition hover:bg-primary-800 sm:w-auto";

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 font-montserrat text-base font-bold text-primary-700">{children}</h2>;
}

function SectionRule() {
  return <hr className="my-2.5 border-0 border-t border-dotted border-[#bbbbbb]" />;
}

function filledEntries(record?: Record<string, string>) {
  return Object.entries(record ?? {}).filter(([, value]) => typeof value === "string" && value.trim().length > 0);
}

export default function PropertyDetailView({
  propertyId,
  initialProperty,
}: {
  propertyId: number;
  initialProperty: PropertyDetail | null;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [property, setProperty] = useState<PropertyDetail | null>(initialProperty);
  const [loading, setLoading] = useState(!initialProperty);

  useEffect(() => {
    const staticFallback = PROPERTY_DETAILS[propertyId] as PropertyDetail | undefined;
    fetch(`/api/content/properties/${propertyId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.engagement) {
          hydratePropertyEngagement({ [String(data.property?.id ?? propertyId)]: data.engagement });
        }
        setProperty(data?.property ?? staticFallback ?? null);
      })
      .catch(() => {
        setProperty(staticFallback ?? null);
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  const trackCampaignEvent = propertyId === FACEBOOK_CAMPAIGN_PROPERTY_ID;

  useEffect(() => {
    if (!trackCampaignEvent || !property) return;
    trackFacebookEvent(
      "ViewContent",
      {
        property_id: property.id,
        property_name: property.title,
        page_path: `/for-sale/${property.id}`,
      },
      {
        customData: {
          content_name: property.title,
          content_ids: [String(property.id)],
          content_type: "product",
          value: property.price,
        },
      }
    );
  }, [trackCampaignEvent, property]);

  const trackContact = (action: string) => {
    if (!trackCampaignEvent || !property) return;
    trackFacebookEvent(
      "Contact",
      {
        property_id: property.id,
        property_name: property.title,
        event_data: { action },
      },
      { customData: { content_name: property.title } }
    );
  };

  const trackSiteVisit = () => {
    if (!trackCampaignEvent || !property) return;
    trackFacebookEvent(
      "Schedule",
      {
        property_id: property.id,
        property_name: property.title,
        event_data: { action: "book_site_visit" },
      },
      { customData: { content_name: property.title } }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (isNaN(propertyId) || !property) {
    notFound();
  }

  const imageAltBase =
    property.imageAltPrefix ?? `${property.title} land for sale in ${property.location}`;
  const galleryImages = parseGalleryUrls(property.gallery, property.image);
  const heroImage = galleryImages[0] ?? property.image;
  const headline = property.h1?.trim();
  const showHeadline = Boolean(headline && headline !== property.title.trim());
  const pricing = filledEntries(property.pricing);
  const paymentPlan = filledEntries(property.paymentPlan);
  const quickInfo = filledEntries(property.quickInfo);
  const features = (property.features ?? []).filter((feature) => feature.trim().length > 0);
  const mapHref =
    property.mapLink ||
    (property.location ? `https://maps.google.com/?q=${encodeURIComponent(property.location)}` : null);
  const mapEmbed = buildMapEmbedSrc(property.mapLink, property.location);

  const ImageGalleryModal = () => {
    if (selectedImageIndex === null || !galleryImages.length) return null;

    const currentImage = galleryImages[selectedImageIndex];
    const totalImages = galleryImages.length;

    const nextImage = () => {
      setSelectedImageIndex((prev) => (prev !== null && prev < totalImages - 1 ? prev + 1 : 0));
    };

    const prevImage = () => {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : totalImages - 1));
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={() => setSelectedImageIndex(null)}
      >
        <div className="relative flex h-full w-full max-w-6xl items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
            className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white transition hover:text-primary-400 sm:right-4 sm:top-4"
          >
            <X size={24} className="sm:h-8 sm:w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-2 z-10 rounded-full bg-black/50 p-2 text-white transition hover:text-primary-400 sm:left-4"
          >
            <ChevronLeft size={32} className="sm:h-10 sm:w-10" />
          </button>

          <div className="relative flex h-full max-h-[90vh] w-full items-center justify-center">
            <Image
              src={currentImage}
              alt={`${imageAltBase} — photo ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-full max-w-full object-contain"
              quality={90}
              unoptimized={propertyImageProps(currentImage).unoptimized}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-2 z-10 rounded-full bg-black/50 p-2 text-white transition hover:text-primary-400 sm:right-4"
          >
            <ChevronRight size={32} className="sm:h-10 sm:w-10" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 font-montserrat text-sm text-white">
            Image {selectedImageIndex + 1} of {totalImages}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white pb-16 pt-[96px] md:pt-[161px]">
      <ImageGalleryModal />

      <div className="bg-primary-700 px-[30px] text-white xl:px-0">
        <div className="mx-auto flex min-h-[80px] w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 xl:max-w-[1280px] xl:px-4 2xl:max-w-[1536px]">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="break-words font-montserrat text-xl font-bold leading-7 text-white">{property.title}</h1>
            {property.status === "sold" && (
              <span className="rounded-[5px] bg-white/15 px-2.5 py-1 font-montserrat text-xs font-semibold uppercase tracking-[1px]">
                Sold out
              </span>
            )}
            {property.status === "ongoing" && (
              <span className="rounded-[5px] bg-white/15 px-2.5 py-1 font-montserrat text-xs font-semibold uppercase tracking-[1px]">
                Ongoing
              </span>
            )}
          </div>
          <Link
            href="/for-sale"
            className="shrink-0 font-montserrat text-sm text-white underline-offset-2 hover:underline"
          >
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="px-[30px] py-5 xl:px-0">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 min-[801px]:flex-row min-[801px]:items-start xl:max-w-[1280px] xl:px-4 2xl:max-w-[1536px]">
        <article className="w-full min-w-0 min-[801px]:w-[calc(100%-28%-40px)] min-[801px]:shrink-0">
          {heroImage ? (
            <button
              type="button"
              onClick={() => (galleryImages.length ? setSelectedImageIndex(0) : null)}
              className="mb-4 block w-full overflow-hidden border-0 bg-transparent p-0 text-left xl:h-[400px]"
            >
              {/* Full ratio on phone and tablet. Desktop keeps the column width and a shorter frame; the click opens the full image. */}
              <img
                src={heroImage}
                alt={imageAltBase}
                className="block h-auto w-full max-w-full object-center xl:h-full xl:object-cover"
              />
            </button>
          ) : (
            <p className="mb-4 font-montserrat text-base text-dark-500">No image</p>
          )}

          {galleryImages.length > 1 && (
            <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {galleryImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-16 overflow-hidden border-2 bg-neutral-50 sm:h-20 ${
                    index === 0 ? "border-primary-700" : "border-transparent hover:border-primary-700"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${imageAltBase} — thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={propertyImageProps(img).unoptimized}
                  />
                </button>
              ))}
            </div>
          )}

          {property.status === "sold" && (
            <div className="mb-5 border border-dotted border-[#bbbbbb] px-1 py-3" role="status">
              <p className="font-montserrat text-base font-bold text-black">{property.title} is sold out</p>
              <p className="mt-2 font-montserrat text-base leading-6 text-black">
                Plots in this phase are no longer available. See our{" "}
                <Link href="/for-sale" className="font-semibold text-primary-700 underline underline-offset-2">
                  current listings
                </Link>{" "}
                or contact us for similar projects in Mariakani and Kilifi County.
              </p>
            </div>
          )}

          <PropertyShareButtons propertyId={property.id} title={property.title} location={property.location} />
          <div className="mb-5">
            <PropertyEngagementBar propertyId={property.id} />
          </div>

          {(showHeadline || property.description) && (
            <section>
              <SectionHeading>About this property</SectionHeading>
              {showHeadline && (
                <p className="mb-5 font-montserrat text-base font-bold leading-6 text-primary-700">{headline}</p>
              )}
              {property.description && (
                <p className="mb-5 whitespace-pre-line break-words font-montserrat text-base leading-6 text-black">
                  {property.description}
                </p>
              )}
            </section>
          )}

          {(property.location || property.size || property.bedrooms) && (
            <>
              <SectionRule />
              <section className="my-5">
                <SectionHeading>Location and accessibility</SectionHeading>
                <ul className="list-disc space-y-1 pl-5 font-montserrat text-base leading-6 text-black">
                  {property.location && <li>{property.location}</li>}
                  {property.size && (
                    <li>
                      <span className="font-bold">Plot size</span> – {property.size}
                    </li>
                  )}
                  {property.bedrooms ? (
                    <li>
                      <span className="font-bold">Bedrooms</span> – {property.bedrooms}
                    </li>
                  ) : null}
                </ul>
              </section>
            </>
          )}

          {features.length > 0 && (
            <>
              <SectionRule />
              <section className="my-5">
                <SectionHeading>Project Features</SectionHeading>
                <ul className="list-disc space-y-1 pl-5 font-montserrat text-base leading-6 text-black">
                  {features.map((feature, index) => (
                    <li key={`${feature}-${index}`}>{feature}</li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {quickInfo.length > 0 && (
            <>
              <SectionRule />
              <section className="my-5">
                <SectionHeading>Quick Information</SectionHeading>
                <ul className="list-disc space-y-1 pl-5 font-montserrat text-base leading-6 text-black">
                  {quickInfo.map(([label, value]) => (
                    <li key={label} className="break-words">
                      <span className="font-bold">{label}:</span>{" "}
                      {value.startsWith("http") ? (
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary-800 underline">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {(property.price || pricing.length > 0) && (
            <>
              <SectionRule />
              <section className="my-5">
                <SectionHeading>Available Sizes & Pricing</SectionHeading>
                {property.price && (
                  <p className="mb-5 font-montserrat text-base leading-6 text-black">
                    {property.status === "sold" ? (
                      <>
                        <span className="font-bold">Sold out</span>
                        <span className="mt-1 block line-through">{property.price}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold">Listed price</span> – {property.price}
                      </>
                    )}
                  </p>
                )}
                {pricing.length > 0 && (
                  <ul className="list-disc space-y-2 pl-5 font-montserrat text-base leading-6 text-black">
                    {pricing.map(([size, price]) => {
                      const notes = pricingNotes(property.id, size);
                      return (
                        <li key={size}>
                          <span className="font-bold">{size}</span> – {price}
                          {notes.length > 0 && (
                            <ul className="mt-1 list-disc pl-5">
                              {notes.map((note) => (
                                <li key={note}>{note}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </>
          )}

          {paymentPlan.length > 0 && (
            <>
              <SectionRule />
              <section className="my-5">
                <SectionHeading>Flexible Payment Terms</SectionHeading>
                <ul className="list-disc space-y-1 pl-5 font-montserrat text-base leading-6 text-black">
                  {paymentPlan.map(([label, value]) => (
                    <li key={label}>
                      <span className="font-bold">{label}</span> – {value}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          <PropertyPaymentCalculator
            price={property.price}
            pricing={property.pricing}
            paymentPlan={property.paymentPlan}
            details={[property.description, ...(property.features ?? [])].filter(Boolean).join("\n")}
          />

          <SectionRule />
          <PropertyDetailResources
            propertyId={property.id}
            propertyTitle={property.title}
            mapHref={mapHref}
            afterButtons={
              mapEmbed ? (
                <div className="my-5">
                  <SectionHeading>Property location</SectionHeading>
                  <PropertyLocationMap mapLink={property.mapLink} location={property.location} title={property.title} />
                </div>
              ) : null
            }
          />

          <SectionRule />
          <section className="my-5">
            <SectionHeading>Enquire</SectionHeading>
            <div className="mb-6 flex flex-wrap gap-3">
              <a href="tel:+254711082084" onClick={() => trackContact("phone_call")} className={ACTION_BUTTON}>
                <Phone size={16} aria-hidden="true" />
                Call Now
              </a>
              <a href="mailto:info@inukaproperties.co.ke" onClick={() => trackContact("email")} className={ACTION_BUTTON}>
                <Mail size={16} aria-hidden="true" />
                Email Us
              </a>
              <BookSiteVisitButton
                propertyId={property.id}
                propertyTitle={property.title}
                source={trackCampaignEvent ? "facebook_ad" : "property_page"}
                onNavigate={trackSiteVisit}
                className={ACTION_BUTTON}
              />
              <a
                href="tel:+254711082084"
                onClick={() => trackContact("phone_call_sidebar")}
                className={ACTION_BUTTON}
              >
                0711 082084
              </a>
              <a
                href="mailto:info@inukaproperties.co.ke"
                onClick={() => trackContact("email_sidebar")}
                className={ACTION_BUTTON}
              >
                info@inukaproperties.co.ke
              </a>
            </div>
            <PropertyDetailsForm
              propertyId={property.id}
              propertyTitle={property.title}
              source={trackCampaignEvent ? "facebook_ad" : "property_page"}
              trackLead={trackCampaignEvent}
            />
          </section>
        </article>

        <PropertyDetailSidebar currentId={property.id} />
        </div>
      </div>
    </div>
  );
}
