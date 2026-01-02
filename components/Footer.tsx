import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = 10; // Celebrating 10 years

  return (
    <footer className="bg-dark-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg"
                  alt="Inuka Afrika Properties Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-dark-300 text-sm mb-4">
              {yearsInBusiness} years of transforming the real estate landscape in Kenya. 
              Your trusted partner for affordable property solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-400 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-dark-300 hover:text-primary-400 transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/for-sale" className="text-dark-300 hover:text-primary-400 transition text-sm">
                  Properties For Sale
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-dark-300 hover:text-primary-400 transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/iapl-insider" className="text-dark-300 hover:text-primary-400 transition text-sm">
                  IAPL Insider
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-dark-300 hover:text-primary-400 transition text-sm">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-dark-300 hover:text-primary-400 transition text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-dark-300">
              <li>Residential Properties</li>
              <li>Commercial Properties</li>
              <li>Beach Properties</li>
              <li>Farm Land</li>
              <li>Affordable Housing</li>
              <li>Property Management</li>
              <li>Title Issuance</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-dark-300">
                  Links Road Opposite Kigothos Hotel<br />
                  P.O. BOX 525-80100<br />
                  Nyali, Mombasa, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+254711082084" className="text-dark-300 hover:text-primary-400 transition">
                  0711 082084
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:info@inukaproperties.co.ke" className="text-dark-300 hover:text-primary-400 transition">
                  info@inukaproperties.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-400">
            <p>
              © {currentYear} Inuka Afrika Properties Limited. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/about-us" className="hover:text-primary-400 transition">
                Privacy Policy
              </Link>
              <Link href="/about-us" className="hover:text-primary-400 transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

