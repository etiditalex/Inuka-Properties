"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, MapPin, Download } from "lucide-react";

export default function MarketResearchPage() {
  const reports = [
    {
      title: "Kilifi County Real Estate Market Report 2024",
      description: "Comprehensive analysis of property trends, prices, and investment opportunities in Kilifi County.",
      date: "2024-01-15",
      type: "Market Report",
    },
    {
      title: "Coastal Property Investment Guide",
      description: "Detailed guide on investing in coastal properties, including beachfront and residential developments.",
      date: "2024-01-10",
      type: "Investment Guide",
    },
    {
      title: "Affordable Housing Market Analysis",
      description: "In-depth analysis of the affordable housing sector and emerging opportunities.",
      date: "2024-01-05",
      type: "Sector Analysis",
    },
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: "Market Growth",
      value: "15%",
      description: "Year-over-year growth in coastal property values",
    },
    {
      icon: MapPin,
      title: "Hot Locations",
      value: "9",
      description: "Prime locations we serve across Kilifi County",
    },
    {
      icon: BarChart3,
      title: "Investment Returns",
      value: "12-18%",
      description: "Average annual returns on coastal properties",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Market Research</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Data-driven insights to guide your property investment decisions
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <insight.icon size={32} className="text-primary-700" />
              </div>
              <div className="text-3xl font-bold text-primary-700 mb-2">{insight.value}</div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">{insight.title}</h3>
              <p className="text-sm text-dark-600">{insight.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {report.type}
                    </span>
                    <span className="text-sm text-dark-600">{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">{report.title}</h3>
                  <p className="text-dark-600">{report.description}</p>
                </div>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2">
                  <Download size={20} />
                  Download Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}



