"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function BookSiteVisitPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend service
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        property: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const properties = [
    "Mwanda Phase 3",
    "Kibao Kiche Haven",
    "Bofa Platinum",
    "Chumani Phase 6",
    "Kikambala Phase 2",
    "Chumani Phase 3",
    "Ocean View Gardens",
    "Mtondia Highway Gardens",
    "Malindi Airport Gardens",
    "Other / Not Sure",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Book a Site Visit</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Schedule a visit to explore our properties in person
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-dark-900 mb-4">Booking Confirmed!</h2>
                <p className="text-dark-600 text-lg mb-6">
                  Thank you for booking a site visit. Our team will contact you shortly to confirm the details.
                </p>
                <div className="bg-primary-50 rounded-lg p-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-dark-900 mb-3">What's Next?</h3>
                  <ul className="space-y-2 text-dark-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>We'll call you within 24 hours to confirm your visit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>You'll receive a confirmation email with visit details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>Our team will guide you to the property location</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-dark-900 mb-4 font-serif">
                    Schedule Your Visit
                  </h2>
                  <p className="text-dark-600">
                    Fill out the form below to book a site visit. Our team will contact you to confirm 
                    the details and provide directions to the property.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-dark-900 mb-2">
                        <User size={16} className="inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-dark-900 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-dark-900 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="property" className="block text-sm font-semibold text-dark-900 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Property of Interest *
                    </label>
                    <select
                      id="property"
                      name="property"
                      value={formData.property}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a property</option>
                      {properties.map((prop) => (
                        <option key={prop} value={prop}>
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-semibold text-dark-900 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-semibold text-dark-900 mb-2">
                        <Clock size={16} className="inline mr-2" />
                        Preferred Time *
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-dark-900 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Any specific requirements or questions..."
                      className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Book Site Visit
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

