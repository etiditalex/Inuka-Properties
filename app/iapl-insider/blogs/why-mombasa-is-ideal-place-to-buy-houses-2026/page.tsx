"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowLeft, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Format date consistently to avoid hydration errors
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatLongDate = (date: Date): string => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekday = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
};


export default function WhyMombasaIsIdealPlacePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dates, setDates] = useState({ short: '', long: '' });

  useEffect(() => {
    // Set dates on client side only to avoid hydration mismatch
    const now = new Date();
    setDates({
      short: formatDate(now),
      long: formatLongDate(now)
    });
    
    // Trigger flip animation after page loads
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setIsFlipped(true), 300);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePageFlip = (page: number) => {
    setCurrentPage(page);
  };

  // Structured Data for SEO (JSON-LD)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Why the Coastal region Is The Ideal Place To Buy Land In 2026",
    "description": "Discover why the Coastal region is the perfect destination to buy land in 2026. Explore Mariakani, Mtwapa, Kikambala, Kilifi, Malindi, Watamu, and Diani. Learn about infrastructure growth, affordable housing initiatives, and tourism opportunities.",
    "image": "https://res.cloudinary.com/dyfnobo9r/image/upload/v1768631111/mombasa_2_dazxqj.jpg",
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Inuka Afrika Properties Limited",
      "url": "https://www.inukaproperties.co.ke"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Inuka Afrika Properties Limited",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-mombasa-is-ideal-place-to-buy-houses-2026"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-20">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/iapl-insider/blogs"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>

        {/* Newspaper Container */}
        <div className="max-w-6xl mx-auto">
          <div className="relative perspective-1000">
            {/* Page Navigation */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => handlePageFlip(1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-lg transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50"
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => handlePageFlip(2)}
                disabled={currentPage === 2}
                className={`p-3 rounded-lg transition ${
                  currentPage === 2
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50"
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Newspaper Pages Container */}
            <div className="relative min-h-[800px]">
              <AnimatePresence mode="wait">
                {currentPage === 1 ? (
                  <motion.div
                    key="page1"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="bg-white shadow-2xl rounded-lg overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Page 1 Content */}
                    <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm opacity-90">Inuka Afrika Properties</div>
                        <div className="text-sm opacity-90" suppressHydrationWarning>{dates.long || 'Loading...'}</div>
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight">
                        Why the Coastal region Is The Ideal Place To Buy Land In 2026
                      </h1>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full h-64 md:h-96 overflow-hidden">
                      <Image
                        src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1768631111/mombasa_2_dazxqj.jpg"
                        alt="Why the Coastal region Is The Ideal Place To Buy Land In 2026 - Coastal Real Estate"
                        fill
                        className="object-cover"
                        priority
                        quality={95}
                      />
                    </div>

                    {/* Page 1 Article Content */}
                    <article className="p-6 md:p-10 lg:p-12">
                      <div className="max-w-4xl mx-auto">
                        {/* Article Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span suppressHydrationWarning>{dates.short || 'Loading...'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>IAPL Investment Team</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>Coastal region, Kenya</span>
                          </div>
                        </div>

                        {/* Article Body - Page 1 */}
                        <div className="prose prose-lg max-w-none">
                          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
                            As we navigate through 2026, the Coastal region emerges as one of Kenya's most promising real estate destinations. With unprecedented infrastructure development, government-backed affordable housing initiatives, and a thriving tourism sector, buying land in the Coastal region has never been more attractive. From Mariakani's rapid growth to Diani's pristine beaches, the region offers diverse investment opportunities that promise exceptional returns.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Mariakani: Infrastructure Boom Driving Property Values</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Mariakani stands at the forefront of Mombasa's real estate revolution. Located strategically along the Mombasa-Nairobi highway, this rapidly developing town is experiencing unprecedented infrastructure growth that's transforming it into a prime investment destination. The anticipated expansion of road networks, improved connectivity, and planned industrial developments are creating a perfect storm for property appreciation.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Investors buying land in Mariakani are positioning themselves in a market that's expected to see significant value increases over the next decade. The town's proximity to major economic hubs, combined with ongoing infrastructure projects, makes it an ideal location for both residential and commercial real estate investments. As accessibility improves and economic activity increases, land values in Mariakani are projected to rise substantially, making it one of the best places to buy land in the Coastal region in 2026.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Mtwapa: Coastal Living Meets Urban Convenience</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Mtwapa offers the perfect blend of coastal lifestyle and urban amenities, making it highly sought after for those looking to buy land in the Coastal region. This vibrant town combines beachfront living with modern infrastructure, creating an attractive environment for both local and international buyers. The area's growing reputation as a residential and tourism hub continues to drive land demand.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            The real estate market in Mtwapa benefits from its strategic location between Mombasa and Kilifi, offering residents easy access to both cities while maintaining a relaxed coastal atmosphere. Properties here appeal to those seeking vacation homes, retirement residences, or rental income opportunities in Kenya's thriving tourism sector.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Kikambala: Prime Plots of Land in Growing Coastal Area</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Kikambala has emerged as a prime destination for buying plots of land in the Coastal region. This rapidly developing area offers exceptional opportunities for investors and individuals looking to secure land in a strategic location. The availability of well-planned plots, combined with improving infrastructure and proximity to major coastal attractions, makes buying land in Kikambala an attractive investment proposition.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            The plots of land in Kikambala are strategically located in prime positions, offering both accessibility and potential for appreciation. As infrastructure continues to improve and the area develops further, these plots represent excellent investment opportunities. Whether for residential development, future resale, or long-term investment, the plots of land in Kikambala provide investors with flexible options in one of the Coastal region's most promising markets.
                          </p>

                        </div>
                      </div>
                    </article>
                  </motion.div>
                ) : (
                  <motion.div
                    key="page2"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="bg-white shadow-2xl rounded-lg overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Page 2 Header */}
                    <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm opacity-90">Inuka Afrika Properties</div>
                        <div className="text-sm opacity-90" suppressHydrationWarning>{dates.long || 'Loading...'}</div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-serif">
                        Why the Coastal region Is Ideal (Continued)
                      </h2>
                    </div>

                    {/* Page 2 Article Content */}
                    <article className="p-6 md:p-10 lg:p-12">
                      <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg max-w-none">

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">Kilifi, Bofa, and the Northern Coast: Emerging Investment Hotspots</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Kilifi County, including areas like Bofa, represents one of the most dynamic real estate markets in coastal Kenya. The region's natural beauty, combined with improving infrastructure and growing economic activity, makes it an attractive destination for those looking to buy land in the Coastal region. Kilifi offers a more relaxed pace of life while maintaining proximity to major economic centers.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Bofa, in particular, has gained attention for its strategic location and development potential. As infrastructure projects connect this area more effectively to Mombasa and Nairobi, land values are expected to appreciate significantly. Investors buying land in Bofa are getting in early on a market that's poised for substantial growth.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Malindi, Watamu, and Diani: Tourism-Driven Real Estate Growth</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            The tourism sector in the Coastal region is a powerful driver of real estate demand, and nowhere is this more evident than in Malindi, Watamu, and Diani. These world-renowned destinations attract millions of visitors annually, creating robust markets for vacation rentals, holiday homes, and hospitality investments. Buying land in these areas means investing in properties that benefit from consistent tourism revenue.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>Malindi</strong> offers a unique blend of Italian heritage and Swahili culture, attracting both international visitors and expatriates. The town's established tourism infrastructure and growing expat community make it an excellent choice for those seeking rental income or retirement properties.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>Watamu</strong>, with its pristine beaches and marine parks, has become a magnet for eco-tourism and luxury travelers. Land here benefits from high-end tourism demand, making it an attractive market for premium real estate investments. The area's commitment to conservation and sustainable development ensures long-term value preservation.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>Diani</strong> consistently ranks among Africa's best beaches, driving exceptional demand for coastal land. The area's well-developed infrastructure, international amenities, and strong rental market make buying land in Diani a strategic investment. Whether for personal use or rental income, Diani land offers both lifestyle benefits and financial returns.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Why 2026 Is The Perfect Time To Buy Land In the Coastal region</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Several converging factors make 2026 an ideal year to invest in Coastal region real estate. Infrastructure development is accelerating, government affordable housing programs are creating new opportunities, and tourism is rebounding strongly. Additionally, land prices remain relatively accessible compared to other major Kenyan cities, while growth potential is substantial.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            The combination of infrastructure improvements, government support, tourism growth, and strategic location advantages positions the Coastal region as one of Kenya's most promising real estate markets. Whether you're looking for a primary residence, vacation home, or investment property, buying land in the Coastal region in 2026 offers exceptional opportunities across diverse locations from Mariakani to Diani.
                          </p>

                          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-2">Ready to Buy Land in the Coastal region?</p>
                            <p className="text-gray-700 mb-4">
                              At Inuka Afrika Properties, we specialize in helping clients find the perfect land across the Coastal region. With over 10 years of experience and deep knowledge of markets from Mariakani to Diani, we guide you through every step of buying land in the Coastal region. Our portfolio includes verified land in prime locations, backed by transparent transactions and expert advice.
                            </p>
                            <Link
                              href="/for-sale"
                              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                            >
                              Explore Our Properties
                            </Link>
                          </div>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>Conclusion:</strong> The Coastal region offers unparalleled opportunities for those looking to buy land in 2026. From Mariakani's infrastructure-driven growth to Diani's tourism-powered market, from Kikambala's prime plots of land to Kilifi's emerging potential, the region presents diverse investment options. With government support, improving infrastructure, and a thriving tourism sector, buying land in the Coastal region represents a strategic investment in one of Kenya's most dynamic real estate markets. The time to act is now, while opportunities remain accessible and growth potential is at its peak.
                          </p>
                        </div>
                      </div>
                    </article>

                    {/* Page 2 Footer */}
                    <div className="bg-gray-100 p-6 border-t">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                          © {new Date().getFullYear()} Inuka Afrika Properties Limited. All rights reserved.
                        </div>
                        <Link
                          href="/contact-us"
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          Contact Us for Property Opportunities
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1200px;
          perspective-origin: center center;
        }
        @media (prefers-reduced-motion: reduce) {
          .perspective-1000 * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
