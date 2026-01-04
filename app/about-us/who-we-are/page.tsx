"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, Target, Home, ChevronRight, Target as TargetIcon, Eye, Lightbulb, Award, Shield, Users, CheckCircle2, Heart, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WhoWeArePage() {
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
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                About Us
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Find Out About Our History, Our Leadership, and Our Services
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

      {/* Brand Promise Section */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <TargetIcon size={80} className="text-red-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
              <div className="bg-white px-8 py-4 rounded-lg shadow-lg border-2 border-dark-200">
                <h2 className="text-3xl md:text-4xl font-bold text-dark-900 font-montserrat">
                  OUR BRAND <span className="text-red-600">PROMISE</span>
                </h2>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                <TargetIcon size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4 font-montserrat">
                Mission
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                To provide affordable land, housing, mortgage facilities, and comprehensive property services that enable clients to achieve sustainable property ownership and investment growth.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                <Eye size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4 font-montserrat">
                Vision
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                To be the regional leader in real estate solutions by setting high standards in professionalism and service delivery.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20 bg-dark-900 text-white">
        <div className="container mx-auto px-4">
          {/* Title - Full Width at Top */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 w-full"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal font-montserrat leading-relaxed text-left w-full whitespace-normal">
              Founded in the year 2015, Inuka Afrika Properties Limited is a preeminent Real Estate Developer with over 10 years of excellence, serving buyers of affordable property in Coastal Kenya
            </h2>
          </motion.div>

          {/* Two Column Layout - Description and Image */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Description - Two paragraphs */}
              <p className="text-lg text-white/90 leading-relaxed font-montserrat">
                Inuka Afrika Properties Limited (IAPL) is a legally registered limited liability company headquartered in Nyali, Mombasa. The company was founded with a mission to transform the real estate landscape in the region by offering accessible, affordable, and professionally managed property investment solutions. Established in 2015, the company has over 10 years of experience in the Kenyan real estate industry, offering transparent, reliable, and accessible property investment solutions to both local and international clients. IAPL has built a solid reputation for connecting investors with prime land and property opportunities across strategic locations in coastal Kenya, including Kilifi County. Our properties are located in Mariakani, Mtwapa, Kikambala, Bofa, Mtondia, Tezo, Chumani, Matsangoni, Mida, Msabaha, Malindi, Chakama, and Marereni. We offer the Kenyan market a blend of modern architecture, unrivaled innovation, experience and market knowledge, with a vision for industry leadership that is uninterrupted.
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed font-montserrat">
                With our cutting-edge approach to affordable real estate, Inuka Afrika Properties has set new benchmarks in the industry. We have built our reputation around providing impeccable customer service & satisfaction, professional advice and timely delivery. Trust is a cornerstone in the way we do business. We are a long-term oriented brand with a win-win strong mentality, belief and practice. Commitment to quality and achieving the best value for money for our clients, is our daily goal and what makes us stand out. Our culture places the consumer at the center, catering to local and international clientele alike, assessing each client's individual needs before executing bespoke strategies towards fulfilling them. Today we can confidently tell our customers to expect more when they work with Inuka Afrika Properties Limited. From residential to commercial properties, beachfront developments to farm land, and affordable housing solutions - we deliver prime real estate opportunities that create long-term value across the continent.
              </p>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden"
            >
              <Image
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg"
                alt="Bofa Platinum Estate"
                fill
                className="object-cover"
                quality={90}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4 font-montserrat">
              Our Core Values
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto font-montserrat">
              Professionalism, Accountability, Teamwork, Transparency, and Integrity guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Professionalism */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border-2 border-dark-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Professionalism
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                Skilled and ethical service delivery.
              </p>
            </motion.div>

            {/* Accountability */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-dark-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Accountability
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                Responsible and transparent business conduct.
              </p>
            </motion.div>

            {/* Teamwork */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white border-2 border-dark-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Teamwork
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                Collaborative approach to achieving company goals.
              </p>
            </motion.div>

            {/* Transparency */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white border-2 border-dark-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Transparency
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                Clear processes and open communication.
              </p>
            </motion.div>

            {/* Integrity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white border-2 border-dark-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Integrity
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                Honest and ethical engagements with clients and stakeholders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4 font-montserrat">
              Our Services
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Land Sales & Purchases */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-red-600 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 font-montserrat">
                Land Sales & Purchases
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                Facilitating seamless transactions across residential, commercial, beach, and farmland investments.
              </p>
            </motion.div>

            {/* Property Management */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border-2 border-cyan-500 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Home size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-cyan-500 mb-3 font-montserrat">
                Property Management
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                End-to-end services for asset oversight and maintenance.
              </p>
            </motion.div>

            {/* Mortgage & Financing Assistance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-red-600 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-3 font-montserrat">
                Mortgage & Financing Assistance
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                Support with financing solutions and flexible payment plans.
              </p>
            </motion.div>

            {/* Title Deed Processing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white border-2 border-cyan-500 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <FileText size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-cyan-500 mb-3 font-montserrat">
                Title Deed Processing
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                Efficient facilitation of land ownership documentation.
              </p>
            </motion.div>

            {/* Affordable Housing Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white border-2 border-cyan-500 rounded-xl p-6 hover:shadow-lg transition md:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Home size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-cyan-500 mb-3 font-montserrat">
                Affordable Housing Solutions
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                Accessible housing options to expand home ownership opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

