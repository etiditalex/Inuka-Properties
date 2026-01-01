"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, Target, Home, ChevronRight, Target as TargetIcon, Eye, Lightbulb, Award, Shield, Users, CheckCircle2, Heart } from "lucide-react";
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

      {/* Mission, Vision, Purpose Section */}
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <TargetIcon size={32} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4 font-montserrat">
                Our Mission
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                Provision of affordable land, housing, mortgage facilities and property Management to achieve client's investment dreams.
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
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Eye size={32} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4 font-montserrat">
                Our Vision
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                To be the regional leader in Real Estate Solutions.
              </p>
            </motion.div>

            {/* Purpose Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Lightbulb size={32} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4 font-montserrat">
                Our Purpose
              </h3>
              <p className="text-dark-600 leading-relaxed font-montserrat">
                Creating an enormous investment opportunity for investors from all over the world in the promising and skyrocketing real estate African market.
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
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat leading-tight text-center">
              Founded in the year 2016, Inuka Afrika Properties Limited is a preeminent Real Estate Developer with over 10 years of excellence, serving buyers of affordable property in Coastal Kenya
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
              {/* Description - Full paragraphs */}
              <p className="text-lg text-white/90 leading-relaxed font-montserrat">
                The company was built with the Kenyan spirit in heart and mind, bringing along vast expertise in real estate development and property management. Currently, Inuka Afrika Properties has a strong presence across the coastal region of Kenya, with properties and projects in Kilifi County including Mariakani, Mtwapa, Kikambala, Kilifi, Bofa, Tezo, Chumani, Msabaha, and Malindi. We offer the Kenyan market a blend of modern architecture, unrivaled innovation, experience and market knowledge, with a vision for industry leadership that is uninterrupted.
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed font-montserrat">
                With our cutting-edge approach to affordable real estate, Inuka Afrika Properties has set new benchmarks in the industry. We have built our reputation around providing impeccable customer service & satisfaction, professional advice and timely delivery. Trust is a cornerstone in the way we do business. We are a long-term oriented brand with a win-win strong mentality, belief and practice. Commitment to quality and achieving the best value for money for our clients, is our daily goal and what makes us stand out. Our culture places the consumer at the center, catering to local and international clientele alike, assessing each client's individual needs before executing bespoke strategies towards fulfilling them.
              </p>
              
              <p className="text-lg text-white/90 leading-relaxed font-montserrat">
                Today we can confidently tell our customers to expect more when they work with Inuka Afrika Properties Limited. From residential to commercial properties, beachfront developments to farm land, and affordable housing solutions - we deliver prime real estate opportunities that create long-term value across the continent.
              </p>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative h-[600px] rounded-xl overflow-hidden"
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
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Professionalism
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                We maintain the highest standards of excellence in all our operations, ensuring expert service delivery and industry best practices.
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
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Accountability
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                We take full responsibility for our actions and commitments, ensuring transparency and reliability in every client interaction.
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
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Teamwork
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                We foster collaborative partnerships with clients, colleagues, and stakeholders to achieve shared success and mutual growth.
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
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Transparency
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                We operate with complete openness, providing clear communication and honest information throughout every transaction and process.
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
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3 font-montserrat">
                Integrity
              </h3>
              <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                We conduct business with unwavering ethical principles, building trust through honesty, fairness, and moral excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Property Management */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-xl overflow-hidden"
              >
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg"
                  alt="Property Management"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </motion.div>
              {/* Content Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 font-montserrat">
                  Property Management
                </h2>
                <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                  We provide comprehensive property management services for residential and commercial estates, operating 24/7 to maximize client satisfaction. Our dedicated team of specialized professionals, including Engineers, Electricians, and Plumbers with many years of professional experience, ensures exceptional facility and property management skills with first-class property maintenance.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Title Issuance */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 order-2 lg:order-1"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 font-montserrat">
                  Title Issuance
                </h2>
                <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                  We facilitate the complete title deed issuance process, guiding clients through all legal requirements and documentation. Our experienced team ensures smooth transactions from land acquisition to final title registration, providing expert assistance and support throughout the entire process to secure your property ownership.
                </p>
              </motion.div>
              {/* Image Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-xl overflow-hidden order-1 lg:order-2"
              >
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597073/Bofa_Platinum_Estate_2_xiz8o1.jpg"
                  alt="Title Issuance"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </motion.div>
            </div>
          </div>

          {/* Commercial Properties */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-xl overflow-hidden"
              >
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597070/Bofa_Platinum_Estate_6_ptpthd.jpg"
                  alt="Commercial Properties"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </motion.div>
              {/* Content Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 font-montserrat">
                  Commercial Properties
                </h2>
                <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                  We offer prime commercial spaces strategically located across the coastal region of Kenya. Our commercial property portfolio includes retail spaces, office buildings, and mixed-use developments designed to meet diverse business needs. Each property is carefully selected to provide optimal location advantages and investment potential.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Residential Properties */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 order-2 lg:order-1"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 font-montserrat">
                  Residential Properties
                </h2>
                <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                  Discover your dream home in prime coastal locations across Kilifi County. Our residential properties range from affordable housing units to luxury beachfront villas, all designed with modern architecture and quality construction. We offer complete solutions from off-plan projects to ready-to-move-in homes.
                </p>
              </motion.div>
              {/* Image Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-xl overflow-hidden order-1 lg:order-2"
              >
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597072/Bofa_Platinum_Estate_10_evunyt.jpg"
                  alt="Residential Properties"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </motion.div>
            </div>
          </div>

          {/* Property Sales */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-xl overflow-hidden"
              >
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597073/Bofa_Platinum_Estate_2_xiz8o1.jpg"
                  alt="Property Sales"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </motion.div>
              {/* Content Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 font-montserrat">
                  Property Sales
                </h2>
                <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                  Our comprehensive property sales services cover all aspects of real estate transactions. From initial consultation and property viewing to negotiation and closing, we provide expert guidance throughout the entire sales process. We specialize in residential plots, commercial spaces, beach properties, and farm land across the coastal region.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Feasibility Study */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 order-2 lg:order-1"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 font-montserrat">
                  Feasibility Study
                </h2>
                <p className="text-lg text-dark-600 leading-relaxed font-montserrat">
                  We conduct thorough feasibility studies to assess the viability and potential of real estate projects. Our comprehensive analysis includes market research, financial projections, risk assessment, and regulatory compliance evaluation. This service helps investors make informed decisions and ensures project success from conception to completion.
                </p>
              </motion.div>
              {/* Image Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-xl overflow-hidden order-1 lg:order-2"
              >
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597070/Bofa_Platinum_Estate_6_ptpthd.jpg"
                  alt="Feasibility Study"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

