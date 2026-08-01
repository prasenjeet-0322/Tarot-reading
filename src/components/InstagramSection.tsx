"use client";

import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

const posts = [
  "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600&auto=format&fit=crop",
];

export function InstagramSection() {
  return (
    <section className="py-12 bg-transparent relative">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] mb-6">
            <div className="w-full h-full bg-[#0D0B1E] rounded-full flex items-center justify-center">
              <FaInstagram className="w-8 h-8 text-white" />
            </div>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4"
          >
            Follow the Magic
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Join our community on Instagram for daily collective readings, planetary transits, and spiritual guidance. @softtarotgirl
          </motion.p>
          
          <a href="https://www.instagram.com/softtarotgirl?igsh=MThqY2h0NDhrc2w3ag==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#7B2FF7]/40 hover:bg-[#7B2FF7]/10 text-white transition-all">
            <span>Follow @softtarotgirl</span>
          </a>
        </div>

      </div>
    </section>
  );
}
