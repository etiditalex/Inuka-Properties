"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Preload all project images
const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
};

interface Project {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  size: string;
  image: string;
  features?: string[];
}

const projects: Project[] = [
  {
    id: 5,
    title: "Mtondia Highway Gardens",
    location: "Mtondia, Kilifi County",
    type: "Residential",
    price: "KES 995,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286867/Mtondia_Higway_Gardens_2_rwwsyi.jpg",
    features: ["Highway Access", "University Proximity", "Serviced Plots", "Water & Electricity", "Secure Location"],
  },
  {
    id: 11,
    title: "Mwanda Phase 3",
    location: "Mariakani, Kilifi County",
    type: "Residential",
    price: "KES 325,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330607/Mwanda_Phase_3_3_ejntad.jpg",
    features: ["Prime Location - 1km off Mariakani-Kaloleni Bypass", "Water & Electricity on-site", "Ready to Build", "Perfect for Home or Investment"],
  },
  {
    id: 1,
    title: "Bofa Platinum Estate",
    location: "Bofa, Kilifi County",
    type: "Beach",
    price: "KES 5,990,000",
    size: "1/4 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767284997/bofa_platinum_gf7vxw.jpg",
    features: ["Beachfront Location", "Gated Community", "30m from Beach", "3 Bedroom Bungalows", "Electricity on Site"],
  },
  {
    id: 3,
    title: "Kikambala Phase 2",
    location: "Kikambala, Kilifi County",
    type: "Residential",
    price: "KES 1,250,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767285860/Kikambala_Phase_2_cw64y8.jpg",
    features: ["Serene & Secure", "Coastal Lifestyle", "Utilities Connected", "Perimeter Fence", "9m Wide Access Roads"],
  },
  {
    id: 10,
    title: "Kibao Kiche Haven",
    location: "Mariakani, Kilifi County",
    type: "Residential",
    price: "KES 399,000",
    size: "50x100 (1/8 Acre)",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767330214/Kibao_kiche_haven_3_syxxkx.jpg",
    features: ["Prime Location - 500m from Mariakani-Mavueni & Mkapuni bypasses", "Affordable Pricing", "Flexible Payments", "High Growth Potential"],
  },
  {
    id: 4,
    title: "Chumani Phase 3",
    location: "Chumani, Kilifi County",
    type: "Residential",
    price: "KES 550,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286100/chumani_phase_3_2_muym3y.jpg",
    features: ["Flexible Payments", "Highway Proximity", "Ready for Development", "Utilities Available"],
  },
  {
    id: 9,
    title: "Ocean View Gardens",
    location: "Tezo, Kilifi County",
    type: "Residential",
    price: "KES 495,000",
    size: "1/8 Acre",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1767286495/Ocean_View_Gardens_2_eyxuaz.jpg",
    features: ["All-Inclusive Pricing", "Beach Proximity", "Highway Access", "Serviced Plots", "Utilities on Site"],
  },
];

const slogans = [
  "Your Trusted Partner",
  "Trust. Invest. Grow.",
  "Celebrating 10 Years",
];

export default function ProjectShowcasePage() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  // Preload all images on mount and preload next image
  useEffect(() => {
    const imageUrls = projects.map((p) => p.image);
    preloadImages(imageUrls);
  }, []);

  // Preload next project image for smooth transitions
  useEffect(() => {
    const nextIndex = (currentProjectIndex + 1) % projects.length;
    const nextImage = projects[nextIndex].image;
    const img = new window.Image();
    img.src = nextImage;
  }, [currentProjectIndex]);

  // Rotate projects every 10 seconds
  useEffect(() => {
    const projectInterval = setInterval(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    }, 10000);

    return () => clearInterval(projectInterval);
  }, []);

  // Rotate slogans every 15 seconds
  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 15000);

    return () => clearInterval(sloganInterval);
  }, []);

  const currentProject = projects[currentProjectIndex];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-dark-900" style={{ margin: 0, padding: 0 }}>
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        {currentProject && (
          <Image
            src={currentProject.image}
            alt={currentProject.title}
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized={false}
            sizes="100vw"
            loading="eager"
          />
        )}
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/40 to-dark-900/80" />
      </div>

      {/* Running Slogan at Top */}
      <div className="absolute top-0 left-0 right-0 z-20 h-20 lg:h-24 xl:h-28 overflow-hidden bg-red-600/90 backdrop-blur-md">
        <motion.div
          className="whitespace-nowrap flex h-full items-center"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <span
              key={`${currentSloganIndex}-${i}`}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium text-white font-montserrat tracking-wide mx-16 lg:mx-24 inline-block py-2"
            >
              {slogans[currentSloganIndex]}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Project Screen - Full Screen */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`project-${currentProjectIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full w-full flex items-center justify-center pt-20 lg:pt-24 xl:pt-28"
        >
          {/* Full Screen Project Content - Simplified */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 lg:px-16 xl:px-24 text-center">
            {/* Project Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium mb-8 font-montserrat text-white"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
            >
              {currentProject.title}
            </motion.h1>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/90 mb-12 font-montserrat font-light"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
            >
              {currentProject.location}
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-medium text-primary-400 font-montserrat"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
            >
              {currentProject.price}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator (Optional - subtle dots at bottom) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {projects.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              index === currentProjectIndex
                ? "bg-primary-400 w-8"
                : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

