"use client";

import { motion } from "framer-motion";
import { Home, Building2, Waves, Sprout, TrendingUp, Settings, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Residential Properties",
      description: "Discover your dream home in prime coastal locations across Kilifi County",
      href: "/services/residential-properties",
      color: "bg-red-100 text-red-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg",
    },
    {
      icon: Building2,
      title: "Commercial Properties",
      description: "Prime commercial spaces strategically located across the coastal region",
      href: "/services/commercial-properties",
      color: "bg-cyan-100 text-cyan-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597070/Bofa_Platinum_Estate_6_ptpthd.jpg",
    },
    {
      icon: Waves,
      title: "Beach Properties",
      description: "Exclusive beachfront properties with stunning ocean views",
      href: "/services/beach-properties",
      color: "bg-red-100 text-red-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg",
    },
    {
      icon: Sprout,
      title: "Farm Land",
      description: "Agricultural land in Chakama and other strategic locations",
      href: "/services/farm-land",
      color: "bg-cyan-100 text-cyan-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597073/Bofa_Platinum_Estate_2_xiz8o1.jpg",
    },
    {
      icon: TrendingUp,
      title: "Affordable Housing",
      description: "Accessible housing options to expand home ownership opportunities",
      href: "/services/affordable-housing",
      color: "bg-red-100 text-red-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg",
    },
    {
      icon: Settings,
      title: "Property Management",
      description: "End-to-end services for asset oversight and maintenance",
      href: "/services/property-management",
      color: "bg-cyan-100 text-cyan-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg",
    },
    {
      icon: FileText,
      title: "Title Issuance",
      description: "Efficient facilitation of land ownership documentation",
      href: "/services/title-issuance",
      color: "bg-red-100 text-red-600",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597073/Bofa_Platinum_Estate_2_xiz8o1.jpg",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6 text-dark-600">
                <Link href="/" className="flex items-center hover:text-primary-600 transition">
                  <Home size={18} className="stroke-2" />
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <span className="text-dark-900 font-montserrat">Our Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Comprehensive real estate solutions tailored to your needs
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative h-64 md:h-80"
            >
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="#e5e7eb" strokeWidth="1.5" fill="none">
                  <rect x="20" y="180" width="60" height="100" />
                  <rect x="100" y="150" width="70" height="130" />
                  <rect x="190" y="120" width="80" height="160" />
                  <rect x="290" y="160" width="65" height="120" />
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={service.href} className="block group">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
                        <div className={`absolute top-4 right-4 ${service.color} rounded-lg p-3`}>
                          <Icon size={24} />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-dark-900 mb-2 font-montserrat group-hover:text-red-600 transition">
                          {service.title}
                        </h3>
                        <p className="text-dark-600 font-montserrat mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center text-red-600 font-semibold font-montserrat group-hover:gap-2 transition-all">
                          <span>Learn More</span>
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}







