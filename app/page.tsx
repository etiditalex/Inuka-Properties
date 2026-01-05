"use client";

import { motion } from "framer-motion";
import { Home, Building2, Waves, MapPin, Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const services = [
    {
      icon: Home,
      title: "Residential Properties",
      description: "Discover your dream home in prime coastal locations",
      href: "/services/residential-properties",
      color: "bg-primary-100 text-primary-700",
    },
    {
      icon: Building2,
      title: "Commercial Properties",
      description: "Prime commercial spaces strategically located",
      href: "/services/commercial-properties",
      color: "bg-secondary-100 text-secondary-700",
    },
    {
      icon: Waves,
      title: "Beach Properties",
      description: "Exclusive beachfront properties with ocean views",
      href: "/services/beach-properties",
      color: "bg-accent-100 text-accent-700",
    },
  ];

  const locations = [
    "Mariakani", "Mtwapa", "Kikambala", "Bofa", "Chumani", 
    "Tezo", "Msabaha", "Mtondia", "Malindi"
  ];

  const features = [
    "10 Years of Excellence",
    "Affordable Payment Plans",
    "Title Deed Included",
    "Prime Locations",
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">
                Your Dream Property Awaits
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Leading Real Estate Solutions in Coastal Kenya
              </p>
              <p className="text-lg mb-10 text-primary-200 max-w-2xl mx-auto">
                With 10 years of excellence, we offer affordable residential, commercial, 
                and beach properties across Kilifi County. Your trusted partner in real estate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/for-sale"
                  className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg hover:shadow-xl"
                >
                  View Properties
                </Link>
                <Link
                  href="/book-site-visit"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Book Site Visit
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-dark-50 rounded-xl"
              >
                <CheckCircle2 className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-dark-900">{feature}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4 font-serif">
              Our Services
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={service.href}
                  className="block bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition group"
                >
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                    <service.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-3">{service.title}</h3>
                  <p className="text-dark-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition">
                    Learn More <ArrowRight className="ml-2" size={20} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
            >
              View All Services <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4 font-serif">
              Properties Across Kilifi County
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              We have properties in prime locations throughout the coastal region
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {locations.map((location, index) => (
              <motion.div
                key={location}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-primary-50 p-6 rounded-lg text-center hover:bg-primary-100 transition"
              >
                <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <p className="font-semibold text-dark-900">{location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Contact us today and let our experienced team help you find the property of your dreams
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact-us"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg inline-flex items-center justify-center"
              >
                <Phone className="mr-2" size={20} />
                Contact Us
              </Link>
              <Link
                href="/book-site-visit"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition inline-flex items-center justify-center"
              >
                <Mail className="mr-2" size={20} />
                Book Site Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
