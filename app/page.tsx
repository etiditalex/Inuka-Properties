"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Home, Building2, Waves, Sprout, TrendingUp, Bed, Square, ChevronLeft, ChevronRight, DollarSign, Heart, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StructuredData from "@/components/StructuredData";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";

interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  size: string;
  bedrooms?: number;
  image: string;
  featured?: boolean;
}

const featuredProperties: Property[] = [
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    type: "Residential",
    price: "KES 325,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    featured: true,
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    type: "Residential",
    price: "KES 399,000",
    size: "50x100 (1/8 Acre)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    featured: true,
  },
  {
    id: 1,
    title: "Bofa Platinum",
    location: "Bofa, Kilifi County",
    type: "Beach",
    price: "KES 5,990,000",
    size: "1/4 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Chumani Phase 6",
    location: "Chumani, Kilifi County",
    type: "Residential",
    price: "KES 595,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
  },
];

function PropertyCarousel({ properties }: { properties: Property[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  return (
    <div className="lg:hidden relative">
      <div className="relative overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={properties[currentIndex].image}
                  alt={properties[currentIndex].title}
                  fill
                  className="object-cover"
                />
                {properties[currentIndex].featured && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
                  {properties[currentIndex].type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-900 mb-2 font-montserrat">{properties[currentIndex].title}</h3>
                <div className="flex items-center text-dark-600 mb-4">
                  <MapPin size={18} className="mr-2 text-primary-600" />
                  <span className="font-montserrat">{properties[currentIndex].location}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-dark-600">
                    <div className="flex items-center gap-1">
                      <Square size={16} />
                      <span>{properties[currentIndex].size}</span>
                    </div>
                    {properties[currentIndex].bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{properties[currentIndex].bedrooms} Bedrooms</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-dark-200">
                  <div>
                    <div className="text-lg font-normal text-primary-700 font-montserrat whitespace-nowrap">{properties[currentIndex].price}</div>
                  </div>
                  <Link
                    href={`/for-sale/${properties[currentIndex].id}`}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-light hover:bg-red-700 transition font-montserrat whitespace-nowrap"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition z-10"
        aria-label="Previous property"
      >
        <ChevronLeft size={24} className="text-dark-900" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition z-10"
        aria-label="Next property"
      >
        <ChevronRight size={24} className="text-dark-900" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentIndex ? "bg-primary-600 w-6" : "bg-dark-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function PropertyCardsSection() {
  return (
    <section className="py-20 bg-dark-50">
      <div className="w-full px-4 md:px-6 lg:px-8">
        {/* Desktop Grid - 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-700">
                  {property.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-900 mb-2 font-montserrat">{property.title}</h3>
                <div className="flex items-center text-dark-600 mb-4">
                  <MapPin size={18} className="mr-2 text-primary-600" />
                  <span className="font-montserrat">{property.location}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-dark-600">
                    <div className="flex items-center gap-1">
                      <Square size={16} />
                      <span>{property.size}</span>
                    </div>
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms} Bedrooms</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-dark-200">
                  <div>
                    <div className="text-lg font-normal text-primary-700 font-montserrat whitespace-nowrap">{property.price}</div>
                  </div>
                  <Link
                    href={`/for-sale/${property.id}`}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-light hover:bg-red-700 transition font-montserrat whitespace-nowrap"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <PropertyCarousel properties={featuredProperties} />
      </div>
    </section>
  );
}

function WhyInukaSection() {
  const features = [
    {
      icon: Building2,
      title: "WIDE RANGE OF PROPERTIES",
      description: "We Offer A Wide Variety of Property Investment Opportunities.",
    },
    {
      icon: DollarSign,
      title: "FINANCING MADE EASY",
      description: "Our Finance Department Finds Financial Solutions to Help you Invest Safely and Correctly.",
    },
    {
      icon: Heart,
      title: "TRUSTED BY HUNDREDS",
      description: "Over 500+ Clients and 10 Years of Excellence. Multiple Locations Across Coastal Kenya.",
    },
    {
      icon: FileText,
      title: "INVEST IN A PARTNERSHIP",
      description: "With Property Investment at Inuka You get a Premium Real Estate Property and A Market Advisor.",
    },
    {
      icon: CheckCircle2,
      title: "TRANSPARENCY",
      description: "Always Stay Informed about Your Investment and Your Properties.",
    },
    {
      icon: MapPin,
      title: "PRIME LOCATIONS",
      description: "Every Project is Carefully selected to be Nearby Top Social Prime Locations.",
    },
  ];

  return (
    <section className="py-20 bg-dark-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-montserrat">
            Why Inuka Properties
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-red-600 border-2 border-red-700 rounded-lg p-6 hover:border-red-500 transition"
            >
              <div className="flex flex-col items-center md:items-start">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <feature.icon 
                    size={48} 
                    className="text-white stroke-2" 
                    strokeWidth={2}
                    fill="none"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 font-montserrat text-white text-center md:text-left">
                  {feature.title}
                </h3>
                <p className="text-white/90 leading-relaxed font-montserrat text-center md:text-left">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersCarouselSection() {
  const partners = [
    {
      name: "Kimisitu Sacco",
      logo: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767561074/Kimisitu_sacco_gagqxz.jpg",
    },
    {
      name: "Tower Sacco",
      logo: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767561074/Tower_sacco_e1j8jt.jpg",
    },
    {
      name: "Nacico Sacco",
      logo: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767561074/Nacico_sacco_nghadi.jpg",
    },
    {
      name: "Tramom Sacco",
      logo: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767561074/Tramom_sacco_kky79y.jpg",
    },
  ];

  // Duplicate partners array for seamless infinite scroll
  // We need enough duplicates to ensure smooth looping
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-20 bg-dark-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4 font-montserrat">
            Our Partners
          </h2>
          <p className="text-lg text-dark-600 font-montserrat">
            Trusted partnerships that help us deliver exceptional service
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          {/* Infinite Scrolling Carousel */}
          <div className="flex animate-partners-carousel gap-8">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`partner-${index}`}
                className="flex-shrink-0"
              >
                <div className="w-48 h-32 md:w-64 md:h-40 bg-white rounded-lg shadow-md p-4 flex items-center justify-center hover:shadow-xl transition-all hover:scale-105">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={240}
                    height={140}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CounterSection() {
  const counters = [
    { number: 10, suffix: "+", label: "Years Experience" },
    { number: 10000, suffix: "+", label: "Happy Clients" },
    { number: 4513, suffix: "", label: "Title Deed Issued" },
    { number: 200, suffix: "", label: "Workforce" },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597070/Bofa_Platinum_Estate_6_ptpthd.jpg"
          alt="Bofa Platinum Estate"
          fill
          className="object-cover"
          quality={90}
        />
      </div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-dark-900/70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <CounterItem
              key={index}
              targetNumber={counter.number}
              suffix={counter.suffix}
              label={counter.label}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterItem({ 
  targetNumber, 
  suffix, 
  label, 
  delay 
}: { 
  targetNumber: number; 
  suffix: string; 
  label: string; 
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = targetNumber / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, targetNumber]);

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={isVisible ? { scale: 1 } : { scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-400 font-montserrat"
      >
        {count}
        {suffix}
      </motion.div>
      <div className="text-white/90 font-medium mt-2 font-montserrat">{label}</div>
    </motion.div>
  );
}

export default function HomePage() {
  // Structured Data for Homepage - Location-based SEO
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Inuka Afrika Properties Limited",
    "url": "https://www.inukaproperties.co.ke",
    "description": "Real estate properties for sale in Kilifi County, Kenya. Properties available in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Links Road Opposite Kigothos Hotel",
      "addressLocality": "Nyali",
      "addressRegion": "Mombasa",
      "postalCode": "80100",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-4.048",
      "longitude": "39.709"
    },
    "areaServed": [
      "Kilifi", "Mariakani", "Mtwapa", "Kikambala", "Bofa", 
      "Chumani", "Tezo", "Msabaha", "Mtondia", "Malindi", "Nyali"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Properties",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Properties in Mariakani",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Mariakani, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Mtwapa",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Mtwapa, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Kikambala",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Kikambala, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Bofa",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Bofa, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Chumani",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Chumani, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Tezo",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Tezo, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Msabaha",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Msabaha, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Mtondia",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Mtondia, Kilifi County"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Properties in Malindi",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Properties in Malindi, Kilifi County"
              }
            }
          ]
        }
      ]
    }
  };

  // FAQ Structured Data for AI Overview
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where are Inuka Afrika Properties located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inuka Afrika Properties Limited has properties in Kilifi County, Kenya, specifically in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi. Our head office is located in Nyali, Mombasa at Links Road Opposite Kigothos Hotel."
        }
      },
      {
        "@type": "Question",
        "name": "What types of properties does Inuka Afrika Properties offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inuka Afrika Properties offers residential plots, commercial properties, beach properties, and affordable housing solutions in Kilifi County. We also provide property management, title issuance, and feasibility study services."
        }
      },
      {
        "@type": "Question",
        "name": "How long has Inuka Afrika Properties been in business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inuka Afrika Properties Limited was founded in 2016 and has been operating for over 10 years, serving clients across the coastal region of Kenya with excellence in real estate solutions."
        }
      },
      {
        "@type": "Question",
        "name": "What is the contact information for Inuka Afrika Properties?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact Inuka Afrika Properties Limited at phone number 0711 082084 or email info@inukaproperties.co.ke. Our office is located at Links Road Opposite Kigothos Hotel, P.O. BOX 525-80100, Nyali, Mombasa, Kenya."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer payment plans for properties?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Inuka Afrika Properties offers flexible payment plans for most properties. Payment terms typically include a deposit followed by monthly installments over 12 months, with some properties offering zero-interest payment plans."
        }
      }
    ]
  };

  return (
    <div className="pt-24">
      <StructuredData data={homepageStructuredData} />
      <StructuredData data={faqStructuredData} />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767596630/kilifi_investment_swq82s.jpg"
            alt="Kilifi Investment Properties"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/70 to-dark-900/60"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat drop-shadow-lg whitespace-nowrap">
                Coastal Gate To <span className="text-primary-300">Real Estate</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md max-w-4xl mx-auto font-montserrat">
                We Connect Investors to Coastal Property Market through Trust, Innovation, and Personalized Service & Partnership, Delivering Prime Land & Long-term Value Across the Continent.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/for-sale"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-montserrat"
                >
                  Discover More
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join the Family Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-900 mb-6 font-montserrat text-left w-full">
              Join the Family
            </h2>
            <p className="text-base md:text-lg font-normal text-dark-600 leading-relaxed font-montserrat text-left w-full">
              Our portfolio of Properties is as diverse as Your Dreams. Explore the following categories to find the Perfect Property that resonates with your Vision of Home or Investment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Property Cards Section */}
      <PropertyCardsSection />

      {/* Why Inuka Properties Section */}
      <WhyInukaSection />

      {/* Counter Numbers Section */}
      <CounterSection />

      {/* Partners Carousel Section */}
      <PartnersCarouselSection />

      {/* Google Reviews Section */}
      <GoogleReviewsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto font-montserrat">
              Join hundreds of satisfied clients who have found their dream properties with us
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link
                href="/for-sale"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg text-center w-full font-montserrat"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact-us"
                className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition shadow-lg border-2 border-white text-center w-full font-montserrat"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
