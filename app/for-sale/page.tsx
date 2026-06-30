"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Home, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import PropertyListingCard from "@/components/PropertyListingCard";
import { STATIC_PROPERTY_CATALOG, type CatalogProperty } from "@/lib/properties/catalog";
import { sortPropertiesNewestFirst, LATEST_PROJECT_ID } from "@/lib/properties/sortProperties";

type PropertyType = "all" | "residential" | "commercial" | "beach" | "farm" | "affordable";

type Property = CatalogProperty & { type: PropertyType | string };

export default function ForSalePage() {
  const [properties, setProperties] = useState<Property[]>(
    sortPropertiesNewestFirst(STATIC_PROPERTY_CATALOG) as Property[]
  );
  const [filter, setFilter] = useState<PropertyType>("all");
  useEffect(() => {
    fetch("/api/content/properties")
      .then((r) => r.json())
      .then((data) => {
        if (data.properties?.length) setProperties(data.properties);
      })
      .catch(() => {});
  }, []);
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

          {/* Properties grid — listing cards (matches marketing layout) */}
          <div className="lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PropertyListingCard
                    property={{
                      id: property.id,
                      title: property.title,
                      location: property.location,
                      type: property.type,
                      price: property.price,
                      size: property.size,
                      bedrooms: property.bedrooms,
                      image: property.image,
                      status: property.status,
                    }}
                    imageSizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    badge={property.id === LATEST_PROJECT_ID ? "New" : undefined}
                  />
                </motion.div>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-dark-600 font-montserrat">
                  No properties found matching your criteria.
                </p>
              </div>
            )}
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

