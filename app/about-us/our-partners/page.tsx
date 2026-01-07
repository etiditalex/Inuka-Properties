"use client";

import { motion } from "framer-motion";
import { Handshake, Building2, Banknote, FileText } from "lucide-react";

export default function OurPartnersPage() {
  const partnerCategories = [
    {
      icon: Building2,
      title: "Construction Partners",
      description: "Trusted construction companies that help us deliver quality developments on time and within budget.",
    },
    {
      icon: Banknote,
      title: "Financial Institutions",
      description: "Partnering with leading banks and financial institutions to provide mortgage solutions for our clients.",
    },
    {
      icon: FileText,
      title: "Legal Partners",
      description: "Working with experienced legal firms to ensure smooth title transfers and legal compliance.",
    },
    {
      icon: Handshake,
      title: "Strategic Alliances",
      description: "Collaborating with various stakeholders to enhance our service delivery and market reach.",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Our Partners</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Building success through strategic partnerships
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8"
          >
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-dark-900 mb-6 font-serif">
                Strategic Partnerships
              </h2>
              <p className="text-dark-700 mb-4 text-lg">
                At Inuka Afrika Properties Limited, we believe in the power of collaboration. Over the 
                past 10 years, we have built strong relationships with various partners who share our 
                commitment to excellence and customer satisfaction.
              </p>
              <p className="text-dark-700 mb-4 text-lg">
                Our partnerships enable us to offer comprehensive real estate solutions, from property 
                development to financing and legal services. These strategic alliances ensure that our 
                clients receive the best possible service at every stage of their property journey.
              </p>
              <p className="text-dark-700 text-lg">
                We carefully select our partners based on their reputation, expertise, and alignment 
                with our values. This ensures that every partnership adds value to our clients and 
                strengthens our position as a leading real estate company in Kenya.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {partnerCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <category.icon size={32} className="text-primary-700" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">{category.title}</h3>
              <p className="text-dark-600">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-dark-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-dark-900 mb-6 font-serif">
                Become a Partner
              </h2>
              <p className="text-dark-700 mb-6 text-lg">
                We're always open to exploring new partnerships that can enhance our service delivery 
                and create value for our clients. If you're interested in partnering with us, we'd love 
                to hear from you.
              </p>
              <a
                href="/contact-us"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}






