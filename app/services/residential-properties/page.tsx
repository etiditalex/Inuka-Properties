"use client";

import { motion } from "framer-motion";
import { Home, ChevronRight, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ResidentialPropertiesPage() {
  const features = [
    "Prime locations across Kilifi County",
    "Affordable housing units to luxury beachfront villas",
    "Modern architecture and quality construction",
    "Off-plan projects to ready-to-move-in homes",
    "Flexible payment plans available",
    "Title deeds included with all properties",
  ];

  const locations = [
    "Mariakani", "Mtwapa", "Kikambala", "Bofa", "Tezo", 
    "Chumani", "Msabaha", "Malindi", "Mtondia"
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
                <Link href="/" className="flex items-center hover:text-red-600 transition">
                  <Home size={18} className="stroke-2" />
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <Link href="/services" className="text-dark-600 hover:text-red-600 transition font-montserrat">
                  Services
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <span className="text-dark-900 font-montserrat">Residential Properties</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Residential Properties
              </h1>
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Discover your dream home in prime coastal locations across Kilifi County
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden"
            >
              <Image
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg"
                alt="Residential Properties"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-6 font-montserrat">
                Your Dream Home Awaits
              </h2>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                At Inuka Afrika Properties, we offer a diverse range of residential properties designed to meet your unique lifestyle needs. From affordable housing units perfect for first-time buyers to luxury beachfront villas for those seeking premium living, we have something for everyone.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                Our residential properties are strategically located across the beautiful coastal region of Kenya, offering you the perfect blend of modern living and natural beauty. Each property is carefully selected and developed with attention to detail, ensuring quality construction and modern architecture.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                Whether you're looking for an off-plan project to invest in or a ready-to-move-in home, we provide complete solutions from initial consultation to final handover. Our flexible payment plans make homeownership accessible, and all properties come with title deeds for your peace of mind.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark-900 mb-6 font-montserrat">
                Key Features
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-red-600 mt-1 flex-shrink-0" size={24} />
                    <p className="text-dark-600 font-montserrat">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center font-montserrat">
            Available Locations
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition text-center"
              >
                <MapPin className="text-red-600 mx-auto mb-2" size={24} />
                <p className="font-semibold text-dark-900 font-montserrat">{location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-lg mb-8 text-white/90 font-montserrat max-w-2xl mx-auto">
            Contact us today to explore our residential property options and find the perfect home for you and your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition font-montserrat"
            >
              Contact Us
            </Link>
            <Link
              href="/for-sale"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition font-montserrat"
            >
              View Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

