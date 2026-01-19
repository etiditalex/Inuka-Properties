"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Filter, Search, Clock, ArrowRight, Home, ChevronRight, X, SlidersHorizontal } from "lucide-react";
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
  soldPercentage?: number;
  features?: string[];
}

const ongoingProjects: Property[] = [
  {
    id: 1,
    title: "Bofa Platinum",
    location: "Bofa, Kilifi County",
    type: "beach",
    price: "KES 5,990,000",
    size: "1/4 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    featured: true,
    completionDate: "2025-06-30",
    soldPercentage: 75,
    features: ["Beachfront Location", "Gated Community", "30m from Beach", "3 Bedroom Bungalows", "Electricity on Site"],
  },
  {
    id: 2,
    title: "Chumani Phase 6",
    location: "Chumani, Kilifi County",
    type: "residential",
    price: "KES 595,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
    completionDate: "2025-04-15",
    soldPercentage: 60,
    features: ["Prime Location", "400m from Highway", "Coastal Ambiance", "Thriving Community", "High Investment Potential"],
  },
  {
    id: 3,
    title: "Kikambala Phase 2",
    location: "Kikambala, Kilifi County",
    type: "residential",
    price: "KES 1,250,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285860/Kikambala_Phase_2_cw64y8.jpg",
    completionDate: "2025-05-31",
    soldPercentage: 50,
    features: ["Serene & Secure", "Coastal Lifestyle", "Utilities Connected", "Perimeter Fence", "9m Wide Access Roads"],
  },
  {
    id: 4,
    title: "Chumani Phase 3",
    location: "Chumani, Kilifi County",
    type: "residential",
    price: "KES 550,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286100/chumani_phase_3_2_muym3y.jpg",
    completionDate: "2025-03-31",
    soldPercentage: 80,
    features: ["Flexible Payments", "Highway Proximity", "Ready for Development", "Utilities Available"],
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
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get unique locations
  const locations = Array.from(new Set(ongoingProjects.map(p => p.location)));

  const filteredProjects = ongoingProjects.filter((project) => {
    const matchesFilter = filter === "all" || project.type === filter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || project.location === locationFilter;
    
    // Price filtering (extract numeric value from price string)
    let matchesPrice = true;
    if (priceRange.min || priceRange.max) {
      const priceNum = parseInt(project.price.replace(/[^\d]/g, ""));
      const minPrice = priceRange.min ? parseInt(priceRange.min.replace(/[^\d]/g, "")) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max.replace(/[^\d]/g, "")) : Infinity;
      matchesPrice = priceNum >= minPrice && priceNum <= maxPrice;
    }
    
    return matchesFilter && matchesSearch && matchesLocation && matchesPrice;
  });

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "all", label: "All Projects" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "beach", label: "Beach" },
    { value: "farm", label: "Farm Land" },
    { value: "affordable", label: "Affordable Housing" },
  ];

  const clearFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setLocationFilter("all");
    setPriceRange({ min: "", max: "" });
  };

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
                <span className="text-dark-900 font-montserrat">Ongoing Projects</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Ongoing Projects
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Explore our current developments and investment opportunities
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
                  <rect x="153" y="196" width="10" height="10" />
                  
                  {/* Building 3 */}
                  <rect x="190" y="200" width="50" height="80" />
                  <rect x="197" y="210" width="8" height="8" />
                  <rect x="209" y="210" width="8" height="8" />
                  <rect x="221" y="210" width="8" height="8" />
                  <rect x="233" y="210" width="8" height="8" />
                  <rect x="197" y="225" width="8" height="8" />
                  <rect x="209" y="225" width="8" height="8" />
                  <rect x="221" y="225" width="8" height="8" />
                  <rect x="233" y="225" width="8" height="8" />
                  
                  {/* Building 4 - Tallest */}
                  <rect x="260" y="120" width="80" height="160" />
                  <rect x="270" y="135" width="12" height="12" />
                  <rect x="287" y="135" width="12" height="12" />
                  <rect x="304" y="135" width="12" height="12" />
                  <rect x="321" y="135" width="12" height="12" />
                  <rect x="270" y="155" width="12" height="12" />
                  <rect x="287" y="155" width="12" height="12" />
                  <rect x="304" y="155" width="12" height="12" />
                  <rect x="321" y="155" width="12" height="12" />
                  <rect x="270" y="175" width="12" height="12" />
                  <rect x="287" y="175" width="12" height="12" />
                  <rect x="304" y="175" width="12" height="12" />
                  <rect x="321" y="175" width="12" height="12" />
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Search - Mobile */}
      <section className="container mx-auto px-4 py-4 lg:hidden">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className={`bg-white ${sidebarOpen ? 'h-full p-6' : 'rounded-xl shadow-lg p-6 sticky top-24'}`}>
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-bold text-dark-900 font-montserrat">Filters</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Desktop Title */}
              <h2 className="text-xl font-bold text-dark-900 mb-6 hidden lg:block font-montserrat">Search Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                  Project Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as PropertyType)}
                  className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Min Price (KES)"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Max Price (KES)"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 text-dark-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition font-montserrat"
              >
                Clear All Filters
              </button>

              {/* Results Count */}
              <div className="mt-6 pt-6 border-t border-dark-200">
                <p className="text-sm text-dark-600 font-montserrat">
                  <span className="font-bold text-dark-900">{filteredProjects.length}</span> projects found
                </p>
              </div>
            </div>
          </aside>

          {/* Projects List */}
          <div className="lg:col-span-3">
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
                  {project.soldPercentage && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary-900/80 text-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold font-montserrat">Sold</span>
                        <span className="text-sm font-semibold font-montserrat">{project.soldPercentage}%</span>
                      </div>
                      <div className="w-full bg-primary-800/30 rounded-full h-2">
                        <div
                          className="bg-primary-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.soldPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Right */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Status Badge */}
                    {project.soldPercentage && (
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1 rounded-lg text-sm font-semibold text-white bg-primary-500 font-montserrat">
                          {project.soldPercentage}% Sold
                        </span>
                      </div>
                    )}

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
                <p className="text-xl text-dark-600 font-montserrat">No ongoing projects found matching your criteria.</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

