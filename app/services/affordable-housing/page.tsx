"use client";

import { motion } from "framer-motion";
import { TrendingUp, ChevronRight, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AffordableHousingPage() {
  const features = [
    "Accessible housing options for everyone",
    "Flexible payment plans with zero interest",
    "Affordable prices starting from KSh 250,000",
    "Strategic locations across Kilifi County",
    "Modern design and quality construction",
    "Title deeds included with all properties",
  ];

  return (
    <div className="pt-24 pb-20">
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
                <span className="text-dark-900 font-montserrat">Affordable Housing</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Affordable Housing
              </h1>
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Accessible housing options to expand home ownership opportunities
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
                alt="Affordable Housing"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-6 font-montserrat">
                Making Homeownership Accessible
              </h2>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                At Inuka Afrika Properties, we believe that everyone deserves the opportunity to own a home. Our affordable housing solutions are designed to make homeownership accessible to a wider range of people, with prices starting from as low as KSh 250,000.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                We offer flexible payment plans with zero interest, making it easier for you to achieve your dream of homeownership. Our affordable housing projects are strategically located across Kilifi County, providing you with modern, quality homes in prime locations.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                Each property is built with modern design principles and quality construction, ensuring that affordability doesn't mean compromising on quality. All our affordable housing units come with secure title deeds, giving you complete ownership and peace of mind.
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

      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Start Your Homeownership Journey
          </h2>
          <p className="text-lg mb-8 text-white/90 font-montserrat max-w-2xl mx-auto">
            Contact us today to explore our affordable housing options and take the first step towards owning your home.
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

