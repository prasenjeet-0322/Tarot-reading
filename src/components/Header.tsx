"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
  ];

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#0D0B1E]/80 backdrop-blur-md border-b border-[#7B2FF7]/20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              <Image src="/logo.jpeg" alt="SoftTarotGirl Logo" fill className="object-cover" />
            </div>
            <span className="font-serif text-2xl font-semibold text-[#E8CC6F] tracking-wide">SoftTarotGirl</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="text-gray-300 hover:text-[#D4AF37] text-sm font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => openBooking()}
              className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#A68625] text-[#0D0B1E] font-semibold text-sm rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
            >
              Book Reading
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#0D0B1E] flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                  <Image src="/logo.jpeg" alt="SoftTarotGirl Logo" fill className="object-cover" />
                </div>
                <span className="font-serif text-2xl font-semibold text-[#E8CC6F]">SoftTarotGirl</span>
              </div>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-8 items-center mt-10">
              {navLinks.map((link) => (
                <button 
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className="text-2xl font-serif text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => { setMobileMenuOpen(false); openBooking(); }}
                className="mt-8 px-8 py-4 w-full max-w-xs bg-gradient-to-r from-[#D4AF37] to-[#A68625] text-[#0D0B1E] font-semibold text-lg rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Book Reading
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
