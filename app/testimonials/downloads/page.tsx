"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Square, Home, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildDownloadTree, STATIC_DOWNLOAD_ITEMS } from "@/lib/downloads/catalog";

const HERO_BG_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg";

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
    id: 12,
    title: "Rafiki @10",
    location: "Tezo, Kilifi County",
    price: "KES 650,000",
    size: "10 Acres (72 Units)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771129318/Rafriki_10_Prime_plots_for_sale_s89vom.jpg",
    featured: true,
  },
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

type DownloadEntry = {
  id: number;
  title: string;
  file: string;
  subItems?: { id: number; title: string; file: string }[];
};

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [downloads, setDownloads] = useState<DownloadEntry[]>(
    buildDownloadTree(STATIC_DOWNLOAD_ITEMS)
  );

  useEffect(() => {
    fetch("/api/content/downloads")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          setDownloads(
            buildDownloadTree(
              data.items.map((i: { id: number; title: string; file_url: string; parent_id: number | null }) => ({
                id: i.id,
                title: i.title,
                file_url: i.file_url,
                parent_id: i.parent_id,
              }))
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const getDownloadUrl = (filePath: string) => {
    if (filePath === "#") return "#";
    return filePath.split("/").map((part) =>
      part ? encodeURIComponent(part) : part
    ).join("/");
  };

  const filteredProperties = featuredProperties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20">
      <section className="relative overflow-hidden py-16 md:py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" aria-hidden="true" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6 text-white/80">
                <Link href="/" className="flex items-center hover:text-white transition">
                  <Home size={18} className="stroke-2" />
                </Link>
                <ChevronRight size={16} className="text-white/50" />
                <Link href="/testimonials" className="hover:text-white transition font-montserrat">
                  Testimonials
                </Link>
                <ChevronRight size={16} className="text-white/50" />
                <span className="text-white font-montserrat">Downloads</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-montserrat">
                Downloads
              </h1>

              <p className="text-lg md:text-xl text-white/80 font-montserrat max-w-2xl">
                Access our company profile, property listings, and project maps
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-6 shadow-2xl">
                <p className="text-sm text-white/80 font-montserrat mb-4">
                  Use the search to quickly find documents and maps.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-white/70 font-montserrat mb-1">Featured properties</p>
                    <p className="text-2xl font-bold font-montserrat">{featuredProperties.length}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-white/70 font-montserrat mb-1">Download sections</p>
                    <p className="text-2xl font-bold font-montserrat">{downloads.length}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-white rounded-xl shadow-lg p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-6 font-montserrat">
                Available Documents
              </h2>

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

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 transition">
                    <Search size={20} />
                  </button>
                </div>
              </div>

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
