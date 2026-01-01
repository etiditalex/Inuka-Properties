"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Filter, Search, Clock, ArrowRight } from "lucide-react";
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
  progress?: number;
  features?: string[];
}

const ongoingProjects: Property[] = [
  {
    id: 1,
    title: "Affordable Housing Phase 2 - Kikambala",
    location: "Kikambala",
    type: "affordable",
    price: "KES 3,500,000",
    size: "0.08 Acres",
    bedrooms: 3,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    featured: true,
    completionDate: "2024-12-31",
    progress: 65,
    features: ["3 Bedrooms", "Modern Kitchen", "Spacious Living", "Title Deed Ready"],
  },
  {
    id: 2,
    title: "Residential Estate - Mariakani",
    location: "Mariakani",
    type: "residential",
    price: "KES 2,500,000",
    size: "0.1 Acres",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    completionDate: "2025-03-15",
    progress: 45,
    features: ["Prime Location", "Secure Area", "Near Schools"],
  },
  {
    id: 3,
    title: "Commercial Complex - Tezo",
    location: "Tezo",
    type: "commercial",
    price: "KES 5,500,000",
    size: "0.3 Acres",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    completionDate: "2025-06-30",
    progress: 30,
    features: ["Strategic Location", "Highway Access", "Parking Available"],
  },
  {
    id: 4,
    title: "Beachfront Development - Malindi",
    location: "Malindi",
    type: "beach",
    price: "KES 12,000,000",
    size: "0.15 Acres",
    bedrooms: 4,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    completionDate: "2025-08-31",
    progress: 25,
    features: ["Ocean View", "Beachfront", "Tourist Area", "4 Bedrooms"],
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

export default function OngoingProjectsPage() {
  const [filter, setFilter] = useState<PropertyType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = ongoingProjects.filter((project) => {
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
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Ongoing Projects</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Explore our current developments and investment opportunities
            </p>
          </motion.div>
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
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Left */}
                <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {project.progress && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary-900/80 text-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold font-montserrat">Construction Progress</span>
                        <span className="text-sm font-semibold font-montserrat">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-primary-800/30 rounded-full h-2">
                        <div
                          className="bg-primary-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Right */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-4 py-1 rounded-lg text-sm font-semibold text-white bg-primary-500 font-montserrat">
                        Construction Ongoing
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-3xl md:text-4xl font-bold text-dark-900 font-montserrat">
                        {project.price}
                      </div>
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

                    {/* Expected Completion */}
                    {project.completionDate && (
                      <div className="flex items-center gap-2 text-sm text-dark-600 mb-6 font-montserrat">
                        <Clock size={16} className="text-primary-600" />
                        <span>Expected Completion: {formatDate(project.completionDate)}</span>
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
                      href={`/for-sale/${project.id}`}
                      className="flex items-center justify-center gap-2 bg-white text-primary-800 border-2 border-primary-800 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition font-montserrat"
                    >
                      More Information
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-dark-600">No ongoing projects found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

