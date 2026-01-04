"use client";

import { motion } from "framer-motion";
import { Building2, ChevronRight, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CommercialPropertiesPage() {
  const features = [
    "Prime commercial spaces in strategic locations",
    "Retail spaces, office buildings, and mixed-use developments",
    "Optimal location advantages and investment potential",
    "Flexible lease and purchase options",
    "Professional property management available",
    "Title deeds included with all purchases",
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
                <span className="text-dark-900 font-montserrat">Commercial Properties</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Commercial Properties
              </h1>
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Prime commercial spaces strategically located across the coastal region of Kenya
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden"
            >
              <Image
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597070/Bofa_Platinum_Estate_6_ptpthd.jpg"
                alt="Commercial Properties"
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
                Strategic Commercial Investments
              </h2>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                We offer prime commercial spaces strategically located across the coastal region of Kenya. Our commercial property portfolio includes retail spaces, office buildings, and mixed-use developments designed to meet diverse business needs.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                Each property is carefully selected to provide optimal location advantages and investment potential. Whether you're looking to establish a retail outlet, set up an office, or invest in a mixed-use development, we have the perfect commercial space for your business.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                Our team provides expert guidance throughout the entire process, from property selection to final acquisition. We offer flexible lease and purchase options, and professional property management services to ensure your investment thrives.
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
                    <CheckCircle2 className="text-cyan-600 mt-1 flex-shrink-0" size={24} />
                    <p className="text-dark-600 font-montserrat">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Invest in Commercial Real Estate Today
          </h2>
          <p className="text-lg mb-8 text-white/90 font-montserrat max-w-2xl mx-auto">
            Contact us to explore our commercial property options and find the perfect space for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition font-montserrat"
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

