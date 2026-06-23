"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { STATIC_GALLERY_VIDEOS } from "@/lib/videos/catalog";

type Video = { id: string; title: string };

export default function VideoGalleryPage() {
  const staticVideos: Video[] = STATIC_GALLERY_VIDEOS.map((v) => ({
    id: v.youtube_id,
    title: v.title,
  }));

  const [videos, setVideos] = useState<Video[]>(staticVideos);

  useEffect(() => {
    fetch("/api/content/videos")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          setVideos(
            data.items.map((v: { youtube_id: string; title: string }) => ({
              id: v.youtube_id,
              title: v.title,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-20">
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Play className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair">
                Video Gallery
              </h1>
            </div>
            <p className="text-lg md:text-xl text-primary-100 mt-4 max-w-2xl mx-auto">
              Explore our collection of videos showcasing our properties, projects, and company highlights
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full pb-[56.25%] bg-gray-900">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-dark-800 font-montserrat">
                  {video.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-lg p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">
            Interested in Our Properties?
          </h2>
          <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
            Contact us today to learn more about our available properties and investment opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact-us"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-300"
            >
              Contact Us
            </a>
            <a
              href="/for-sale"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors duration-300 border-2 border-white"
            >
              View Properties
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
