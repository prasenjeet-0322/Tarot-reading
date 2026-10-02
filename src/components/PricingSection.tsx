"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PhoneCall, ScrollText } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export function PricingSection() {
  const { openBooking } = useBooking();

  return (
    <section id="pricing" className="py-12 bg-gradient-to-b from-[#2E0A27]/80 to-[#1F071B]/80 relative">
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4"
          >
            Tarot Reading Price List
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Accessible, personalized guidance tailored to your spiritual needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[360px_360px] justify-center gap-8 max-w-5xl mx-auto">
          {/* Voice Call Readings */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full p-8 rounded-2xl flex flex-col transition-all duration-300 bg-gradient-to-b from-[#380E31] to-[#1F071B] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#A68625] text-[#1F071B] text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <PhoneCall className="w-3 h-3" />
              Voice Call Readings
            </div>
            
            <div className="mb-6 mt-2 text-center">
              <h3 className="text-2xl font-serif text-white mb-2">Live Session</h3>
              <p className="text-sm text-gray-400">Direct, live spiritual guidance over a dedicated voice call.</p>
            </div>

            <div className="flex-1 mb-8">
              <div className="space-y-4">
                {[
                  { time: "10 Minutes", price: "₹110" },
                  { time: "20 Minutes", price: "₹199" },
                  { time: "30 Minutes", price: "₹249" },
                  { time: "1 Hour", price: "₹450" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                    <span className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="text-lg">⏱️</span> {item.time}
                    </span>
                    <span className="text-xl font-bold text-[#D4AF37]">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => openBooking("Voice Call - 10 Min (₹110)")}
              className="w-full py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#A68625] text-[#1F071B] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105"
            >
              Book a Call
            </button>
          </motion.div>

          {/* Card Readings */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full p-8 rounded-2xl flex flex-col transition-all duration-300 glass-card hover:-translate-y-2 hover:border-[#F472B6]/60"
          >
            <div className="mb-6 mt-2 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#F472B6]/20 rounded-full flex items-center justify-center mb-4">
                <ScrollText className="w-6 h-6 text-[#F472B6]" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">Card Readings</h3>
              <p className="text-sm text-gray-400">Personalized tarot card pulls for clarity on specific questions.</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-[#D4AF37]">₹35</span>
                <span className="text-gray-400 text-lg ml-2">card</span>
              </div>
              <ul className="space-y-4 w-full">
                {[
                  "Detailed, insightful interpretation",
                  "Focus on your specific life areas",
                  "Choose as many cards as you need",
                  "Delivered beautifully via text/audio"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-[#F472B6] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => openBooking("Card Reading (₹35 card)")}
              className="w-full py-3 rounded-xl font-medium transition-all duration-300 bg-white/10 text-white hover:bg-[#D946EF] hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] mt-auto"
            >
              Request Reading
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
