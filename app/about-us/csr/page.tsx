"use client";

import { motion } from "framer-motion";
import { Heart, Users, Home, GraduationCap, HandHeart } from "lucide-react";

export default function CSRPage() {
  const csrInitiatives = [
    {
      icon: Home,
      title: "Affordable Housing",
      description: "Supporting affordable housing initiatives to make homeownership accessible to more Kenyans.",
    },
    {
      icon: GraduationCap,
      title: "Education Support",
      description: "Contributing to educational programs and scholarships in the communities we serve.",
    },
    {
      icon: Users,
      title: "Community Development",
      description: "Engaging in community development projects that improve the quality of life in our areas of operation.",
    },
    {
      icon: HandHeart,
      title: "Environmental Conservation",
      description: "Promoting sustainable development practices and environmental conservation in our projects.",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Corporate Social Responsibility</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Giving back to the communities that have supported our growth
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-primary-700" />
              </div>
              <h2 className="text-3xl font-bold text-dark-900 font-serif">Our CSR Commitment</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-dark-700 mb-4 text-lg">
                At Inuka Afrika Properties Limited, we believe that business success goes hand in hand 
                with social responsibility. Over our 10 years of operation, we have been committed to 
                making a positive impact in the communities where we operate.
              </p>
              <p className="text-dark-700 mb-4 text-lg">
                Our Corporate Social Responsibility initiatives focus on areas that align with our core 
                values and business mission: affordable housing, education, community development, and 
                environmental sustainability.
              </p>
              <p className="text-dark-700 text-lg">
                We understand that as a real estate company, we have a unique opportunity and 
                responsibility to contribute to the social and economic development of Kenya. Through 
                our CSR programs, we aim to create lasting positive change that benefits not just our 
                clients, but the wider community.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {csrInitiatives.map((initiative, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <initiative.icon size={32} className="text-primary-700" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">{initiative.title}</h3>
              <p className="text-dark-600">{initiative.description}</p>
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
                Partner With Us
              </h2>
              <p className="text-dark-700 mb-6 text-lg">
                We welcome partnerships with organizations and individuals who share our commitment 
                to social responsibility. Together, we can create greater impact in our communities.
              </p>
              <a
                href="/contact-us"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}


