"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Home, Building2, Waves, Sprout, TrendingUp, Award, Shield, Users, CheckCircle2, FileText, DollarSign, Clock, Leaf, Heart, Mail, Phone, Globe, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
}

const properties: Property[] = [
  {
    id: 1,
    title: "Bofa Platinum",
    location: "Bofa, Kilifi County",
    type: "beach",
    price: "KES 5,990,000",
    size: "1/4 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Chumani Phase 6",
    location: "Chumani, Kilifi County",
    type: "residential",
    price: "KES 595,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
  },
  {
    id: 3,
    title: "Kikambala Phase 2",
    location: "Kikambala, Kilifi County",
    type: "residential",
    price: "KES 1,250,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285860/Kikambala_Phase_2_cw64y8.jpg",
  },
  {
    id: 4,
    title: "Chumani Phase 3",
    location: "Chumani, Kilifi County",
    type: "residential",
    price: "KES 550,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286100/chumani_phase_3_2_muym3y.jpg",
  },
  {
    id: 9,
    title: "Ocean View Gardens",
    location: "Tezo, Kilifi County",
    type: "residential",
    price: "KES 495,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
  },
  {
    id: 5,
    title: "Mtondia Highway Gardens",
    location: "Mtondia, Kilifi County",
    type: "residential",
    price: "KES 1,250,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
  },
  {
    id: 6,
    title: "Malindi Airport Gardens",
    location: "Ganda Furunzi Area, Malindi",
    type: "beach",
    price: "KES 950,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287215/Malindi_Airport_Gardens_dphmr6.jpg",
  },
  {
    id: 7,
    title: "Msabaha Phase 6",
    location: "Malindi, Kizingo Area",
    type: "residential",
    price: "KES 450,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767287397/Msabaha_Phase_6_2_vebo06.jpg",
  },
  {
    id: 8,
    title: "Bofa Phase 21",
    location: "Bofa, Kilifi County",
    type: "residential",
    price: "KES 1,850,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767291293/Bofa_Phase_21_17_ss7xhv.jpg",
  },
];

const propertyTypeIcons = {
  residential: Home,
  commercial: Building2,
  beach: Waves,
  farm: Sprout,
  affordable: TrendingUp,
};

export default function WhyUsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<PropertyType>("all");

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
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4 font-montserrat">
              Why Choose Inuka Afrika Properties
            </h1>
            <p className="text-lg md:text-xl text-dark-600 max-w-3xl mx-auto font-montserrat">
              Here are reasons why you should consider investing with Inuka Afrika Properties Limited this year
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Reasons Section */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 md:p-10"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-8 font-montserrat">
                  Here are reasons why you should consider investing with Inuka Afrika Properties Limited this year:
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark-900 mb-2 font-montserrat">
                      Reputation:
                    </h3>
                    <p className="text-dark-600 leading-relaxed font-montserrat">
                      Inuka Afrika Properties Limited is a well-established and reputable real estate company with over 10 years of experience in the industry. We have a proven track record of success, and our properties are located in some of the most desirable areas in Coastal Kenya.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark-900 mb-2 font-montserrat">
                      Value for money:
                    </h3>
                    <p className="text-dark-600 leading-relaxed font-montserrat">
                      Inuka Afrika Properties Limited offers competitive prices on our properties, and we often offer discounts and promotions. We also provide a variety of payment options to make it easier for you to invest.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark-900 mb-2 font-montserrat">
                      Convenience:
                    </h3>
                    <p className="text-dark-600 leading-relaxed font-montserrat">
                      Inuka Afrika Properties Limited makes it easy for you to invest in property. We have a team of experienced professionals who can help you find the perfect property for your needs, and we can also help you with the financing process.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-dark-900 mb-2 font-montserrat">
                      Security:
                    </h3>
                    <p className="text-dark-600 leading-relaxed font-montserrat">
                      Inuka Afrika Properties Limited is committed to providing security for our investors. We have a strict security and documentation system in place and offer title certainty to protect your investment.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-dark-700 leading-relaxed font-montserrat">
                    Overall, Inuka Afrika Properties Limited is a great choice for investing in Kenya's real estate. We offer a wide range of properties, competitive prices, convenient services, and security for your investment.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Additional Details Section */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 md:p-10"
              >
                <h2 className="text-3xl font-bold text-dark-900 mb-6 font-montserrat">
                  Here are some additional details about Us
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Completed Projects</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We have multiple completed projects across the coastal region</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Happy Clients</h4>
                      <p className="text-dark-600 text-sm font-montserrat">10000+ satisfied clients who trust our services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Industry Recognition</h4>
                      <p className="text-dark-600 text-sm font-montserrat">Recognized for excellence in real estate development</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Expert Team</h4>
                      <p className="text-dark-600 text-sm font-montserrat">200+ experienced professionals committed to excellent service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Value Addition</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We add value to our properties through quality development</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Title Deed Production</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We ensure promptness in Title deed production (4513 Title Deeds Issued)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Tax Compliant</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We are fully tax compliant and operate with transparency</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Job Creation</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We create job opportunities within our communities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Leaf className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Greening Policy</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We have a greening policy on our properties for sustainable development</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold text-dark-900 mb-1 font-montserrat">Corporate Social Responsibility</h4>
                      <p className="text-dark-600 text-sm font-montserrat">We conduct corporate social responsibility within the society</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Conclusion Section */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl shadow-lg p-8 md:p-10"
              >
                <h2 className="text-3xl font-bold mb-4 font-montserrat">
                  Inspiring Possibilities
                </h2>
                <p className="text-lg leading-relaxed mb-6 font-montserrat text-white/90">
                  Inuka Afrika Properties Limited is a great option for anyone looking to invest in real estate in Kenya. Our company has a strong track record of success, we offer a variety of investment options, and a team of experienced professionals who are committed to providing excellent customer service. If you are considering investing in real estate, we encourage you to consider Inuka Afrika Properties.
                </p>
                <div className="space-y-3 font-montserrat">
                  <div className="flex items-center gap-3">
                    <Mail className="text-white" size={20} />
                    <span>Email: info@inukaproperties.co.ke</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-white" size={20} />
                    <span>Phone: 0711 082084</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="text-white" size={20} />
                    <span>Website: www.inukaproperties.co.ke</span>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>

          {/* Sidebar - Property Search */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-2xl font-bold text-dark-900 mb-6 font-montserrat">
                Search Properties
              </h3>
              
              {/* Search Input */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-montserrat"
                  />
                </div>
              </div>

              {/* Property Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-900 mb-3 font-montserrat">
                  Property Type
                </label>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFilter(type.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition font-montserrat ${
                        filter === type.value
                          ? "bg-primary-600 text-white"
                          : "bg-dark-50 text-dark-700 hover:bg-dark-100"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6 pb-6 border-b border-dark-200">
                <p className="text-sm text-dark-600 font-montserrat">
                  {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
                </p>
              </div>

              {/* Property Results */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => {
                    const Icon = propertyTypeIcons[property.type] || Home;
                    return (
                      <Link
                        key={property.id}
                        href={`/for-sale/${property.id}`}
                        className="block group"
                      >
                        <div className="bg-dark-50 rounded-lg p-4 hover:bg-primary-50 transition">
                          <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                            <Image
                              src={property.image}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className="text-primary-600" />
                            <span className="text-xs font-semibold text-primary-600 uppercase font-montserrat">
                              {property.type}
                            </span>
                          </div>
                          <h4 className="font-bold text-dark-900 mb-1 line-clamp-1 font-montserrat">
                            {property.title}
                          </h4>
                          <p className="text-sm text-dark-600 mb-2 font-montserrat">
                            {property.location}
                          </p>
                          <p className="text-lg font-bold text-primary-600 font-montserrat">
                            {property.price}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-primary-600 text-sm font-montserrat">
                            <span>View Details</span>
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-dark-600 font-montserrat">No properties found</p>
                  </div>
                )}
              </div>

              {/* View All Link */}
              {filteredProperties.length > 0 && (
                <div className="mt-6 pt-6 border-t border-dark-200">
                  <Link
                    href="/for-sale"
                    className="block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat"
                  >
                    View All Properties
                  </Link>
                </div>
              )}
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
