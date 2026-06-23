export type StaticTestimonial = {
  id: number;
  name: string;
  location: string;
  property: string;
  rating: number;
  text: string;
  image: string;
  sort_order: number;
};

export const STATIC_TESTIMONIALS: StaticTestimonial[] = [
  {
    id: 1,
    name: "John Mwangi",
    location: "Kilifi",
    property: "Residential Plot",
    rating: 5,
    text: "Inuka Afrika Properties made my dream of owning land in Kilifi come true. The process was smooth, transparent, and the team was incredibly helpful throughout. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    sort_order: 1,
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    location: "Mtwapa",
    property: "Beachfront Villa",
    rating: 5,
    text: "Excellent service from start to finish. They helped us find the perfect beachfront property and handled all the paperwork professionally. We couldn't be happier!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    sort_order: 2,
  },
  {
    id: 3,
    name: "David Ochieng",
    location: "Mariakani",
    property: "Commercial Space",
    rating: 5,
    text: "As a business owner, I needed a commercial space that met specific requirements. Inuka Afrika Properties understood my needs and found the perfect location. Great experience!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    sort_order: 3,
  },
  {
    id: 4,
    name: "Grace Akinyi",
    location: "Kikambala",
    property: "Affordable Housing",
    rating: 5,
    text: "The affordable housing project in Kikambala is exactly what we needed. The quality is excellent, and the payment plan made it accessible for our family. Thank you!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    sort_order: 4,
  },
  {
    id: 5,
    name: "Peter Kamau",
    location: "Chakama",
    property: "Farm Land",
    rating: 5,
    text: "Purchased farm land in Chakama through Inuka Afrika Properties. The title transfer was seamless, and the land is exactly as described. Professional service throughout.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    sort_order: 5,
  },
  {
    id: 6,
    name: "Mary Njeri",
    location: "Malindi",
    property: "Beach Plot",
    rating: 5,
    text: "10 years of experience really shows! The team's knowledge of the coastal market is impressive. They guided us to the perfect investment property in Malindi.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    sort_order: 6,
  },
];
