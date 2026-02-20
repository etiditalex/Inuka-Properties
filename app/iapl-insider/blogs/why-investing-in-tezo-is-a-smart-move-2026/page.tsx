"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatLongDate = (date: Date): string => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekday = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
};

export default function WhyInvestingInTezoIsSmartMovePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dates, setDates] = useState({ short: "", long: "" });

  useEffect(() => {
    const now = new Date();
    setDates({ short: formatDate(now), long: formatLongDate(now) });

    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setIsFlipped(true), 300);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePageFlip = (page: number) => setCurrentPage(page);

  const heroImage =
    "https://res.cloudinary.com/dyfnobo9r/image/upload/v1771578534/WhatsApp_Image_2026-02-16_at_10.12.29_zor4t2.jpg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "Why Investing in Tezo Is a Smart Move in 2026: Spotlight on Inuka Afrika Properties’ New Project",
    description:
      "Tezo is quickly becoming one of Kenya’s most promising coastal investment destinations in 2026. Explore the key drivers of growth and what makes Inuka Afrika Properties’ newest Tezo project stand out.",
    image: heroImage,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Inuka Afrika Properties Limited",
      url: "https://www.inukaproperties.co.ke",
    },
    publisher: {
      "@type": "Organization",
      name: "Inuka Afrika Properties Limited",
      logo: {
        "@type": "ImageObject",
        url: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":
        "https://www.inukaproperties.co.ke/iapl-insider/blogs/why-investing-in-tezo-is-a-smart-move-2026",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/iapl-insider/blogs"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="relative perspective-1000">
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

            <div className="relative min-h-[800px]">
              <AnimatePresence mode="wait">
                {currentPage === 1 ? (
                  <motion.div
                    key="page1"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="bg-white shadow-2xl rounded-lg overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm opacity-90">
                          Inuka Afrika Properties
                        </div>
                        <div
                          className="text-sm opacity-90"
                          suppressHydrationWarning
                        >
                          {dates.long || "Loading..."}
                        </div>
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight">
                        Why Investing in Tezo Is a Smart Move in 2026
                      </h1>
                      <p className="text-primary-100 mt-3 text-lg">
                        Spotlight on Inuka Afrika Properties’ New Project
                      </p>
                    </div>

                    <div className="relative w-full h-64 md:h-96 overflow-hidden">
                      <Image
                        src={heroImage}
                        alt="Investing in Tezo Kenya - Inuka Afrika Properties"
                        fill
                        className="object-cover"
                        priority
                        quality={95}
                      />
                    </div>

                    <article className="p-6 md:p-10 lg:p-12">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span suppressHydrationWarning>
                              {dates.short || "Loading..."}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>IAPL Investment Team</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>Tezo, Kilifi County</span>
                          </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
                            The Kenyan real estate market continues to evolve,
                            and savvy investors are constantly searching for
                            emerging hotspots with strong growth potential. One
                            area that has rapidly gained attention is{" "}
                            <strong>Tezo</strong>, a fast-developing region along
                            the North Coast. With improved infrastructure,
                            rising demand for coastal property, and new
                            developments like the latest project by{" "}
                            <strong>Inuka Afrika Properties</strong>, Tezo is
                            becoming one of the most promising real estate
                            investment destinations in Kenya.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            In this article, we explore why investing in Tezo is
                            a great idea and how Inuka Afrika Properties’ newest
                            project is creating exciting opportunities for
                            investors and homebuyers alike.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            Where Is Tezo and Why Is It Growing Fast?
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Tezo is located near Kilifi along Kenya’s scenic
                            coastline, just a short drive from Mombasa and major
                            tourist hubs. Historically quiet, the area is now
                            experiencing rapid growth due to:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Expansion of road networks</li>
                            <li>Proximity to tourist destinations</li>
                            <li>Rising demand for affordable coastal land</li>
                            <li>Increased interest from developers and investors</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            This combination of accessibility and affordability
                            has positioned Tezo as an emerging real estate
                            hotspot.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            1. Affordable Entry Point for Investors
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            One of the biggest reasons investors are turning to
                            Tezo is affordability. Compared to established
                            coastal areas like Nyali, Diani, or Watamu, Tezo
                            offers:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Lower land acquisition costs</li>
                            <li>Higher potential for capital appreciation</li>
                            <li>Entry opportunities for first-time investors</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Buying early in a growth area typically yields
                            higher long-term returns, making Tezo ideal for both
                            new and seasoned investors.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            2. Strong Capital Appreciation Potential
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Property values in emerging regions tend to rise as
                            infrastructure and demand grow. Tezo is currently in
                            this early growth phase. With more developers
                            launching projects and increased attention from
                            buyers seeking coastal living, the likelihood of
                            property appreciation is high.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Investors who secure land or property now stand to
                            benefit significantly as the area continues to
                            develop over the next 5–10 years.
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
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="bg-white shadow-2xl rounded-lg overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm opacity-90">
                          Inuka Afrika Properties
                        </div>
                        <div
                          className="text-sm opacity-90"
                          suppressHydrationWarning
                        >
                          {dates.long || "Loading..."}
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-serif">
                        Investing in Tezo (Continued)
                      </h2>
                    </div>

                    <article className="p-6 md:p-10 lg:p-12">
                      <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg max-w-none">
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4">
                            3. Rising Demand for Coastal Living
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Post-pandemic lifestyle shifts have increased demand
                            for serene, nature-rich environments. Coastal areas
                            like Tezo are attracting:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Remote workers</li>
                            <li>Retirees</li>
                            <li>Diaspora investors</li>
                            <li>Holiday home buyers</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            The appeal of beach proximity combined with a
                            peaceful environment makes Tezo a strong contender
                            for both residential and holiday property
                            investments.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            4. Infrastructure Development Is Unlocking Value
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Infrastructure plays a major role in real estate
                            growth. Tezo is benefiting from:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Improved road connectivity to Mombasa and Kilifi</li>
                            <li>Expansion of utilities like electricity and water</li>
                            <li>
                              Growth of social amenities (schools, shopping
                              centers, and healthcare)
                            </li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            As infrastructure improves, property demand and
                            value typically follow — a key signal for smart
                            investors.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            5. Inuka Afrika Properties Launches a New Project in Tezo
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Adding momentum to the area’s growth,{" "}
                            <strong>
                              Inuka Afrika Properties has launched a new project
                              in Tezo
                            </strong>
                            , further validating the region’s investment
                            potential.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Known for delivering well-planned and investor-friendly
                            developments, Inuka Afrika Properties focuses on:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Strategically located land</li>
                            <li>Flexible payment plans</li>
                            <li>Clear documentation and transparency</li>
                            <li>Value-driven projects with long-term appreciation</li>
                          </ul>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            Why This New Tezo Project Stands Out
                          </h2>

                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3">
                            Prime Location
                          </h3>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            The project is strategically positioned to benefit
                            from Tezo’s ongoing growth and accessibility to key
                            coastal towns.
                          </p>

                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3">
                            Investor-Friendly Pricing
                          </h3>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Early buyers enjoy competitive launch prices, making
                            it ideal for those seeking high ROI potential.
                          </p>

                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3">
                            Ideal for Multiple Uses
                          </h3>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            The land is suitable for:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Residential homes</li>
                            <li>Holiday rentals</li>
                            <li>Airbnb developments</li>
                            <li>Land banking</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            This versatility increases the investment appeal.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            6. Ideal for Land Banking
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Land banking — buying land and holding it for future
                            appreciation — is one of the most effective real
                            estate strategies in Kenya. Tezo presents a strong
                            case for land banking because:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Prices are still relatively low</li>
                            <li>Development momentum is increasing</li>
                            <li>Coastal demand is rising steadily</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            With projects like the new Inuka Afrika development,
                            investors can secure property early and benefit from
                            long-term value growth.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            7. Growing Interest from Diaspora Investors
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Diaspora investors are increasingly targeting coastal
                            real estate due to lifestyle appeal and long-term
                            returns. Tezo’s affordability makes it especially
                            attractive for Kenyans abroad who want to:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Own land back home</li>
                            <li>Build retirement homes</li>
                            <li>Invest in holiday rentals</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            New developments by trusted companies like Inuka
                            Afrika Properties provide added confidence for
                            overseas buyers.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            Is Now the Right Time to Invest in Tezo?
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Timing is everything in real estate. Tezo is
                            currently at a sweet spot where:
                          </p>
                          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                            <li>Prices are still accessible</li>
                            <li>Infrastructure growth is accelerating</li>
                            <li>Developer interest is rising</li>
                            <li>Buyer demand is increasing</li>
                          </ul>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Entering the market at this stage allows investors
                            to maximize appreciation potential.
                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
                            Final Thoughts
                          </h2>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Tezo is no longer a hidden gem — it’s an emerging
                            investment frontier along Kenya’s coast. With
                            affordable pricing, rising infrastructure, growing
                            demand for coastal living, and new developments like
                            the latest project by Inuka Afrika Properties, the
                            area presents a compelling opportunity for
                            forward-thinking investors.
                          </p>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Whether you’re looking to build a holiday home,
                            start an Airbnb business, or secure land for future
                            gains, Tezo offers the perfect combination of
                            affordability and growth potential. If you’re
                            considering coastal real estate in Kenya, now is the
                            time to explore opportunities in Tezo — before
                            prices catch up with its true value.
                          </p>

                          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-2">
                              Ready to explore Tezo investment opportunities?
                            </p>
                            <p className="text-gray-700 mb-4">
                              Talk to our team and discover verified plots and
                              flexible payment options across Kilifi County.
                            </p>
                            <Link
                              href="/for-sale"
                              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                            >
                              Explore Our Properties
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>

                    <div className="bg-gray-100 p-6 border-t">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600">
                          © {new Date().getFullYear()} Inuka Afrika Properties
                          Limited. All rights reserved.
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

