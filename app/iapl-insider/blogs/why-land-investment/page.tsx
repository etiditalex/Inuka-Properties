"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
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


export default function WhyLandInvestmentPage() {
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
    "headline": "Why Land Investment: The Ultimate Guide to Building Wealth Through Real Estate",
    "description": "Discover why land investment is one of the smartest financial decisions you can make. Learn about land investment benefits, strategies, and opportunities in Kenya.",
    "image": "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767954926/why_land_investment_2_pryhrf.jpg",
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
      "@id": "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-land-investment"
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
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  currentPage === 1
                    ? "bg-primary-600 text-white"
                    : "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50"
                }`}
              >
                Page 1
              </button>
              <button
                onClick={() => handlePageFlip(2)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  currentPage === 2
                    ? "bg-primary-600 text-white"
                    : "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50"
                }`}
              >
                Page 2
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
                        Why Land Investment: Building Wealth Through Real Estate
                      </h1>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full h-64 md:h-96 overflow-hidden">
                      <Image
                        src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767954926/why_land_investment_2_pryhrf.jpg"
                        alt="Why Land Investment - Real Estate Investment Guide"
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
                        </div>

                        {/* Article Body - Page 1 */}
                        <div className="prose prose-lg max-w-none">
                          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
                            In an era of economic uncertainty and volatile markets, land investment stands as one of the most reliable and profitable strategies for building long-term wealth. Unlike stocks, bonds, or digital assets, land is a tangible asset that has consistently appreciated in value throughout history.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">The Timeless Value of Land</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Land is a finite resource. As Mark Twain famously said, "Buy land, they're not making it anymore." This fundamental truth underpins why land investment has remained a cornerstone of wealth building for centuries. In Kenya, particularly in rapidly developing regions like Kilifi County, the demand for land continues to outstrip supply, creating exceptional investment opportunities.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Why Land Investment Outperforms Other Assets</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>1. Appreciation Potential:</strong> Land values in strategic locations have shown consistent appreciation over time. Coastal areas, highway-adjacent properties, and regions near urban centers experience particularly strong growth. Properties in Mariakani, Mtwapa, and Malindi have seen significant value increases as infrastructure development continues.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>2. Inflation Hedge:</strong> Unlike cash that loses value to inflation, land typically maintains or increases its purchasing power. As the cost of living rises, land values often rise proportionally or even faster, protecting your investment from currency devaluation.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>3. Passive Income Opportunities:</strong> Land investment doesn't have to be purely speculative. Many investors generate income through agriculture, leasing, or development projects while waiting for appreciation. This dual benefit of income generation and capital growth makes land particularly attractive.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Strategic Land Investment in Kenya</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Kenya's real estate market offers unique advantages for land investors. The country's growing population, expanding middle class, and infrastructure development create a perfect storm for property value appreciation. Coastal regions, in particular, benefit from tourism growth, improved road networks, and increasing demand for both residential and commercial properties.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>Location Matters:</strong> When investing in land, location is paramount. Properties near highways, beaches, universities, or growing urban centers tend to appreciate faster. Areas like Mtondia, Mwanda, and Bofa in Kilifi County offer excellent potential due to their strategic positioning and ongoing development projects.
                          </p>

                          {/* Page 1 Footer */}
                          <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
                            Continued on Page 2 →
                          </div>
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
                        <div className="text-sm opacity-90">Page 2</div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-serif">
                        Why Land Investment (Continued)
                      </h2>
                    </div>

                    {/* Page 2 Article Content */}
                    <article className="p-6 md:p-10 lg:p-12">
                      <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg max-w-none">
                          <p className="text-sm text-gray-500 mb-6">← Continued from Page 1</p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">Building Generational Wealth</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Land investment is perhaps the most effective way to build generational wealth. Unlike depreciating assets, land can be passed down through generations, often increasing in value over time. This creates a lasting legacy that benefits not just you, but your children and grandchildren.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Many successful families in Kenya have built their wealth through strategic land investments. By purchasing land in developing areas and holding it as infrastructure improves, these investors have seen returns that far exceed traditional investment vehicles.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">Getting Started with Land Investment</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Starting your land investment journey requires careful planning and due diligence. Here are essential steps:
                          </p>

                          <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                            <li><strong>Research Locations:</strong> Study areas with growth potential, infrastructure development, and increasing demand.</li>
                            <li><strong>Verify Title Deeds:</strong> Ensure proper documentation and legal ownership before purchasing.</li>
                            <li><strong>Consider Accessibility:</strong> Properties with good road access and proximity to amenities tend to appreciate faster.</li>
                            <li><strong>Plan for the Long Term:</strong> Land investment is typically a long-term strategy. Be prepared to hold for several years to maximize returns.</li>
                            <li><strong>Work with Reputable Developers:</strong> Partner with established companies like Inuka Afrika Properties that offer transparent transactions and verified properties.</li>
                          </ul>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">The Future of Land Investment</h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            As Kenya continues to develop, land values in strategic locations are expected to continue rising. The government's infrastructure investments, growing urbanization, and increasing foreign investment all point to a positive outlook for land investors.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Coastal regions, in particular, are experiencing unprecedented growth. With improved transportation networks, expanding tourism, and increasing interest from both local and international investors, properties in Kilifi County represent exceptional opportunities for those looking to build wealth through land investment.
                          </p>

                          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-2">Ready to Start Your Land Investment Journey?</p>
                            <p className="text-gray-700 mb-4">
                              At Inuka Afrika Properties, we offer verified land investments in prime locations across Kilifi County. With over 10 years of experience and a commitment to transparency, we help investors make informed decisions that build lasting wealth.
                            </p>
                            <Link
                              href="/for-sale"
                              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                            >
                              Explore Our Properties
                            </Link>
                          </div>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            <strong>Conclusion:</strong> Land investment remains one of the most reliable paths to financial security and generational wealth. By choosing the right location, working with reputable partners, and maintaining a long-term perspective, you can build a portfolio that provides both immediate opportunities and lasting value. The time to invest in land is now, while prices remain accessible and growth potential is high.
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
                          Contact Us for Investment Opportunities
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
