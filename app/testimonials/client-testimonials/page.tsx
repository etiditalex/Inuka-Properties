"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function ClientTestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "John Mwangi",
      location: "Kilifi",
      property: "Residential Plot",
      rating: 5,
      text: "Inuka Afrika Properties made my dream of owning land in Kilifi come true. The process was smooth, transparent, and the team was incredibly helpful throughout. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
    {
      id: 2,
      name: "Sarah Wanjiku",
      location: "Mtwapa",
      property: "Beachfront Villa",
      rating: 5,
      text: "Excellent service from start to finish. They helped us find the perfect beachfront property and handled all the paperwork professionally. We couldn't be happier!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    {
      id: 3,
      name: "David Ochieng",
      location: "Mariakani",
      property: "Commercial Space",
      rating: 5,
      text: "As a business owner, I needed a commercial space that met specific requirements. Inuka Afrika Properties understood my needs and found the perfect location. Great experience!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
    {
      id: 4,
      name: "Grace Akinyi",
      location: "Kikambala",
      property: "Affordable Housing",
      rating: 5,
      text: "The affordable housing project in Kikambala is exactly what we needed. The quality is excellent, and the payment plan made it accessible for our family. Thank you!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
    {
      id: 5,
      name: "Peter Kamau",
      location: "Chakama",
      property: "Farm Land",
      rating: 5,
      text: "Purchased farm land in Chakama through Inuka Afrika Properties. The title transfer was seamless, and the land is exactly as described. Professional service throughout.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
    {
      id: 6,
      name: "Mary Njeri",
      location: "Malindi",
      property: "Beach Plot",
      rating: 5,
      text: "10 years of experience really shows! The team's knowledge of the coastal market is impressive. They guided us to the perfect investment property in Malindi.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
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
              <p className="text-dark-700 mb-6 italic">"{testimonial.text}"</p>
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








