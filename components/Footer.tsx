import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
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
              <a 
                href="https://www.facebook.com/share/17aKSxGY2a/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://x.com/Inukaproperties" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="X (formerly Twitter)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/inukaafrikaproperties?igsh=MXNtbHUxbTNuNzI2eQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/inuka-afrika-properties-limited-7aa210210?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@inukaafrikaproperties?_r=1&_t=ZM-92vSSzw2Kmi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.threads.com/@inukaafrikaproperties" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="Threads"
              >
                <MessageCircle size={20} />
              </a>
              <a 
                href="https://share.google/ywP6oDAf6abQtplK9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition"
                aria-label="Google Business"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
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
              <li>
                <Link href="/services/residential-properties" className="hover:text-primary-400 transition">
                  Residential Properties
                </Link>
              </li>
              <li>
                <Link href="/services/commercial-properties" className="hover:text-primary-400 transition">
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link href="/services/beach-properties" className="hover:text-primary-400 transition">
                  Beach Properties
                </Link>
              </li>
              <li>
                <Link href="/services/farm-land" className="hover:text-primary-400 transition">
                  Farm Land
                </Link>
              </li>
              <li>
                <Link href="/services/affordable-housing" className="hover:text-primary-400 transition">
                  Affordable Housing
                </Link>
              </li>
              <li>
                <Link href="/services/property-management" className="hover:text-primary-400 transition">
                  Property Management
                </Link>
              </li>
              <li>
                <Link href="/services/title-issuance" className="hover:text-primary-400 transition">
                  Title Issuance
                </Link>
              </li>
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
            <div className="flex gap-6 flex-wrap">
              <Link href="/cookie-policy" className="hover:text-primary-400 transition">
                Cookie Policy
              </Link>
              <Link href="/privacy-policy" className="hover:text-primary-400 transition">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-primary-400 transition">
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

