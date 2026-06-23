"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { STATIC_TESTIMONIALS } from "@/lib/testimonials/catalog";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  property: string;
  rating: number;
  text: string;
  image: string;
};

export default function ClientTestimonialsPage() {
  const staticItems: Testimonial[] = STATIC_TESTIMONIALS.map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location,
    property: t.property,
    rating: t.rating,
    text: t.text,
    image: t.image,
  }));

  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticItems);

  useEffect(() => {
    fetch("/api/content/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          setTestimonials(
            data.items.map((t: Testimonial) => ({
              id: t.id,
              name: t.name,
              location: t.location,
              property: t.property,
              rating: t.rating,
              text: t.text,
              image: t.image,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Client Testimonials</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Real stories from satisfied clients who found their perfect properties with us
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote size={32} className="text-primary-200 mb-4" />
              <p className="text-dark-700 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex items-center gap-4 pt-4 border-t border-dark-200">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-dark-900">{testimonial.name}</div>
                  <div className="text-sm text-dark-600">
                    {testimonial.property} • {testimonial.location}
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
