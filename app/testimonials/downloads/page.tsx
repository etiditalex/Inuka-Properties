"use client";

import { motion } from "framer-motion";
import { Download, FileText, Image as ImageIcon, File } from "lucide-react";

export default function DownloadsPage() {
  const downloads = [
    {
      title: "Inuka Afrika Company Profile",
      description: "Comprehensive company profile showcasing our history, services, mission, vision, and property portfolio across coastal Kenya.",
      type: "PDF",
      size: "25.3 MB",
      icon: FileText,
      file: "/downloads/Inuka-Afrika-Company-Profile.pdf",
    },
    {
      title: "Company Brochure 2024",
      description: "Comprehensive overview of our services, properties, and company information.",
      type: "PDF",
      size: "2.5 MB",
      icon: FileText,
      file: "#",
    },
    {
      title: "Property Investment Guide",
      description: "Essential guide for first-time property buyers in Kenya.",
      type: "PDF",
      size: "1.8 MB",
      icon: FileText,
      file: "#",
    },
    {
      title: "Kilifi County Properties Catalog",
      description: "Complete catalog of available properties across Kilifi County.",
      type: "PDF",
      size: "5.2 MB",
      icon: ImageIcon,
      file: "#",
    },
    {
      title: "Title Deed Application Guide",
      description: "Step-by-step guide to understanding and applying for title deeds.",
      type: "PDF",
      size: "1.2 MB",
      icon: File,
      file: "#",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Downloads</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Access helpful resources, guides, and property information
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {downloads.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={24} className="text-primary-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-dark-900 mb-2">{item.title}</h3>
                  <p className="text-dark-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-dark-500">
                      {item.type} • {item.size}
                    </div>
                    <a
                      href={item.file}
                      download
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
                    >
                      <Download size={18} />
                      Download
                    </a>
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


