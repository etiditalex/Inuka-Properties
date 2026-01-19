"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Filter, Search, ArrowRight, Phone, Home, ChevronRight, X, SlidersHorizontal } from "lucide-react";
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
  status?: "available" | "ongoing" | "sold";
  features?: string[];
}

const properties: Property[] = [
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    type: "residential",
    price: "KES 325,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    status: "available",
    featured: true,
    features: ["Prime Location - 1km off Mariakani-Kaloleni Bypass", "Water & Electricity on-site", "Ready to Build", "Perfect for Home or Investment", "Affordable Pricing - KES 325,000", "Flexible Payment - KES 100,000 deposit, balance over 12 months"],
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    type: "residential",
    price: "KES 399,000",
    size: "50x100 (1/8 Acre)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    status: "available",
    featured: true,
    features: ["Prime Location - 500m from Mariakani-Mavueni & Mkapuni bypasses", "Affordable Pricing - KES 399,000", "Flexible Payments - KES 100,000 deposit, zero-interest balance in 12 months", "High Growth Potential", "Ideal for residential, commercial, or long-term investment", "Site visits every Wednesday and Saturday"],
  },
  {
    id: 9,
    title: "Ocean View Gardens",
    location: "Tezo, Kilifi County",
    type: "residential",
    price: "KES 495,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
    status: "available",
    features: ["All-Inclusive Pricing", "Beach Proximity", "Highway Access", "Serviced Plots", "Utilities on Site"],
  },
  {
    id: 5,
    title: "Mtondia Highway Gardens",
    location: "Mtondia, Kilifi County",
    type: "residential",
    price: "KES 1,250,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
    status: "available",
    features: ["Highway Access", "University Proximity", "Serviced Plots", "Water & Electricity", "Secure Location"],
  },
  {
    id: 6,
    title: "Malindi Airport Gardens",
    location: "Ganda Furunzi Area, Malindi",
    type: "beach",
    price: "KES 950,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287215/Malindi_Airport_Gardens_dphmr6.jpg",
    status: "available",
    features: ["Prime Location", "Airport Proximity", "Coastal Bliss", "High Growth Potential", "Secure Community"],
  },
  {
    id: 7,
    title: "Msabaha Phase 6",
    location: "Malindi, Kizingo Area",
    type: "residential",
    price: "KES 450,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287397/Msabaha_Phase_6_2_vebo06.jpg",
    status: "available",
    features: ["Strategic Location", "Perfect for Holiday Homes", "Airport Proximity", "Fast-Growing Area", "Water & Electricity Available"],
  },
  {
    id: 8,
    title: "Bofa Phase 21",
    location: "Bofa, Kilifi County",
    type: "residential",
    price: "KES 1,850,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767291293/Bofa_Phase_21_17_ss7xhv.jpg",
    status: "available",
    features: ["Tarmacked Road Access", "Water & Electricity", "Well Demarcated", "Perimeter Fence", "Flexible Payment Terms"],
  },
];

export default function ForSalePage() {
  const [filter, setFilter] = useState<PropertyType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get unique locations
  const locations = Array.from(new Set(properties.map(p => p.location)));

  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === "all" || property.type === filter;
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || property.location === locationFilter;
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    
    // Price filtering (extract numeric value from price string)
    let matchesPrice = true;
    if (priceRange.min || priceRange.max) {
      const priceNum = parseInt(property.price.replace(/[^\d]/g, ""));
      const minPrice = priceRange.min ? parseInt(priceRange.min.replace(/[^\d]/g, "")) : 0;
      const maxPrice = priceRange.max ? parseInt(priceRange.max.replace(/[^\d]/g, "")) : Infinity;
      matchesPrice = priceNum >= minPrice && priceNum <= maxPrice;
    }
    
    return matchesFilter && matchesSearch && matchesLocation && matchesStatus && matchesPrice;
  });

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "all", label: "All Properties" },
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
    setStatusFilter("all");
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
                <span className="text-dark-900 font-montserrat">For Sale</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Properties For Sale
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Discover premium real estate opportunities across the coastal region of Kenya
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
                placeholder="Search properties..."
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
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                  Property Type
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

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="ongoing">Construction Ongoing</option>
                  <option value="sold">Sold Out</option>
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
                  <span className="font-bold text-dark-900">{filteredProperties.length}</span> properties found
                </p>
              </div>
            </div>
          </aside>

          {/* Properties List */}
          <div className="lg:col-span-3">
            {/* Properties List - Horizontal Cards */}
            <div className="space-y-6">
          {filteredProperties.map((property, index) => {
            const statusLabels = {
              available: "Available",
              ongoing: "Construction Ongoing",
              sold: "Sold Out",
            };
            
            const statusColors = {
              available: "bg-primary-600",
              ongoing: "bg-primary-500",
              sold: "bg-primary-800",
            };

            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Left */}
                  <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content Right */}
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      {/* Status Badge */}
                      {property.status && (
                        <div className="mb-4">
                          <span className={`inline-block px-4 py-1 rounded-lg text-sm font-semibold text-white ${statusColors[property.status] || "bg-primary-500"}`}>
                            {statusLabels[property.status]}
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 font-montserrat">
                          {property.price}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-900 mb-4 font-montserrat">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-dark-600 mb-4 font-montserrat">
                        <MapPin size={18} className="mr-2 text-primary-600" />
                        <span>{property.location}</span>
                      </div>

                      {/* Features/Amenities */}
                      {property.features && property.features.length > 0 && (
                        <div className="mb-6">
                          <ul className="space-y-2">
                            {property.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-dark-600 font-montserrat">
                                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Property Details */}
                      <div className="flex items-center gap-4 text-sm text-dark-600 mb-6 font-montserrat">
                        <div className="flex items-center gap-1">
                          <Square size={16} />
                          <span>{property.size}</span>
                        </div>
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed size={16} />
                            <span>{property.bedrooms} Bedrooms</span>
                          </div>
                        )}
                      </div>
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
                        href={`/for-sale/${property.id}`}
                        className="flex items-center justify-center gap-2 bg-white text-primary-800 border-2 border-primary-800 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition font-montserrat"
                      >
                        More Information
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-dark-600 font-montserrat">No properties found matching your criteria.</p>
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

