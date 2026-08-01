"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does a tarot reading work?",
    answer: "A tarot reading taps into universal energy and your personal intuition. The cards drawn act as a mirror to your subconscious, offering guidance, clarity, and a new perspective on your current situation or path forward."
  },
  {
    question: "Do I need to ask a specific question?",
    answer: "You can ask a specific question or ask for a general reading. However, clear and open-ended questions (e.g., 'What do I need to know about my career right now?') tend to yield the most insightful answers."
  },
  {
    question: "Can the cards predict the exact future?",
    answer: "Tarot doesn't predict a fixed future. Instead, it shows you the most likely outcome based on your current path and energies. You always have the free will to change your trajectory based on the insights you receive."
  },
  {
    question: "How long will it take to get my reading?",
    answer: "For standard readings (1 Question or 3 Questions), you will receive your answer within 24-48 hours. Full spread readings may take up to 72 hours, as they require deep focus and energy."
  },
  {
    question: "How is the reading delivered?",
    answer: "Depending on your preference and the plan chosen, readings are delivered via a detailed written PDF, a private voice note, or a recorded video link sent directly to your phone number via WhatsApp/SMS."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 bg-gradient-to-b from-transparent to-[#151233]/80 relative">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Clear your doubts before taking the leap.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-white hover:bg-white/5 transition-colors"
              >
                <span className="font-serif text-lg md:text-xl pr-8">{faq.question}</span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-[#D4AF37] transition-transform duration-300 shrink-0",
                    openIndex === index ? "rotate-180" : ""
                  )} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-300 font-light leading-relaxed border-t border-white/10 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
