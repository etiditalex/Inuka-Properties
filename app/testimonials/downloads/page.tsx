"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DownloadsPage() {
  const downloads = [
    {
      id: 1,
      title: "Inuka Afrika Company Profile",
      bannerTitle: "INUKA AFRIKA COMPANY PROFILE",
      description: "Comprehensive company profile showcasing our history, services, mission, vision, and property portfolio across coastal Kenya.",
      type: "PDF",
      size: "25.3 MB",
      file: "/downloads/Inuka-Afrika-Company-Profile.pdf",
      coverImage: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767784506/company_profile_wqi9yq.jpg",
      category: "Company Information",
    },
    {
      id: 2,
      title: "Property Listings",
      bannerTitle: "PROPERTY LISTINGS",
      description: "Complete catalog of available properties across Kilifi County including Mariakani, Mtwapa, and Malindi.",
      type: "PDF",
      size: "5.2 MB",
      file: "#",
      coverImage: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767784506/property_listings_bvur3q.jpg",
      category: "Property Catalog",
    },
    {
      id: 3,
      title: "Property Investment Guide",
      bannerTitle: "PROPERTY INVESTMENT GUIDE",
      description: "Essential guide for first-time property buyers in Kenya with expert tips and insights.",
      type: "PDF",
      size: "1.8 MB",
      file: "#",
      coverImage: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1757597070/Bofa_Platinum_Estate_6_ptpthd.jpg",
      category: "Investment Guide",
    },
    {
      id: 4,
      title: "Inuka Properties Brochure",
      bannerTitle: "INUKA PROPERTIES BROCHURE",
      description: "Comprehensive overview of our services, properties, and company information for your next investment.",
      type: "PDF",
      size: "2.5 MB",
      file: "/downloads/inuka-12-13-25.pdf",
      coverImage: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg", // Using logo as placeholder, replace with actual brochure cover
      category: "Property Brochure",
    },
    {
      id: 5,
      title: "Kilifi County Properties Catalog",
      bannerTitle: "KILIFI COUNTY PROPERTIES CATALOG",
      description: "Complete catalog of available properties across Kilifi County including Mariakani, Mtwapa, and Malindi.",
      type: "PDF",
      size: "5.2 MB",
      file: "#",
      coverImage: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767596630/kilifi_investment_swq82s.jpg",
      category: "Property Catalog",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 border-b border-dark-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4 font-montserrat">
              Inuka Afrika Properties Brochures: Comprehensive Guides for Your Next Investment
            </h1>
            <p className="text-lg text-dark-600 font-montserrat">
              Access our comprehensive property guides, company profiles, and investment resources
            </p>
          </motion.div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {downloads.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Banner Title - Inuka Brand Colors (Secondary Gold) */}
              <div className="bg-secondary-400 text-dark-900 px-4 py-2 text-center">
                <p className="text-xs md:text-sm font-bold font-montserrat uppercase tracking-wide">
                  {item.bannerTitle}
                </p>
              </div>

              {/* Brochure Cover */}
              <div className="relative h-80 md:h-96 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden flex items-center justify-center p-4">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Download Button - Overlay on Cover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-900/90 via-dark-900/70 to-transparent">
                  {item.file !== "#" ? (
                    <a
                      href={item.file}
                      download
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 font-montserrat text-sm shadow-lg"
                    >
                      <Download size={18} />
                      Download
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-dark-300 text-dark-600 px-4 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 font-montserrat text-sm"
                    >
                      <Download size={18} />
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-dark-50 rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4 font-montserrat">
              Need More Information?
            </h2>
            <p className="text-dark-600 mb-6 font-montserrat">
              Our team is ready to assist you with any questions about our properties, services, or investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact-us"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition font-montserrat"
              >
                Contact Us
              </Link>
              <Link
                href="/for-sale"
                className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition border-2 border-primary-600 font-montserrat"
              >
                View Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
