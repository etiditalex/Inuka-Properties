"use client";

import { motion } from "framer-motion";
import { Settings, ChevronRight, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PropertyManagementPage() {
  const features = [
    "24/7 property management services",
    "Residential and commercial estate management",
    "Dedicated team of specialized professionals",
    "Engineers, Electricians, and Plumbers on call",
    "First-class property maintenance",
    "Comprehensive facility management",
  ];

  const services = [
    "Regular property inspections",
    "Maintenance and repairs",
    "Security services",
    "Landscaping and groundskeeping",
    "Utility management",
    "Tenant relations",
    "Financial reporting",
    "Emergency response",
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
                <span className="text-dark-900 font-montserrat">Property Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Property Management
              </h1>
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                End-to-end services for asset oversight and maintenance
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
                alt="Property Management"
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
                Professional Property Management
              </h2>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                We provide comprehensive property management services for residential and commercial estates, operating 24/7 to maximize client satisfaction. Our dedicated team of specialized professionals ensures exceptional facility and property management.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed mb-6 font-montserrat">
                Our team includes Engineers, Electricians, and Plumbers with many years of professional experience, ensuring first-class property maintenance and management skills. We handle everything from routine maintenance to emergency repairs, giving you peace of mind.
              </p>
              <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                Whether you own a single property or an entire estate, we provide tailored management solutions that protect your investment and enhance its value. Our comprehensive approach covers all aspects of property management, from maintenance to tenant relations.
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
            Our Management Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition text-center"
              >
                <CheckCircle2 className="text-cyan-600 mx-auto mb-3" size={32} />
                <p className="font-semibold text-dark-900 font-montserrat">{service}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            Let Us Manage Your Property
          </h2>
          <p className="text-lg mb-8 text-white/90 font-montserrat max-w-2xl mx-auto">
            Contact us today to learn more about our property management services and how we can help protect and enhance your investment.
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

