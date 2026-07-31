"use client";

import { motion } from "framer-motion";
import { BookingForm } from "./BookingForm";

export function BookingSection() {
  return (
    <section id="booking" className="py-12 bg-[#0D0B1E]/80 relative">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8CC6F]">Clarity?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400"
          >
            Fill out the form below to initiate your mystical journey.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
}
