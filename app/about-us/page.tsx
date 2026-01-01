"use client";

import { motion } from "framer-motion";
import { Building2, Target, Award, Users, Heart, Handshake } from "lucide-react";
import Link from "next/link";

export default function AboutUsPage() {
  const values = [
    {
      icon: Target,
      title: "Our Vision",
      description: "To transform the real estate landscape in Kenya with affordable and accessible property solutions.",
    },
    {
      icon: Award,
      title: "Our Mission",
      description: "To provide comprehensive real estate services that meet our clients' property and land ownership needs.",
    },
    {
      icon: Building2,
      title: "10 Years of Excellence",
      description: "A decade of building trust, delivering quality, and transforming lives through real estate.",
    },
  ];

  const quickLinks = [
    { name: "Who We Are", href: "/about-us/who-we-are", icon: Users },
    { name: "Why Us", href: "/about-us/why-us", icon: Award },
    { name: "Our Team", href: "/about-us/our-team", icon: Users },
    { name: "CSR", href: "/about-us/csr", icon: Heart },
    { name: "Our Partners", href: "/about-us/our-partners", icon: Handshake },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">About Us</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Leading the real estate transformation in Kenya for over 10 years
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-4">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
              >
                <link.icon
                  size={32}
                  className="mx-auto mb-3 text-primary-600 group-hover:text-primary-700 transition"
                />
                <h3 className="font-semibold text-dark-900">{link.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Company Overview */}
      <section className="bg-dark-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-dark-900 mb-6 font-serif">
                Inuka Afrika Properties Limited
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-dark-700 mb-4 text-lg">
                  Inuka Afrika Properties Limited (IAPL) is a legally registered limited liability company 
                  with its head office located in Nyali, Mombasa. Founded with a vision to transform the 
                  real estate landscape in Kenya, IAPL has grown from a coastal-focused company to a 
                  national leader in affordable real estate solutions.
                </p>
                <p className="text-dark-700 mb-4 text-lg">
                  Our head office is strategically located along Links Road Opposite Kigothos Hotel, 
                  P.O. BOX 525-80100, Nyali Mombasa Kenya, serving as the hub for our operations 
                  across the coastal region.
                </p>
                <p className="text-dark-700 text-lg">
                  As we celebrate our 10th anniversary, we remain committed to providing exceptional 
                  service, quality properties, and innovative solutions that meet the diverse needs of 
                  our clients. Our journey from a coastal-focused company to a recognized leader in 
                  affordable real estate reflects our dedication to excellence and customer satisfaction.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4 font-serif">
              Our Core Values
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon size={32} className="text-primary-700" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{value.title}</h3>
                <p className="text-dark-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

