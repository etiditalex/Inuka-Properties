"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  ExternalLink,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
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
  placeName?: string;
  mapsUrl?: string;
  writeReviewUrl?: string;
  source?: string;
  fetchedAt?: string;
  error?: string;
}

const DEFAULT_MAPS_URL =
  "https://www.google.com/maps/place/?q=place_id:ChIJh7mWVCcTQBgRz0n0qhSMn1Q";
const DEFAULT_WRITE_URL =
  "https://search.google.com/local/writereview?placeid=ChIJh7mWVCcTQBgRz0n0qhSMn1Q";

export default function GoogleReviewsSection() {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const fetchReviews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch(
        `/api/google-reviews?t=${Date.now()}${isRefresh ? "&refresh=1" : ""}`,
        { cache: "no-store" }
      );
      const data = (await response.json()) as GoogleReviewsData & {
        error?: string;
      };

      if (data.reviews && data.reviews.length > 0) {
        setReviewsData(data);
        setError(null);
        setLastUpdateTime(data.fetchedAt ? new Date(data.fetchedAt) : new Date());
        setCurrentIndex(0);
      } else {
        setReviewsData(null);
        setError(data.error || "No Google reviews available right now.");
      }
    } catch (err: unknown) {
      console.error("Error fetching reviews:", err);
      setReviewsData(null);
      setError(err instanceof Error ? err.message : "Failed to load Google reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Refresh every 2 minutes for near real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReviews(true);
    }, 120000);
    return () => clearInterval(interval);
  }, [fetchReviews]);

  const mapsUrl = reviewsData?.mapsUrl || DEFAULT_MAPS_URL;
  const writeUrl = reviewsData?.writeReviewUrl || DEFAULT_WRITE_URL;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
            <p className="mt-4 text-dark-600 font-montserrat">Loading Google reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-dark-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-dark-900 font-montserrat md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mb-6 text-dark-600 font-montserrat">
              Our latest client feedback lives on Google. Open our Google Business profile to read
              real reviews in real time.
            </p>
            {error && (
              <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 font-montserrat">
                Live reviews will appear here once Google Places is fully connected.
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 font-montserrat"
              >
                View Google Reviews
                <ExternalLink size={18} />
              </a>
              <a
                href={writeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-50 font-montserrat"
              >
                <MessageSquare size={18} />
                Write a Review
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentReview = reviewsData.reviews[currentIndex];
  const displayReviews = reviewsData.reviews.slice(0, 6);

  return (
    <section className="py-20 bg-gradient-to-br from-dark-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-700 font-montserrat">
            Live from Google
          </p>
          <h2 className="mb-4 text-3xl font-bold text-dark-900 font-montserrat md:text-4xl">
            What Our Clients Say
          </h2>
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={
                    i < Math.floor(reviewsData.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-dark-200 text-dark-200"
                  }
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-dark-900 font-montserrat">
              {reviewsData.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-dark-600 font-montserrat">
            Based on {reviewsData.totalReviews} Google Reviews
            {reviewsData.placeName ? ` · ${reviewsData.placeName}` : ""}
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            {lastUpdateTime && (
              <p className="text-xs text-dark-500 font-montserrat">
                Updated {lastUpdateTime.toLocaleTimeString()}
              </p>
            )}
            <button
              type="button"
              onClick={() => fetchReviews(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-primary-600 transition hover:text-primary-700 font-montserrat disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Refresh reviews"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </motion.div>

        <div className="mb-8 hidden gap-6 lg:grid lg:grid-cols-3">
          {displayReviews.map((review) => (
            <motion.div
              key={`${review.authorName}-${review.time}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-lg transition hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-dark-200 text-dark-200"
                    }
                  />
                ))}
              </div>
              <Quote size={32} className="mb-4 text-primary-200" />
              <p className="mb-6 line-clamp-4 italic text-dark-700 font-montserrat">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-4 border-t border-dark-200 pt-4">
                {review.authorPhoto ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={review.authorPhoto}
                      alt={review.authorName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-200">
                    <span className="font-bold text-primary-700 font-montserrat">
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

        <div className="relative lg:hidden">
          <div className="relative overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < currentReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-dark-200 text-dark-200"
                        }
                      />
                    ))}
                  </div>
                  <Quote size={32} className="mb-4 text-primary-200" />
                  <p className="mb-6 italic text-dark-700 font-montserrat">
                    &ldquo;{currentReview.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 border-t border-dark-200 pt-4">
                    {currentReview.authorPhoto ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={currentReview.authorPhoto}
                          alt={currentReview.authorName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-200">
                        <span className="font-bold text-primary-700 font-montserrat">
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

          <button
            type="button"
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + reviewsData.reviews.length) % reviewsData.reviews.length
              )
            }
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
            aria-label="Previous review"
          >
            <ChevronLeft size={24} className="text-dark-900" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % reviewsData.reviews.length)
            }
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
            aria-label="Next review"
          >
            <ChevronRight size={24} className="text-dark-900" />
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {reviewsData.reviews.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition ${
                  index === currentIndex ? "w-6 bg-primary-600" : "w-2 bg-dark-300"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-primary-600 transition hover:text-primary-700 font-montserrat"
          >
            View All Reviews on Google
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      <div className="container mx-auto mt-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center text-white md:p-12"
        >
          <div className="mx-auto max-w-2xl">
            <MessageSquare size={48} className="mx-auto mb-4 text-primary-200" />
            <h3 className="mb-4 text-2xl font-bold font-montserrat md:text-3xl">
              Share Your Review
            </h3>
            <p className="mb-6 text-lg text-primary-100 font-montserrat">
              Help others discover Inuka Afrika Properties by sharing your experience with us
            </p>
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50 font-montserrat"
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
