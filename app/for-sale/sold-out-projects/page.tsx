"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Filter, Search, CheckCircle, ArrowRight, Home, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PropertyType = "all" | "residential" | "commercial" | "beach" | "farm" | "affordable";

interface Property {
  id: number;
  title: string;
  location: string;
  type: PropertyType;
  price: string;
  size: string;
  bedrooms?: number;
  image: string;
  featured?: boolean;
  completionDate?: string;
  soldDate?: string;
  features?: string[];
}

const soldOutProjects: Property[] = [
  {
    id: 5,
    title: "Affordable Housing Phase 1 - Kikambala",
    location: "Kikambala",
    type: "affordable",
    price: "KES 3,200,000",
    size: "0.08 Acres",
    bedrooms: 3,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    featured: true,
    completionDate: "2023-12-15",
    soldDate: "2024-01-20",
    features: ["3 Bedrooms", "Modern Kitchen", "Title Deed Issued"],
  },
  {
    id: 6,
    title: "Residential Plots - Bofa",
    location: "Bofa",
    type: "residential",
    price: "KES 1,800,000",
    size: "0.1 Acres",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
    completionDate: "2023-10-30",
    soldDate: "2023-11-15",
    features: ["Prime Location", "Secure Area", "Title Deed Ready"],
  },
  {
    id: 7,
    title: "Beachfront Villas - Mtwapa",
    location: "Mtwapa",
    type: "beach",
    price: "KES 15,000,000",
    size: "0.25 Acres",
    bedrooms: 4,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    completionDate: "2023-08-20",
    soldDate: "2023-09-10",
    features: ["Ocean View", "Private Beach Access", "4 Bedrooms"],
  },
  {
    id: 8,
    title: "Commercial Spaces - Chumani",
    location: "Chumani",
    type: "commercial",
    price: "KES 4,500,000",
    size: "0.2 Acres",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    completionDate: "2023-06-15",
    soldDate: "2023-07-01",
    features: ["Strategic Location", "Highway Access", "Business Ready"],
  },
  {
    id: 9,
    title: "Farm Land Plots - Chakama",
    location: "Chakama",
    type: "farm",
    price: "KES 1,200,000",
    size: "2 Acres",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    completionDate: "2023-05-10",
    soldDate: "2023-05-25",
    features: ["Arable Land", "Water Source", "Title Deed Issued"],
  },
  {
    id: 10,
    title: "Residential Estate - Msabaha",
    location: "Msabaha",
    type: "residential",
    price: "KES 2,200,000",
    size: "0.12 Acres",
    bedrooms: 3,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    completionDate: "2023-04-20",
    soldDate: "2023-05-05",
    features: ["3 Bedrooms", "Near Schools", "Secure Area"],
  },
];

// Helper function to format dates consistently
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function SoldOutProjectsPage() {
  const [filter, setFilter] = useState<PropertyType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = soldOutProjects.filter((project) => {
    const matchesFilter = filter === "all" || project.type === filter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "all", label: "All Projects" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "beach", label: "Beach" },
    { value: "farm", label: "Farm Land" },
    { value: "affordable", label: "Affordable Housing" },
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
                <Link href="/for-sale" className="text-dark-600 hover:text-primary-600 transition font-montserrat">
                  For Sale
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <span className="text-dark-900 font-montserrat">Sold Out Projects</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Sold Out Projects
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Explore our successfully completed and sold projects
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

      {/* Filters and Search */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search by location or project name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-dark-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as PropertyType)}
                className="px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects List - Horizontal Cards */}
        <div className="space-y-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition opacity-90"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Left */}
                <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-primary-900/30"></div>
                </div>

                {/* Content Right */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-4 py-1 rounded-lg text-sm font-semibold text-white bg-primary-800 font-montserrat flex items-center gap-2">
                        <CheckCircle size={16} />
                        Sold Out
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-3xl md:text-4xl font-bold text-dark-600 line-through font-montserrat">
                        {project.price}
                      </div>
                      <div className="text-sm text-dark-500 font-montserrat mt-1">Sold Out</div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4 font-montserrat">
                      {project.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-dark-600 mb-4 font-montserrat">
                      <MapPin size={18} className="mr-2 text-primary-600" />
                      <span>{project.location}</span>
                    </div>

                    {/* Features/Amenities */}
                    {project.features && project.features.length > 0 && (
                      <div className="mb-6">
                        <ul className="space-y-2">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-dark-600 font-montserrat">
                              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Property Details */}
                    <div className="flex items-center gap-4 text-sm text-dark-600 mb-4 font-montserrat">
                      <div className="flex items-center gap-1">
                        <Square size={16} />
                        <span>{project.size}</span>
                      </div>
                      {project.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed size={16} />
                          <span>{project.bedrooms} Bedrooms</span>
                        </div>
                      )}
                    </div>

                    {/* Sold Date and Completion Date */}
                    {project.soldDate && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-6">
                      <div className="text-sm text-primary-800 font-montserrat">
                        <span className="font-semibold">Sold:</span> {formatDate(project.soldDate)}
                      </div>
                      {project.completionDate && (
                        <div className="text-sm text-primary-700 mt-1 font-montserrat">
                          <span className="font-semibold">Completed:</span> {formatDate(project.completionDate)}
                        </div>
                      )}
                    </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Link
                      href="/contact-us"
                      className="flex items-center justify-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat"
                    >
                      Contact Us
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/for-sale/ongoing-projects"
                      className="flex items-center justify-center gap-2 bg-white text-primary-800 border-2 border-primary-800 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition font-montserrat"
                    >
                      View Ongoing Projects
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-dark-600">No sold out projects found matching your criteria.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-serif">Interested in Similar Projects?</h2>
          <p className="text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
            Check out our ongoing projects or contact us to be notified about upcoming developments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/for-sale/ongoing-projects"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              View Ongoing Projects
            </Link>
            <Link
              href="/contact-us"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition border-2 border-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

