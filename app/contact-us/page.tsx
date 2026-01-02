"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Clock, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend service
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center relative">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-6 text-dark-600">
                <Link href="/" className="flex items-center hover:text-primary-600 transition">
                  <Home size={18} className="stroke-2" />
                </Link>
                <ChevronRight size={16} className="text-dark-400" />
                <span className="text-dark-900 font-montserrat">Contact us</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 mb-4 font-montserrat">
                Contact Us
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-dark-600 font-montserrat">
                Get in Touch with Our Experts
              </p>
            </motion.div>

            {/* Right Side - City Skyline Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative h-64 md:h-80"
            >
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* City Skyline Buildings */}
                <g stroke="#e5e7eb" strokeWidth="1.5" fill="none">
                  {/* Building 1 */}
                  <rect x="20" y="180" width="60" height="100" />
                  <rect x="25" y="190" width="8" height="8" />
                  <rect x="37" y="190" width="8" height="8" />
                  <rect x="49" y="190" width="8" height="8" />
                  <rect x="61" y="190" width="8" height="8" />
                  <rect x="25" y="205" width="8" height="8" />
                  <rect x="37" y="205" width="8" height="8" />
                  <rect x="49" y="205" width="8" height="8" />
                  <rect x="61" y="205" width="8" height="8" />
                  
                  {/* Building 2 */}
                  <rect x="100" y="150" width="70" height="130" />
                  <rect x="108" y="160" width="10" height="10" />
                  <rect x="123" y="160" width="10" height="10" />
                  <rect x="138" y="160" width="10" height="10" />
                  <rect x="153" y="160" width="10" height="10" />
                  <rect x="108" y="178" width="10" height="10" />
                  <rect x="123" y="178" width="10" height="10" />
                  <rect x="138" y="178" width="10" height="10" />
                  <rect x="153" y="178" width="10" height="10" />
                  <rect x="108" y="196" width="10" height="10" />
                  <rect x="123" y="196" width="10" height="10" />
                  <rect x="138" y="196" width="10" height="10" />
                  <rect x="153" y="196" width="10" height="10" />
                  
                  {/* Building 3 */}
                  <rect x="190" y="200" width="50" height="80" />
                  <rect x="197" y="210" width="8" height="8" />
                  <rect x="209" y="210" width="8" height="8" />
                  <rect x="221" y="210" width="8" height="8" />
                  <rect x="233" y="210" width="8" height="8" />
                  <rect x="197" y="225" width="8" height="8" />
                  <rect x="209" y="225" width="8" height="8" />
                  <rect x="221" y="225" width="8" height="8" />
                  <rect x="233" y="225" width="8" height="8" />
                  
                  {/* Building 4 - Tallest */}
                  <rect x="260" y="120" width="80" height="160" />
                  <rect x="270" y="135" width="12" height="12" />
                  <rect x="287" y="135" width="12" height="12" />
                  <rect x="304" y="135" width="12" height="12" />
                  <rect x="321" y="135" width="12" height="12" />
                  <rect x="270" y="155" width="12" height="12" />
                  <rect x="287" y="155" width="12" height="12" />
                  <rect x="304" y="155" width="12" height="12" />
                  <rect x="321" y="155" width="12" height="12" />
                  <rect x="270" y="175" width="12" height="12" />
                  <rect x="287" y="175" width="12" height="12" />
                  <rect x="304" y="175" width="12" height="12" />
                  <rect x="321" y="175" width="12" height="12" />
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-dark-900 mb-6 font-montserrat">
                  Get in Touch
                </h2>
                <p className="text-dark-600 mb-8 text-lg font-montserrat">
                  Visit our head office or reach out through any of the channels below. 
                  Our team is ready to assist you with your property needs.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 mb-1 font-montserrat">Head Office</h3>
                    <p className="text-dark-600 font-montserrat">
                      Links Road Opposite Kigothos Hotel<br />
                      P.O. BOX 525-80100<br />
                      Nyali, Mombasa, Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 mb-1 font-montserrat">Phone</h3>
                    <a href="tel:+254711082084" className="text-primary-600 hover:text-primary-700 font-montserrat">
                      0711 082084
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 mb-1 font-montserrat">Email</h3>
                    <a href="mailto:info@inukaproperties.co.ke" className="text-primary-600 hover:text-primary-700 font-montserrat">
                      info@inukaproperties.co.ke
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 mb-1 font-montserrat">Business Hours</h3>
                    <p className="text-dark-600 font-montserrat">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-2 font-montserrat">Message Sent!</h3>
                  <p className="text-dark-600 font-montserrat">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                    >
                      <option value="">Select a subject</option>
                      <option value="property-inquiry">Property Inquiry</option>
                      <option value="site-visit">Book Site Visit</option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 font-montserrat"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-dark-200">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2 font-montserrat">
              Find Us
            </h2>
            <p className="text-dark-600 font-montserrat">
              INUKA AFRIKA PROPERTIES LTD
            </p>
            <p className="text-dark-600 font-montserrat">
              Links Road Opposite Kigothos Hotel, P.O. BOX 525-80100, Nyali, Mombasa, Kenya
            </p>
          </div>
          <div className="relative w-full h-96 md:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5!2d39.75!3d-4.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDMnMDAuMCJTIDM5wrA0NScwMC4wIkU!5e0!3m2!1sen!2ske!4v1234567890123!5m2!1sen!2ske&q=Links+Road+Opposite+Kigothos+Hotel+Nyali+Mombasa+Kenya"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="INUKA AFRIKA PROPERTIES LTD Location"
            ></iframe>
          </div>
          <div className="p-6 bg-dark-50">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Links+Road+Opposite+Kigothos+Hotel+Nyali+Mombasa+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-montserrat font-semibold"
            >
              <MapPin size={20} />
              Open in Google Maps
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

