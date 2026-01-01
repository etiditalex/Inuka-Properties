"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
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
        { name: "Newsletters", href: "/testimonials/newsletters" },
      ],
    },
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
            <div className="flex items-center gap-6">
              <a href="tel:+254711082084" className="flex items-center gap-2 hover:text-primary-200 transition">
                <Phone size={16} />
                <span>0711 082084</span>
              </a>
              <a href="mailto:info@inukaproperties.co.ke" className="flex items-center gap-2 hover:text-primary-200 transition">
                <Mail size={16} />
                <span>info@inukaproperties.co.ke</span>
              </a>
            </div>
            <div className="text-primary-200">
              Celebrating 10 Years of Excellence
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
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767244056/Inuka_logo_fbsyst.jpg"
                alt="Inuka Afrika Properties Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

