"use client";

import { motion } from "framer-motion";
import { Users, Mail, Phone } from "lucide-react";

export default function OurTeamPage() {
  const teamMembers = [
    {
      name: "Management Team",
      role: "Leadership",
      description: "Our experienced management team brings decades of combined experience in real estate, finance, and business development.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    },
    {
      name: "Sales Team",
      role: "Property Consultants",
      description: "Dedicated professionals helping you find the perfect property that meets your needs and budget.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
    },
    {
      name: "Legal Team",
      role: "Legal Advisors",
      description: "Ensuring all transactions are legally sound and your property rights are fully protected.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    },
    {
      name: "Customer Service",
      role: "Support Team",
      description: "Committed to providing exceptional service and support throughout your property journey.",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Our Team</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Meet the dedicated professionals behind Inuka Afrika Properties
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200">
                <Users size={64} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600 opacity-50" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-dark-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                <p className="text-dark-600">{member.description}</p>
              </div>
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
                Join Our Team
              </h2>
              <p className="text-dark-700 mb-6 text-lg">
                We're always looking for talented individuals to join our growing team. 
                If you're passionate about real estate and customer service, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@inukaproperties.co.ke"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Send Your CV
                </a>
                <a
                  href="tel:+254711082084"
                  className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition border-2 border-primary-600 inline-flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Call Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

