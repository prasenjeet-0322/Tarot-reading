"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Send } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "1. Choose Your Reading",
    description: "Select the spread or reading type that resonates with your current situation.",
  },
  {
    icon: Send,
    title: "2. Ask Your Question",
    description: "Share your thoughts, feelings, and the specific guidance you're seeking.",
  },
  {
    icon: Sparkles,
    title: "3. Receive Your Insight",
    description: "Get a detailed, personalized tarot reading delivered straight to you.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 bg-gradient-to-b from-transparent to-[#151233]/80 relative">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            A simple journey to find the clarity you seek.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#7B2FF7]/30 to-transparent -translate-y-1/2" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative glass-card p-8 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-[#1A1642] border border-[#7B2FF7]/40 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(123,47,247,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] group-hover:border-[#D4AF37]/50 transition-all duration-300">
                  <Icon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-serif tracking-wide">{step.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
