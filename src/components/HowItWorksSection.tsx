"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const SpiderWeb = ({ className }: { className?: string }) => (
  <svg className={cn("absolute pointer-events-none", className)} viewBox="0 0 100 100">
    <path d="M0,0 L100,0 M0,0 L80,50 M0,0 L50,80 M0,0 L0,100" stroke="currentColor" strokeWidth="0.5" />
    <path d="M20,0 Q20,10 16,10 Q10,16 0,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M40,0 Q40,20 32,20 Q20,32 0,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M60,0 Q60,30 48,30 Q30,48 0,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M80,0 Q80,40 64,40 Q40,64 0,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const Spider = ({ className }: { className?: string }) => (
  <svg className={cn("drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]", className)} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="14" r="4" />
    <circle cx="12" cy="8" r="2" />
    <path d="M10,14 C6,12 2,16 2,16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M10,13 C5,10 1,12 1,12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M11,11 C7,8 3,8 3,8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12,10 C10,5 6,5 6,5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M14,14 C18,12 22,16 22,16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M14,13 C19,10 23,12 23,12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M13,11 C17,8 21,8 21,8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12,10 C14,5 18,5 18,5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

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
    <section id="how-it-works" className="py-20 relative bg-transparent overflow-hidden">
      
      {/* Creepy corner webs */}
      <SpiderWeb className="w-64 h-64 top-0 left-0 -translate-x-1/4 -translate-y-1/4 text-white/5" />
      <SpiderWeb className="w-80 h-80 bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-white/5 rotate-180" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-gray-300 mb-4 tracking-wider"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto italic"
          >
            A simple journey into the shadows to find the clarity you seek.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative max-w-5xl mx-auto pt-10 pb-20">
          
          {/* Desktop Web Line */}
          <svg className="hidden md:block absolute top-[4rem] left-[16.66%] w-[66.66%] h-32 z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="6,6" />
          </svg>
          
          {/* Mobile Web Line */}
          <svg className="block md:hidden absolute top-[4rem] bottom-[4rem] left-[35%] w-[30%] h-[calc(100%-8rem)] z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M 0,0 L 100,50 L 0,100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="6,6" />
          </svg>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCenter = index === 1;
            const mobileZigzag = index === 1 ? 'ml-[30%]' : 'mr-[30%]';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={cn(
                  "relative z-10 flex flex-col items-center text-center group transition-transform duration-300",
                  isCenter ? "md:translate-y-32" : "",
                  mobileZigzag,
                  "md:ml-0 md:mr-0"
                )}
              >
                <div className="w-16 h-16 rounded-full bg-[#0D0B1E] border border-gray-700 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-gray-400 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 relative overflow-hidden">
                  <SpiderWeb className="w-16 h-16 opacity-30 text-white/40" />
                  <Icon className="w-7 h-7 text-gray-400 relative z-20 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-300 mb-3 font-serif tracking-wide">{step.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed text-sm max-w-[250px]">{step.description}</p>
                
                {/* Hanging spider on the first and last step (mobile) or center step (desktop) */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 3 + index, ease: "easeInOut" }}
                  className={cn(
                    "absolute flex flex-col items-center pointer-events-none",
                    isCenter ? "-top-12 md:-top-16 left-1/2 -translate-x-1/2" : "hidden md:hidden" 
                  )}
                >
                  <div className="w-[1px] h-10 md:h-14 bg-white/20" />
                  <Spider className="w-5 h-5 -mt-1 text-gray-400" />
                </motion.div>

                {/* Additional spiders to add creepiness */}
                {!isCenter && (
                  <motion.div 
                    animate={{ y: [0, 5, 0], x: [0, 2, 0] }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: index }}
                    className="absolute -bottom-8 right-4 flex flex-col items-center pointer-events-none opacity-50"
                  >
                    <div className="w-[1px] h-6 bg-white/10" />
                    <Spider className="w-4 h-4 -mt-1 text-gray-500" />
                  </motion.div>
                )}

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
