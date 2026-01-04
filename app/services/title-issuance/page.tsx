"use client";

import { motion } from "framer-motion";
import { FileText, ChevronRight, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TitleIssuancePage() {
  const features = [
    "Complete title deed issuance process",
    "Expert guidance through all legal requirements",
    "Smooth transactions from acquisition to registration",
    "Fast and efficient processing",
    "Experienced team handling all documentation",
    "Secure and reliable service",
  ];

  const process = [
    "Land acquisition verification",
    "Documentation preparation",
    "Legal compliance checks",
    "Title deed application",
    "Registration processing",
    "Final title deed issuance",
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
                <span className="text-dark-900 font-montserrat">Title Issuance</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Title Issuance
              </h1>
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Efficient facilitation of land ownership documentation
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden"
            >
              <Image
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597073/Bofa_Platinum_Estate_2_xiz8o1.jpg"
                alt="Title Issuance"
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
                Secure Your Property Ownership
              </h2>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                We facilitate the complete title deed issuance process, guiding clients through all legal requirements and documentation. Our experienced team ensures smooth transactions from land acquisition to final title registration.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                Our title deed processing is fast and efficient, providing expert assistance and support throughout the entire process to secure your property ownership. We handle all the complex paperwork and legal requirements, making the process as simple as possible for you.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                All our properties come with Title Deeds, and we ensure promptness in title deed production. With over 4,513 title deeds issued, we have a proven track record of delivering secure property ownership documentation efficiently and reliably.
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

      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center font-montserrat">
            Our Title Issuance Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-lg font-montserrat">
                  {index + 1}
                </div>
                <p className="font-semibold text-dark-900 font-montserrat">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Secure Your Property Title Today
          </h2>
          <p className="text-lg mb-8 text-white/90 font-montserrat max-w-2xl mx-auto">
            Contact us to learn more about our title issuance services and ensure your property ownership is properly documented.
          </p>
          <Link
            href="/contact-us"
            className="inline-block bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition font-montserrat"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

