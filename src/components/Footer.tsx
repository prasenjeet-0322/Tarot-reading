"use client";

import { Moon, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-[#0D0B1E]/90 backdrop-blur-md border-t border-[#7B2FF7]/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#151233] to-transparent opacity-50" />
      
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Moon className="w-6 h-6 text-[#D4AF37]" />
              <span className="font-serif text-2xl text-white tracking-wide">Mystic Tarot</span>
            </div>
            <p className="text-gray-400 font-light mb-6">
              Illuminating your path with intuitive guidance and cosmic wisdom.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/softtarotgirl?igsh=MThqY2h0NDhrc2w3ag==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-gray-400 transition-all">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7B2FF7]" /> Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'How it Works', 'Pricing', 'About Me'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm font-light">
          <p>© {new Date().getFullYear()} Mystic Tarot. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
