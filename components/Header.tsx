"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BookSiteVisitModal from "./BookSiteVisitModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookVisitModalOpen, setIsBookVisitModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "For Sale",
      href: "/for-sale",
      dropdown: [
        { name: "All Properties", href: "/for-sale" },
        { name: "Ongoing Projects", href: "/for-sale/ongoing-projects" },
        { name: "Sold Out Projects", href: "/for-sale/sold-out-projects" },
      ],
    },
    {
      name: "About Us",
      href: "/about-us",
      dropdown: [
        { name: "Who We Are", href: "/about-us/who-we-are" },
        { name: "Why Us", href: "/about-us/why-us" },
        { name: "Board Of Directors", href: "/about-us/board-of-directors" },
        { name: "Our Team", href: "/about-us/our-team" },
        { name: "CSR", href: "/about-us/csr" },
        { name: "Our Partners", href: "/about-us/our-partners" },
      ],
    },
    {
      name: "IAPL Insider",
      href: "/iapl-insider",
      dropdown: [
        { name: "Blogs", href: "/iapl-insider/blogs" },
        { name: "News", href: "/iapl-insider/news" },
        { name: "Market Research", href: "/iapl-insider/market-research" },
      ],
    },
    {
      name: "Testimonials",
      href: "/testimonials",
      dropdown: [
        { name: "Client Testimonials", href: "/testimonials/client-testimonials" },
        { name: "Downloads", href: "/testimonials/downloads" },
        { name: "Video Gallery", href: "/testimonials/video-gallery" },
        { name: "Newsletters", href: "/testimonials/newsletters" },
      ],
    },
    { name: "Project Showcase", href: "/project-showcase" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Top Bar */}
      <div className="bg-primary-700 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3 lg:gap-6 flex-wrap">
              <a href="tel:+254711082084" className="flex items-center gap-2 hover:text-primary-200 transition text-xs lg:text-sm">
                <Phone size={16} />
                <span className="whitespace-nowrap">0711 082084</span>
              </a>
              <a href="mailto:info@inukaproperties.co.ke" className="flex items-center gap-2 hover:text-primary-200 transition text-xs lg:text-sm">
                <Mail size={16} />
                <span className="hidden sm:inline">info@inukaproperties.co.ke</span>
                <span className="sm:hidden">Email</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-primary-200 text-xs lg:text-sm overflow-hidden relative flex-1 max-w-[200px]">
                <div className="flex animate-marquee whitespace-nowrap">
                  <span className="inline-block px-2">Celebrating 10 Years</span>
                  <span className="inline-block px-2">•</span>
                  <span className="inline-block px-2">Celebrating 10 Years</span>
                  <span className="inline-block px-2">•</span>
                  <span className="inline-block px-2">Celebrating 10 Years</span>
                  <span className="inline-block px-2">•</span>
                  <span className="inline-block px-2">Celebrating 10 Years</span>
                  <span className="inline-block px-2">•</span>
                  <span className="inline-block px-2">Celebrating 10 Years</span>
                  <span className="inline-block px-2">•</span>
                  <span className="inline-block px-2">Celebrating 10 Years</span>
                  <span className="inline-block px-2">•</span>
                </div>
              </div>
              {/* Social Media Links */}
              <div className="flex items-center gap-2 ml-4 border-l border-primary-600 pl-4">
                <a 
                  href="https://www.facebook.com/share/17aKSxGY2a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href="https://x.com/Inukaproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="X (formerly Twitter)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/inukaafrikaproperties?igsh=MXNtbHUxbTNuNzI2eQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/inuka-afrika-properties-limited-7aa210210?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href="https://www.tiktok.com/@inukaafrikaproperties?_r=1&_t=ZM-92vSSzw2Kmi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="TikTok"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.threads.com/@inukaafrikaproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="Threads"
                >
                  <MessageCircle size={16} />
                </a>
                <a 
                  href="https://share.google/ywP6oDAf6abQtplK9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-200 transition"
                  aria-label="Google Business"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg"
                alt="Inuka Afrika Properties Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`py-2 px-3 font-medium transition ${
                        pathname.startsWith(item.href)
                          ? "text-primary-700"
                          : "text-dark-700 hover:text-primary-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                    <ChevronDown size={16} className="text-dark-600" />
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-dark-200 py-2"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm transition ${
                                pathname === subItem.href
                                  ? "text-primary-700 bg-primary-50"
                                  : "text-dark-700 hover:bg-primary-50 hover:text-primary-700"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`py-2 px-3 font-medium transition ${
                      pathname === item.href
                        ? "text-primary-700"
                        : "text-dark-700 hover:text-primary-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            {/* Book Site Visit Button */}
            <button
              onClick={() => setIsBookVisitModalOpen(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-md hover:shadow-lg"
            >
              Book Site Visit
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-dark-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="w-full flex items-center justify-between py-3 px-4 text-dark-700 font-medium hover:bg-primary-50 rounded-lg transition"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block py-2 px-4 text-sm rounded-lg transition ${
                                  pathname === subItem.href
                                    ? "text-primary-700 bg-primary-50"
                                    : "text-dark-600 hover:bg-primary-50"
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 px-4 text-dark-700 font-medium rounded-lg transition ${
                        pathname === item.href
                          ? "text-primary-700 bg-primary-50"
                          : "hover:bg-primary-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              {/* Book Site Visit Button - Mobile */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsBookVisitModalOpen(true);
                }}
                className="block w-full text-center py-3 px-4 rounded-lg font-semibold transition bg-red-600 text-white hover:bg-red-700"
              >
                Book Site Visit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Site Visit Modal */}
      <BookSiteVisitModal
        isOpen={isBookVisitModalOpen}
        onClose={() => setIsBookVisitModalOpen(false)}
      />
    </header>
  );
};

export default Header;

