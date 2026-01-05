"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary-600 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Cookie Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Cookie size={24} className="text-primary-600" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-dark-900 mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-dark-600 text-sm md:text-base leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies.{" "}
                  <Link 
                    href="/cookie-policy" 
                    className="text-primary-600 hover:text-primary-700 underline font-semibold"
                  >
                    Learn more
                  </Link>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleReject}
                  className="px-6 py-2.5 border-2 border-dark-300 text-dark-700 rounded-lg font-semibold hover:bg-dark-50 transition whitespace-nowrap"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleReject}
                className="absolute top-4 right-4 p-2 hover:bg-dark-100 rounded-lg transition"
                aria-label="Close cookie banner"
              >
                <X size={20} className="text-dark-600" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

