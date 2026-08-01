"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-12 bg-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#7B2FF7]/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] max-w-md mx-auto rounded-t-full rounded-b-3xl overflow-hidden border-4 border-[#1A1642] relative p-2 shadow-[0_0_40px_rgba(123,47,247,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#151233] to-transparent z-10" />
              <div className="w-full h-full rounded-t-full rounded-b-2xl bg-[#1A1642] flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517488629431-6427e0ee1e5f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                 {/* Placeholder for actual photo */}
                 <span className="relative z-20 font-serif italic text-xl text-[#D4AF37]/50">[ Your Photo Here ]</span>
              </div>
            </div>
            
            {/* Sparkle decorations */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 text-[#D4AF37]"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          </motion.div>

          {/* Bio Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8CC6F]">Guide</span>
            </h2>
            <div className="space-y-6 text-gray-300 font-light leading-relaxed">
              <p>
                Welcome, seeker. I am an intuitive tarot reader dedicated to helping you navigate life&apos;s unseen paths. Through the ancient wisdom of the cards, I channel cosmic energy to bring you clarity and peace.
              </p>
              <p>
                My journey with tarot began as a personal quest for meaning and has blossomed into a lifelong calling. I believe that the future is not set in stone, but rather a tapestry of possibilities waiting to be woven by your choices.
              </p>
              <p>
                Whether you&apos;re facing a crossroads in love, career, or personal growth, I am here to illuminate the shadows and empower you to step into your highest potential.
              </p>
            </div>
            
            <div className="mt-8 font-serif text-2xl italic text-[#D4AF37]">
              &quot;The stars speak to those who listen.&quot;
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
