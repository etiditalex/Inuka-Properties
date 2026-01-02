"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Square, Filter, Search, ArrowRight, Phone } from "lucide-react";
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

  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === "all" || property.type === filter;
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "all", label: "All Properties" },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Properties For Sale
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover premium real estate opportunities across the coastal region of Kenya
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
                placeholder="Search by location or property name..."
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
                        <div className="text-3xl md:text-4xl font-bold text-dark-900 font-montserrat">
                          {property.price}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4 font-montserrat">
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
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-dark-600">No properties found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

