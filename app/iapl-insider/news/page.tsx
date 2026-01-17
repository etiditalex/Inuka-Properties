"use client";

import { motion } from "framer-motion";
import { Calendar, Tag, MapPin, Clock, ArrowRight, Home, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "Site Visits Happening in Mariakani and Kilifi",
      excerpt: "Join us for exciting site visits to our plots of land in Mariakani and Kilifi. Clients are visiting our prime land plots to explore exceptional investment opportunities in these strategic locations. Book your visit today to see the plots firsthand with our expert sales team.",
      date: new Date().toISOString().split('T')[0],
      category: "Site Visits",
      image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768629737/site_visit_highlight_i53mqx.jpg",
      featured: true,
      details: [
        "Site visits available in Mariakani and Kilifi",
        "Explore our plots of land in prime locations",
        "Personalized attention from our expert sales team",
        "Book in advance to secure your spot",
      ],
    },
    {
      id: 2,
      title: "Inuka Afrika Properties Celebrates 10 Years of Excellence",
      excerpt: "We're proud to mark a decade of transforming the real estate landscape in Kenya with quality properties and exceptional service.",
      date: "2024-01-20",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
      featured: false,
    },
    {
      id: 3,
      title: "New Affordable Housing Project Launched in Kikambala",
      excerpt: "Exciting new development offering affordable housing solutions in prime coastal location with flexible payment plans.",
      date: "2024-01-18",
      category: "Project Launch",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      featured: false,
    },
    {
      id: 4,
      title: "Partnership with Leading Financial Institution Announced",
      excerpt: "New mortgage solutions now available for our clients through strategic partnership with major financial institutions.",
      date: "2024-01-12",
      category: "Partnership",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      featured: false,
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
                <Link href="/iapl-insider" className="text-dark-600 hover:text-primary-600 transition font-montserrat">
                  IAPL Insider
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <span className="text-dark-900 font-montserrat">News</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                News & Updates
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Stay updated with the latest from Inuka Afrika Properties
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
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News List - Horizontal Cards (Same layout as Ongoing Projects) */}
      <section className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Left - Centered */}
                <div className="relative h-64 md:h-auto min-h-[400px] bg-dark-50 flex items-center justify-center p-6">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Content Right */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-4 py-1 rounded-lg text-sm font-semibold text-white bg-primary-500 font-montserrat">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4 font-montserrat">
                      {item.title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-dark-600 mb-4 font-montserrat">
                      <Calendar size={16} className="text-primary-600" />
                      <span>{formatDate(item.date)}</span>
                    </div>

                    {/* Excerpt */}
                    <p className="text-dark-600 mb-6 font-montserrat leading-relaxed">
                      {item.excerpt}
                    </p>

                    {/* Details/Features (for site visit news) */}
                    {item.details && item.details.length > 0 && (
                      <div className="mb-6">
                        <ul className="space-y-2">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center text-dark-600 font-montserrat">
                              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {item.id === 1 ? (
                      // Special button for site visit booking
                      <Link
                        href="/book-site-visit"
                        className="flex items-center justify-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat"
                      >
                        <Clock size={18} />
                        Book Site Visit
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <Link
                        href="/contact-us"
                        className="flex items-center justify-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat"
                      >
                        Learn More
                        <ArrowRight size={18} />
                      </Link>
                    )}
                    <Link
                      href="/for-sale"
                      className="flex items-center justify-center gap-2 bg-white text-primary-800 border-2 border-primary-800 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition font-montserrat"
                    >
                      View Properties
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
