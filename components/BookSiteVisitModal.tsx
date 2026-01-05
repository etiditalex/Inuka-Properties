"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone, Mail, Send, CheckCircle, X } from "lucide-react";

interface BookSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function BookSiteVisitModal({ isOpen, onClose }: BookSiteVisitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Clear timeout and reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Clear any pending timeout when modal closes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Reset form state when modal closes
      setFormData({
        name: "",
        email: "",
        phone: "",
        property: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any existing timeout before creating a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Format the message for WhatsApp
    const whatsappMessage = `Hello! I would like to book a site visit:

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Property of Interest:* ${formData.property}
*Preferred Date:* ${formData.preferredDate}
*Preferred Time:* ${formData.preferredTime}
${formData.message ? `*Additional Notes:* ${formData.message}` : ''}

Thank you!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = "254711082084";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      property: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
    onClose();
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-dark-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-2xl font-bold text-dark-900 font-montserrat">Book a Site Visit</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-100 rounded-lg transition"
                  aria-label="Close modal"
                >
                  <X size={24} className="text-dark-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8">
                  <>
                    <div className="mb-6">
                      <p className="text-dark-600 font-montserrat">
                        Fill out the form below to book a site visit. Our team will contact you to confirm 
                        the details and provide directions to the property.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 font-montserrat">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="modal-name" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                            <User size={16} className="inline mr-2" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="modal-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                          />
                        </div>

                        <div>
                          <label htmlFor="modal-phone" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                            <Phone size={16} className="inline mr-2" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="modal-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="modal-email" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                          <Mail size={16} className="inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="modal-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-property" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                          <MapPin size={16} className="inline mr-2" />
                          Property of Interest *
                        </label>
                        <select
                          id="modal-property"
                          name="property"
                          value={formData.property}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                        >
                          <option value="">Select a property</option>
                          {properties.map((prop) => (
                            <option key={prop} value={prop}>
                              {prop}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="modal-date" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                            <Calendar size={16} className="inline mr-2" />
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            id="modal-date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                          />
                        </div>

                        <div>
                          <label htmlFor="modal-time" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                            <Clock size={16} className="inline mr-2" />
                            Preferred Time *
                          </label>
                          <select
                            id="modal-time"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
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
                        <label htmlFor="modal-message" className="block text-sm font-semibold text-dark-900 mb-2 font-montserrat">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          id="modal-message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Any specific requirements or questions..."
                          className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-montserrat"
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 px-6 py-3 border border-dark-300 text-dark-700 rounded-lg font-semibold hover:bg-dark-50 transition font-montserrat"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 font-montserrat"
                        >
                          <Send size={20} />
                          Book Site Visit
                        </button>
                      </div>
                    </form>
                  </>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BookSiteVisitModal;
