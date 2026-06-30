"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { propertySiteVisitWhatsAppUrl } from "@/lib/whatsapp";
import { PROPERTY_DETAILS } from "@/lib/properties/detailFallback";
import type { PropertyDetail } from "@/lib/properties/mapProperty";
import { parseGalleryUrls, propertyImageProps } from "@/lib/images";
import { FACEBOOK_CAMPAIGN_PROPERTY_ID } from "@/lib/facebook/pixel";
import { trackFacebookEvent } from "@/lib/facebook/trackClient";
import PropertyDetailsForm from "@/components/property/PropertyDetailsForm";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const propertyId = parseInt(params.id, 10);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const staticFallback = PROPERTY_DETAILS[propertyId] as PropertyDetail | undefined;
    fetch(`/api/content/properties/${propertyId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
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

  const pageTitle = property.h1 ?? property.title;
  const imageAltBase =
    property.imageAltPrefix ??
    `${property.title} land for sale in ${property.location}`;
  const siteVisitWhatsAppUrl = propertySiteVisitWhatsAppUrl(property.title);
  const galleryImages = parseGalleryUrls(property.gallery, property.image);
  const heroImage = galleryImages[0] ?? property.image;

  // Image Gallery Modal
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
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImageIndex(null)}
      >
        <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-primary-400 transition z-10 bg-black/50 rounded-full p-2"
          >
            <X size={24} className="sm:w-8 sm:h-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-2 sm:left-4 text-white hover:text-primary-400 transition z-10 bg-black/50 rounded-full p-2"
          >
            <ChevronLeft size={32} className="sm:w-10 sm:h-10" />
          </button>
          
          <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
            <Image
              src={currentImage}
              alt={`${imageAltBase} — photo ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-w-full max-h-full"
              quality={90}
              unoptimized={propertyImageProps(currentImage).unoptimized}
            />
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-2 sm:right-4 text-white hover:text-primary-400 transition z-10 bg-black/50 rounded-full p-2"
          >
            <ChevronRight size={32} className="sm:w-10 sm:h-10" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-montserrat bg-black/50 px-4 py-2 rounded-lg">
            Image {selectedImageIndex + 1} of {totalImages}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20">
      <ImageGalleryModal />
      <section className="container mx-auto px-4 py-8">
        <Link
          href="/for-sale"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Properties
        </Link>

        {property.status === "sold" && (
          <div
            className="mb-6 rounded-xl border border-dark-700 bg-dark-900 px-5 py-4 text-white shadow-lg"
            role="status"
          >
            <p className="font-montserrat text-base font-bold">{property.title} is sold out</p>
            <p className="mt-2 text-sm font-montserrat text-white/90 leading-relaxed">
              Plots in this phase are no longer available. See our{" "}
              <Link href="/for-sale" className="font-semibold underline underline-offset-2 hover:text-primary-300">
                current listings
              </Link>{" "}
              or contact us for similar projects in Mariakani and Kilifi County.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div 
              className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => galleryImages.length ? setSelectedImageIndex(0) : null}
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={imageAltBase}
                  fill
                  className="object-cover"
                  unoptimized={propertyImageProps(heroImage).unoptimized}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-dark-100 text-dark-400">
                  No image
                </div>
              )}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-montserrat">
                  {galleryImages.length} Images - Click to view gallery
                </div>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {galleryImages.map((img: string, index: number) => (
                  <div
                    key={`${img}-${index}`}
                    className={`relative h-16 sm:h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border-2 ${
                      index === 0 ? 'border-primary-500' : 'border-transparent hover:border-primary-500'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={img}
                      alt={`${imageAltBase} — thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={propertyImageProps(img).unoptimized}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
          >
            <div className="mb-6 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-4 break-words [overflow-wrap:anywhere]">
                {pageTitle}
              </h1>
              <div className="flex items-start gap-2 text-dark-600 mb-4 min-w-0">
                <MapPin size={20} className="mr-0 shrink-0 mt-1 text-primary-600" />
                <span className="break-words [overflow-wrap:anywhere]">{property.location}</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-6 break-words [overflow-wrap:anywhere]">
                {property.status === "sold" ? (
                  <>
                    <span className="block text-dark-700">Sold out</span>
                    <span className="mt-2 block text-lg font-semibold text-dark-500 line-through sm:text-xl md:text-2xl">
                      {property.price}
                    </span>
                  </>
                ) : (
                  property.price
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Square size={20} className="text-primary-600" />
                <span className="text-dark-600">{property.size}</span>
              </div>
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-primary-600" />
                  <span className="text-dark-600">{property.bedrooms} Bedrooms</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              {property.mapLink && (
                <a
                  href={property.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-dark-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-800 transition text-center"
                >
                  View Map Location
                </a>
              )}
              <a
                href="tel:+254711082084"
                onClick={() => trackContact("phone_call")}
                className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-center flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Call Now
              </a>
              <a
                href="mailto:info@inukaproperties.co.ke"
                onClick={() => trackContact("email")}
                className="block w-full bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition text-center border-2 border-primary-600 flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Email Us
              </a>
              <a
                href={siteVisitWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackSiteVisit}
                className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-center"
              >
                Book Site Visit
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">About this property</h2>
              <p className="text-dark-700 leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
                {property.description}
              </p>
              <div className="mt-8 border-t border-dark-100 pt-8">
                <PropertyDetailsForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                  source={trackCampaignEvent ? "facebook_ad" : "property_page"}
                  trackLead={trackCampaignEvent}
                />
              </div>
            </div>

            {property.pricing && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Available Sizes & Pricing</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(property.pricing).map(([size, price]) => (
                    <div key={size} className="border-2 border-primary-200 rounded-lg p-4 hover:border-primary-400 transition">
                      <div className="text-lg font-semibold text-dark-900 mb-2">{size} Plot</div>
                      <div className="text-2xl font-bold text-primary-600">{price as string}</div>
                      {size === "1/8 Acre" && property.id === 2 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Prime Location</div>
                          <div>• Coastal Ambiance</div>
                          <div>• Highway Access</div>
                        </div>
                      )}
                      {size === "1/4 Acre" && property.id === 2 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Best Value</div>
                          <div>• Larger Development</div>
                          <div>• Investment Potential</div>
                          <div>• Thriving Community</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 4 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Flexible Payments</div>
                          <div>• Highway Proximity</div>
                          <div>• Ready for Development</div>
                          <div>• Utilities Available</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 9 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• All-Inclusive</div>
                          <div>• Beach Proximity</div>
                          <div>• Highway Access</div>
                          <div>• Serviced Plots</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 5 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Highway Access</div>
                          <div>• University Proximity</div>
                          <div>• Serviced Plots</div>
                        </div>
                      )}
                      {size === "1/4 Acre" && property.id === 5 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Best Value</div>
                          <div>• Larger Development</div>
                          <div>• Commercial Potential</div>
                          <div>• Premium Location</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 6 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Prime Location</div>
                          <div>• Airport Proximity</div>
                          <div>• Coastal Bliss</div>
                          <div>• High Growth Potential</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 7 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Strategic Location</div>
                          <div>• Perfect for Holiday Homes</div>
                          <div>• Airport Proximity</div>
                          <div>• Fast-Growing Area</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 8 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Tarmacked Road Access</div>
                          <div>• Water & Electricity</div>
                          <div>• Well Demarcated</div>
                          <div>• Perimeter Fence</div>
                        </div>
                      )}
                      {size === "50x100 (1/8 Acre)" && property.id === 10 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Prime Location - 500m from Bypasses</div>
                          <div>• Affordable Pricing</div>
                          <div>• Zero Interest Payment Plan</div>
                          <div>• High Growth Potential</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 11 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• Prime Location - 1km off Bypass</div>
                          <div>• Water & Electricity on-site</div>
                          <div>• Ready to Build</div>
                          <div>• Perfect for Home or Investment</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 14 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• 600m from Mariakani–Mavueni Bypass</div>
                          <div>• Water & electricity on site</div>
                          <div>• Deposit KES 150,000</div>
                          <div>• Balance within 12 months</div>
                        </div>
                      )}
                      {size === "1/8 Acre" && property.id === 13 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• All-inclusive — no hidden charges</div>
                          <div>• Deposit KES 150,000</div>
                          <div>• Balance within 12 months</div>
                          <div>• 10-year anniversary offer</div>
                        </div>
                      )}
                      {size === "1/4 Acre" && property.id === 13 && (
                        <div className="mt-2 text-sm text-dark-600">
                          <div>• All-inclusive — no hidden charges</div>
                          <div>• Deposit KES 250,000</div>
                          <div>• Balance within 12 months</div>
                          <div>• More space for home or farm</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.paymentPlan && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Flexible Payment Terms</h2>
                <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Deposit:</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {property.paymentPlan.Deposit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Balance:</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {property.paymentPlan.Balance ?? property.paymentPlan["Remaining Balance"]}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Installments:</div>
                      <div className="text-xl font-bold text-dark-900">
                        {property.paymentPlan.Installments ?? property.paymentPlan["Monthly Installments"]}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-700 mb-1">Monthly Payment:</div>
                      <div className="text-xl font-bold text-dark-900">{property.paymentPlan["Monthly Payment"]}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {property.quickInfo && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Quick Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(property.quickInfo).map(([label, value]) => (
                    <div key={label} className="border-l-4 border-primary-600 pl-4">
                      <div className="text-sm font-semibold text-primary-600 mb-1">{label}:</div>
                      <div className="text-dark-700">{value as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Project Features</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {(property.features ?? []).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-dark-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <h3 className="text-xl font-bold text-dark-900 mb-4">Interested?</h3>
              <p className="text-dark-600 mb-6">
                Contact us today to schedule a viewing or get more information about this property.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+254711082084"
                  onClick={() => trackContact("phone_call_sidebar")}
                  className="block text-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  0711 082084
                </a>
                <a
                  href="mailto:info@inukaproperties.co.ke"
                  onClick={() => trackContact("email_sidebar")}
                  className="block text-center bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition border-2 border-primary-600"
                >
                  info@inukaproperties.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

