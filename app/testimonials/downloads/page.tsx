"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  size: string;
  image: string;
  featured?: boolean;
}

const featuredProperties: Property[] = [
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    price: "KES 325,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    featured: true,
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    price: "KES 399,000",
    size: "50x100 (1/8 Acre)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    featured: true,
  },
  {
    id: 1,
    title: "Bofa Platinum",
    location: "Bofa, Kilifi County",
    price: "KES 5,990,000",
    size: "1/4 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Chumani Phase 6",
    location: "Chumani, Kilifi County",
    price: "KES 595,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285403/chumani_phase_6_y4smsw.jpg",
  },
];

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to properly encode file paths for downloads
  const getDownloadUrl = (filePath: string) => {
    if (filePath === "#") return "#";
    // For Next.js static files, encode the entire path but preserve slashes
    return filePath.split("/").map(part => 
      part ? encodeURIComponent(part) : part
    ).join("/");
  };

  const downloads = [
    {
      id: 1,
      title: "Inuka Afrika Company Profile",
      file: "/downloads/Inuka-Afrika-Company-Profile.pdf",
    },
    {
      id: 2,
      title: "Property Listings",
      file: "/downloads/inuka-12-13-25.pdf",
      subItems: [
        {
          id: 6,
          title: "Ridge View Map",
          file: "/downloads/RIDGE VIEW (10).pdf",
        },
        {
          id: 7,
          title: "Chumani 3 Ext Map",
          file: "/downloads/CHUMANI 3 EXT (7).pdf",
        },
        {
          id: 8,
          title: "Ridgeview Phase 3 Map",
          file: "/downloads/RIDGEVIEW PHASE 3 (5).pdf",
        },
        {
          id: 9,
          title: "Mariakani 6 Map",
          file: "/downloads/MARIAKANI 6.pdf",
        },
        {
          id: 10,
          title: "Mwanda Phase 3 Map",
          file: "/downloads/MWANDA PHASE 3.pdf",
        },
        {
          id: 11,
          title: "Ridgeview Phase 4 Map",
          file: "/downloads/RIDGEVIEW PHASE 4 (9) (1).pdf",
        },
        {
          id: 12,
          title: "Tezo Nerenya Map",
          file: "/downloads/TEZO NERENYA (3).pdf",
        },
        {
          id: 13,
          title: "Ridgeview Phase 2 Map",
          file: "/downloads/RIDGEVIEW PHASE 2 (5).pdf",
        },
        {
          id: 14,
          title: "Chumani 3 Ext Map (Alt)",
          file: "/downloads/CHUMANI 3 EXT (8).pdf",
        },
        {
          id: 15,
          title: "Tezo Nerenya Map (Alt)",
          file: "/downloads/TEZO NERENYA (2).pdf",
        },
        {
          id: 16,
          title: "Oceanview Gardens Map",
          file: "/downloads/OCEANVIEW GARDENS (1) (3).pdf",
        },
        {
          id: 17,
          title: "Chumani Map",
          file: "/downloads/CHUMANI (2).pdf",
        },
        {
          id: 18,
          title: "Bofa Phase 3 Map",
          file: "/downloads/BOFA PHASE 3.pdf",
        },
        {
          id: 19,
          title: "Bofa Phase 9 Map",
          file: "/downloads/BOFA PHASE 9 (1).pdf",
        },
        {
          id: 20,
          title: "Inuka Chumani Phase 3 Map",
          file: "/downloads/INUKA_CHUMANI PHASE 3 (3).pdf",
        },
        {
          id: 21,
          title: "Majaoni 2 Map",
          file: "/downloads/MAJAONI 2 (3).pdf",
        },
        {
          id: 22,
          title: "Rafiki Phase 5 Map",
          file: "/downloads/RAFIKI PHASE 5 (3).pdf",
        },
        {
          id: 23,
          title: "Msabaha Phase 6 Map",
          file: "/downloads/MSABAHA PHASE 6 (2).pdf",
        },
        {
          id: 24,
          title: "New Rafiki 4Ext Map",
          file: "/downloads/NEW RAFIKI 4EXT MAP (3).pdf",
        },
        {
          id: 25,
          title: "Ridgeview 5 Extension Map",
          file: "/downloads/RIDGEVIEW 5 EXTENSION (1) (1) (3).pdf",
        },
        {
          id: 26,
          title: "Mwanda Phase 3 Map (Alt)",
          file: "/downloads/MWANDA PHASE 3 (3).pdf",
        },
        {
          id: 27,
          title: "Mida Parkview Phase 1 Map",
          file: "/downloads/MIDA PARKVIEW PHASE 1 (2) (1).pdf",
        },
        {
          id: 28,
          title: "Matsangoni Map",
          file: "/downloads/MATSANGONI (1).pdf",
        },
        {
          id: 29,
          title: "Mida Haven Phase 2 Map",
          file: "/downloads/MIDA HAVEN PHASE 2 (1).pdf",
        },
      ],
    },
  ];

  const filteredProperties = featuredProperties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 bg-white">
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Downloads */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-8 font-montserrat">
                Downloads
              </h1>
              
              <ul className="space-y-3 list-disc list-inside">
                {downloads.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-lg md:text-xl text-dark-900"
                  >
                    {item.file !== "#" ? (
                      <>
                        <span>{item.title}</span>
                        <span className="mx-1">–</span>
                        <a
                          href={getDownloadUrl(item.file)}
                          download={item.file !== "#" ? item.file.split("/").pop() : undefined}
                          className="text-primary-700 font-semibold hover:underline"
                        >
                          Read and Download
                        </a>
                      </>
                    ) : (
                      <>
                        <span>{item.title}</span>
                        <span className="mx-1">–</span>
                        <span className="text-dark-400">Coming Soon</span>
                      </>
                    )}
                    {/* Sub-items */}
                    {item.subItems && item.subItems.length > 0 && (
                      <ul className="ml-8 mt-2 space-y-2 list-disc list-inside">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id} className="text-base md:text-lg">
                            {subItem.file !== "#" ? (
                              <>
                                <span>{subItem.title}</span>
                                <span className="mx-1">–</span>
                                <a
                                  href={getDownloadUrl(subItem.file)}
                                  download={subItem.file !== "#" ? subItem.file.split("/").pop() : undefined}
                                  className="text-primary-700 font-semibold hover:underline"
                                >
                                  Read and Download
                                </a>
                              </>
                            ) : (
                              <>
                                <span>{subItem.title}</span>
                                <span className="mx-1">–</span>
                                <span className="text-dark-400">Coming Soon</span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search Bar */}
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 transition">
                    <Search size={20} />
                  </button>
                </div>
              </div>

              {/* Properties on Sale Section */}
              <div className="bg-primary-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-primary-700 mb-4 font-montserrat">
                  Properties on Sale
                </h2>
                <div className="space-y-4">
                  {filteredProperties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/for-sale/${property.id}`}
                      className="block bg-white rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-dark-900 mb-1 font-montserrat truncate">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-sm text-dark-600 mb-1">
                            <MapPin size={14} className="mr-1 text-primary-600" />
                            <span className="truncate font-montserrat">{property.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-dark-600 mb-2">
                            <Square size={14} className="mr-1 text-primary-600" />
                            <span className="font-montserrat">{property.size}</span>
                          </div>
                          <div className="text-primary-700 font-bold font-montserrat">
                            {property.price}
                          </div>
                        </div>
                  </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
