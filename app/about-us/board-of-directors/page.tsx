"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BoardOfDirectorsPage() {
  const boardMembers = [
    {
      name: "Joseph Mbugua",
      title: "Director - Marketing",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767434501/Joseph_Mbugua_v4k2c4.jpg",
      description: "Joseph Mbugua is the Director at Inuka Afrika Properties, where he is in charge of Marketing and brand growth. He plays a key role in promoting the company's real estate solutions and strengthening its market presence. Professionally trained as a Clearing and Forwarding Officer, Joseph brings strong expertise in logistics, coordination, and operational management. His background allows him to apply strategic planning and efficiency-driven approaches to real estate marketing and client engagement. Through his leadership, Joseph contributes to building trust with clients, driving business growth, and positioning Inuka Afrika Properties as a reliable and customer-focused real estate company.",
    },
    {
      name: "Josphat Muchere",
      title: "Director - Projects and IT",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767434501/Josphat_Muchere_mtskmd.jpg",
      description: "Josphat Muchere is the Director of Projects and IT at Inuka Afrika Properties, where he oversees project execution, systems management, and technology-driven operations. He plays a critical role in ensuring projects are delivered efficiently while aligning technology with the company's strategic goals. With a strong background in project coordination and information technology, Josphat brings a structured, solutions-oriented approach to real estate development and operations. His expertise supports effective planning, process optimization, and the integration of digital tools to enhance performance and service delivery. Through his leadership, Josphat contributes to operational excellence, innovation, and the successful implementation of projects across the organization.",
    },
    {
      name: "Kelvin Ngigi Mbugua",
      title: "Director - Finance and Debt Collection",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767434501/Kelvin_Mbugua_xwo7d7.jpg",
      description: "Kelvin Ngigi Mbugua is the Director in charge of Finance and Debt Collection at Inuka Afrika Properties, where he oversees financial management, revenue control, and debt recovery processes. He plays a key role in ensuring the company's financial stability and sustainable growth. Professionally trained as an Engineer, Kelvin brings a strong analytical and problem-solving approach to financial planning and management. In addition to his finance responsibilities, he is actively involved in the company's affordable housing initiatives, contributing technical insight to the development of practical, cost-effective housing solutions. Through his leadership, Kelvin supports financial accountability, operational efficiency, and the advancement of affordable housing within the organization.",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-6 text-dark-600">
                <Link href="/" className="flex items-center hover:text-primary-600 transition">
                  <Home size={18} className="stroke-2" />
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <Link href="/about-us" className="text-dark-600 hover:text-primary-600 transition font-montserrat">
                  About Us
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <span className="text-dark-900 font-montserrat">Board Of Directors</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Board Of Directors
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Meet the visionary leaders guiding Inuka Afrika Properties
              </p>
            </motion.div>

            {/* Right Side - City Skyline Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative h-64 md:h-80"
            >
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* City Skyline Buildings */}
                <g stroke="#e5e7eb" strokeWidth="1.5" fill="none">
                  {/* Building 1 */}
                  <rect x="20" y="180" width="60" height="100" />
                  <rect x="25" y="190" width="8" height="8" />
                  <rect x="37" y="190" width="8" height="8" />
                  <rect x="49" y="190" width="8" height="8" />
                  <rect x="61" y="190" width="8" height="8" />
                  <rect x="25" y="205" width="8" height="8" />
                  <rect x="37" y="205" width="8" height="8" />
                  <rect x="49" y="205" width="8" height="8" />
                  <rect x="61" y="205" width="8" height="8" />
                  
                  {/* Building 2 */}
                  <rect x="100" y="150" width="70" height="130" />
                  <rect x="108" y="160" width="10" height="10" />
                  <rect x="123" y="160" width="10" height="10" />
                  <rect x="138" y="160" width="10" height="10" />
                  <rect x="153" y="160" width="10" height="10" />
                  <rect x="108" y="178" width="10" height="10" />
                  <rect x="123" y="178" width="10" height="10" />
                  <rect x="138" y="178" width="10" height="10" />
                  <rect x="153" y="178" width="10" height="10" />
                  <rect x="108" y="196" width="10" height="10" />
                  <rect x="123" y="196" width="10" height="10" />
                  <rect x="138" y="196" width="10" height="10" />
                  
                  {/* Building 3 */}
                  <rect x="190" y="120" width="80" height="160" />
                  <rect x="200" y="135" width="12" height="12" />
                  <rect x="218" y="135" width="12" height="12" />
                  <rect x="236" y="135" width="12" height="12" />
                  <rect x="254" y="135" width="12" height="12" />
                  <rect x="200" y="155" width="12" height="12" />
                  <rect x="218" y="155" width="12" height="12" />
                  <rect x="236" y="155" width="12" height="12" />
                  <rect x="254" y="155" width="12" height="12" />
                  <rect x="200" y="175" width="12" height="12" />
                  <rect x="218" y="175" width="12" height="12" />
                  <rect x="236" y="175" width="12" height="12" />
                  
                  {/* Building 4 */}
                  <rect x="290" y="160" width="65" height="120" />
                  <rect x="298" y="170" width="9" height="9" />
                  <rect x="312" y="170" width="9" height="9" />
                  <rect x="326" y="170" width="9" height="9" />
                  <rect x="340" y="170" width="9" height="9" />
                  <rect x="298" y="186" width="9" height="9" />
                  <rect x="312" y="186" width="9" height="9" />
                  <rect x="326" y="186" width="9" height="9" />
                  <rect x="340" y="186" width="9" height="9" />
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Board and Management Team Section Header */}
      <section className="relative">
        {/* White background section */}
        <div className="bg-white h-16 md:h-24"></div>
        
        {/* Black bar with triangular notch */}
        <div className="relative bg-dark-900 py-6 md:py-8">
          {/* Triangular notch at top center */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L0 30H60L30 0Z" fill="white" />
            </svg>
          </div>
          
          <div className="w-full pl-4 md:pl-6 lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-montserrat">
                Board and Management Team
              </h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Board of Directors Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="w-full">
          <div className="space-y-12 pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <p className="text-lg text-dark-700 leading-relaxed font-montserrat">
                  Inuka Afrika Properties Limited is headed by a Board of Directors who are also the founders of the company. 
                  The three directors share a common goal of Trust, which has been the cornerstone of the company's growth 
                  and success over the past 10 years. Their diverse professional backgrounds and shared commitment to excellence 
                  have positioned Inuka Afrika Properties as a leading real estate company in the coastal region of Kenya.
                </p>
              </motion.div>

              {/* Board Members */}
              {boardMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white border-l-4 border-primary-600 overflow-hidden shadow-lg"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Portrait */}
                    <div className="md:w-1/3 bg-gradient-to-br from-dark-50 to-dark-100 flex items-center justify-center p-8 md:p-10 lg:p-12">
                      <div className="relative w-full max-w-xs aspect-[3/4] overflow-hidden bg-white shadow-xl border-4 border-white">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                      </div>
                    </div>

                    {/* Right Side - Biography */}
                    <div className="md:w-2/3 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-700 mb-3 font-montserrat leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-base md:text-lg font-semibold text-dark-600 mb-6 font-montserrat border-b border-dark-200 pb-4">
                        {member.title}
                      </p>
                      <div className="text-dark-700 leading-relaxed font-montserrat space-y-4 text-base md:text-lg">
                        {member.description.split('. ').filter(s => s.trim().length > 0).map((sentence, idx, arr) => {
                          const isLast = idx === arr.length - 1;
                          const text = isLast ? sentence : sentence + '.';
                          return (
                            <p key={idx} className="text-justify">
                              {text}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
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
              <h2 className="text-3xl font-bold text-dark-900 mb-6 font-montserrat">
                Join Our Team
              </h2>
              <p className="text-dark-700 mb-6 text-lg font-montserrat">
                We're always looking for talented individuals to join our growing team. 
                If you're passionate about real estate and customer service, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@inukaproperties.co.ke"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center justify-center gap-2 font-montserrat"
                >
                  <Mail size={20} />
                  Send Your CV
                </a>
                <a
                  href="tel:+254711082084"
                  className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition border-2 border-primary-600 inline-flex items-center justify-center gap-2 font-montserrat"
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

