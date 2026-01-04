"use client";

import { motion } from "framer-motion";
import { Users, Mail, Phone, Home, ChevronRight, Briefcase, Award, Target, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OurTeamPage() {
  const teamMembers = [
    {
      name: "Sales Team",
      department: "Sales & Marketing",
      members: [
        {
          name: "Sales Representative 1",
          role: "Senior Sales Consultant",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          bio: "Experienced in property sales with a focus on residential and commercial properties.",
        },
        {
          name: "Sales Representative 2",
          role: "Sales Consultant",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
          bio: "Specializes in beachfront properties and investment opportunities.",
        },
      ],
    },
    {
      name: "Customer Service Team",
      department: "Customer Relations",
      members: [
        {
          name: "Customer Service Representative 1",
          role: "Customer Relations Manager",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
          bio: "Ensures exceptional customer experience throughout the property acquisition process.",
        },
        {
          name: "Customer Service Representative 2",
          role: "Client Support Specialist",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
          bio: "Provides dedicated support to clients from inquiry to property handover.",
        },
      ],
    },
    {
      name: "Operations Team",
      department: "Operations & Administration",
      members: [
        {
          name: "Operations Manager",
          role: "Operations Manager",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
          bio: "Oversees day-to-day operations and ensures smooth business processes.",
        },
        {
          name: "Administrative Assistant",
          role: "Administrative Coordinator",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
          bio: "Manages administrative tasks and supports all departments efficiently.",
        },
      ],
    },
    {
      name: "Legal & Documentation Team",
      department: "Legal Services",
      members: [
        {
          name: "Legal Officer",
          role: "Legal Advisor",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
          bio: "Handles legal documentation, title processing, and compliance matters.",
        },
      ],
    },
  ];

  const departments = [
    {
      icon: Briefcase,
      title: "Sales & Marketing",
      description: "Our sales team helps clients find their perfect property investment.",
      color: "primary",
    },
    {
      icon: Heart,
      title: "Customer Relations",
      description: "Dedicated to providing exceptional service and support to our clients.",
      color: "primary",
    },
    {
      icon: Target,
      title: "Operations",
      description: "Ensuring smooth operations and efficient business processes.",
      color: "primary",
    },
    {
      icon: Award,
      title: "Legal Services",
      description: "Expert legal support for all property transactions and documentation.",
      color: "primary",
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
                <span className="text-dark-900 font-montserrat">Our Team</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Our Team
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Meet the dedicated professionals behind Inuka Afrika Properties
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

      {/* Departments Overview */}
      <section className="bg-dark-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4 font-montserrat">
              Our Departments
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto font-montserrat">
              A diverse team of professionals working together to deliver excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2 font-montserrat">
                    {dept.title}
                  </h3>
                  <p className="text-dark-600 text-sm font-montserrat">
                    {dept.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Members by Department */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          {teamMembers.map((team, teamIndex) => (
            <motion.div
              key={teamIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2 font-montserrat">
                  {team.name}
                </h2>
                <p className="text-dark-600 font-montserrat">{team.department}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.members.map((member, memberIndex) => (
                  <motion.div
                    key={memberIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: memberIndex * 0.1 }}
                    className="bg-white border border-dark-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-primary-50 to-primary-100">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        quality={90}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-dark-900 mb-1 font-montserrat">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 font-semibold mb-3 text-sm font-montserrat">
                        {member.role}
                      </p>
                      <p className="text-dark-600 text-sm leading-relaxed font-montserrat">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="bg-dark-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-dark-900 mb-4 font-montserrat">
                Join Our Growing Team
              </h2>
              <p className="text-dark-700 mb-8 text-lg font-montserrat">
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
