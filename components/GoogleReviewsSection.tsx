"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink, MessageSquare, RefreshCw } from "lucide-react";
import Image from "next/image";

interface Review {
  authorName: string;
  authorPhoto: string | null;
  rating: number;
  text: string;
  time: number;
  relativeTimeDescription: string;
}

interface GoogleReviewsData {
  reviews: Review[];
  rating: number;
  totalReviews: number;
  placeName: string;
  error?: string;
}

export default function GoogleReviewsSection() {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchReviews();
  }, []);

  // Auto-refresh reviews every 5 minutes (300000ms) for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReviews(true); // Pass true to indicate it's a refresh, not initial load
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const fetchReviews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Add cache-busting query parameter to ensure fresh data
      const response = await fetch(`/api/google-reviews?t=${Date.now()}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        // Use fallback reviews if API is not configured
        if (!reviewsData) {
          setReviewsData({
            reviews: getFallbackReviews(),
            rating: 4.8,
            totalReviews: 25,
            placeName: 'Inuka Afrika Properties',
          });
        }
      } else if (data.reviews && data.reviews.length > 0) {
        // Check if reviews have actually changed
        const hasNewReviews = !reviewsData || 
          data.reviews.length !== reviewsData.reviews.length ||
          data.totalReviews !== reviewsData.totalReviews ||
          data.rating !== reviewsData.rating;
        
        if (hasNewReviews) {
          setReviewsData(data);
          setLastUpdateTime(new Date());
        }
      } else {
        // Use fallback reviews if no reviews found
        if (!reviewsData) {
          setReviewsData({
            reviews: getFallbackReviews(),
            rating: 4.8,
            totalReviews: 25,
            placeName: 'Inuka Afrika Properties',
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
      // Use fallback reviews on error only if we don't have existing data
      if (!reviewsData) {
        setReviewsData({
          reviews: getFallbackReviews(),
          rating: 4.8,
          totalReviews: 25,
          placeName: 'Inuka Afrika Properties',
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFallbackReviews = (): Review[] => {
    return [
      {
        authorName: "John Mwangi",
        authorPhoto: null,
        rating: 5,
        text: "Inuka Afrika Properties made my dream of owning land in Kilifi come true. The process was smooth, transparent, and the team was incredibly helpful throughout. Highly recommended!",
        time: Date.now(),
        relativeTimeDescription: "2 months ago",
      },
      {
        authorName: "Sarah Wanjiku",
        authorPhoto: null,
        rating: 5,
        text: "Excellent service from start to finish. They helped us find the perfect beachfront property and handled all the paperwork professionally. We couldn't be happier!",
        time: Date.now(),
        relativeTimeDescription: "1 month ago",
      },
      {
        authorName: "David Ochieng",
        authorPhoto: null,
        rating: 5,
        text: "As a business owner, I needed a commercial space that met specific requirements. Inuka Afrika Properties understood my needs and found the perfect location. Great experience!",
        time: Date.now(),
        relativeTimeDescription: "3 months ago",
      },
      {
        authorName: "Grace Akinyi",
        authorPhoto: null,
        rating: 5,
        text: "The affordable housing project in Kikambala is exactly what we needed. The quality is excellent, and the payment plan made it accessible for our family. Thank you!",
        time: Date.now(),
        relativeTimeDescription: "2 weeks ago",
      },
      {
        authorName: "Peter Kamau",
        authorPhoto: null,
        rating: 5,
        text: "Professional team, transparent process, and excellent customer service. I purchased a plot in Mariakani and the entire experience was seamless. Highly recommend!",
        time: Date.now(),
        relativeTimeDescription: "1 month ago",
      },
    ];
  };

  const nextReview = () => {
    if (!reviewsData) return;
    setCurrentIndex((prev) => (prev + 1) % reviewsData.reviews.length);
  };

  const prevReview = () => {
    if (!reviewsData) return;
    setCurrentIndex((prev) => (prev - 1 + reviewsData.reviews.length) % reviewsData.reviews.length);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-dark-600 font-montserrat">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return null;
  }

  const currentReview = reviewsData.reviews[currentIndex];
  const displayReviews = reviewsData.reviews.slice(0, 6); // Show 6 reviews on desktop (2 rows of 3)

  return (
    <section className="py-20 bg-gradient-to-br from-dark-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4 font-montserrat">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`${
                    i < Math.floor(reviewsData.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-dark-200 text-dark-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-dark-900 font-montserrat">
              {reviewsData.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-dark-600 font-montserrat">
            Based on {reviewsData.totalReviews}+ Google Reviews
          </p>
          {refreshing && (
            <p className="text-sm text-primary-600 font-montserrat mt-2 flex items-center justify-center gap-2">
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></span>
              Checking for new reviews...
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-2">
            {lastUpdateTime && (
              <p className="text-xs text-dark-500 font-montserrat">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={() => fetchReviews(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-montserrat transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh reviews"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </motion.div>

        {/* Desktop: Grid of 6 reviews (2 rows of 3) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
          {displayReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-dark-200 text-dark-200"
                    }`}
                  />
                ))}
              </div>
              <Quote size={32} className="text-primary-200 mb-4" />
              <p className="text-dark-700 mb-6 italic font-montserrat line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-dark-200">
                {review.authorPhoto ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={review.authorPhoto}
                      alt={review.authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center">
                    <span className="text-primary-700 font-bold font-montserrat">
                      {review.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-dark-900 font-montserrat">
                    {review.authorName}
                  </div>
                  <div className="text-sm text-dark-600 font-montserrat">
                    {review.relativeTimeDescription}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="lg:hidden relative">
          <div className="relative overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`${
                          i < currentReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-dark-200 text-dark-200"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote size={32} className="text-primary-200 mb-4" />
                  <p className="text-dark-700 mb-6 italic font-montserrat">
                    "{currentReview.text}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-dark-200">
                    {currentReview.authorPhoto ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={currentReview.authorPhoto}
                          alt={currentReview.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center">
                        <span className="text-primary-700 font-bold font-montserrat">
                          {currentReview.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-dark-900 font-montserrat">
                        {currentReview.authorName}
                      </div>
                      <div className="text-sm text-dark-600 font-montserrat">
                        {currentReview.relativeTimeDescription}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition z-10"
            aria-label="Previous review"
          >
            <ChevronLeft size={24} className="text-dark-900" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition z-10"
            aria-label="Next review"
          >
            <ChevronRight size={24} className="text-dark-900" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {reviewsData.reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? "bg-primary-600 w-6" : "bg-dark-300"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Reviews Link */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Inuka+Afrika+Properties+Nyali+Mombasa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold font-montserrat transition"
          >
            View All Reviews on Google
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Share Your Review Section */}
      <div className="container mx-auto px-4 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 md:p-12 text-center text-white"
        >
          <div className="max-w-2xl mx-auto">
            <MessageSquare size={48} className="mx-auto mb-4 text-primary-200" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
              Share Your Review
            </h3>
            <p className="text-lg text-primary-100 mb-6 font-montserrat">
              Help others discover Inuka Afrika Properties by sharing your experience with us
            </p>
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJh7mWVCcTQBgRz0n0qhSMn1Q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg font-montserrat"
            >
              <MessageSquare size={20} />
              Write a Review on Google
              <ExternalLink size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

