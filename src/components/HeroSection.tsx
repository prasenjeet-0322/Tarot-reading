/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";

const SpiderWeb = ({ className }: { className?: string }) => (
  <svg className={`absolute pointer-events-none ${className || ''}`} viewBox="0 0 100 100">
    <path d="M0,0 L100,0 M0,0 L80,50 M0,0 L50,80 M0,0 L0,100" stroke="currentColor" strokeWidth="0.5" />
    <path d="M20,0 Q20,10 16,10 Q10,16 0,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M40,0 Q40,20 32,20 Q20,32 0,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M60,0 Q60,30 48,30 Q30,48 0,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M80,0 Q80,40 64,40 Q40,64 0,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

const Spider = ({ className }: { className?: string }) => (
  <svg className={`drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${className || ''}`} viewBox="0 0 24 24" fill="currentColor">
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

const TarotCard = ({ title, delay, backTitle, backDesc, defaultZIndex }: { title: string; delay: number; backTitle: string; backDesc: string; defaultZIndex: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateY: 90 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      className="relative w-32 sm:w-40 h-52 sm:h-64 perspective-[1000px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ zIndex: isFlipped ? 50 : defaultZIndex }}
    >
      <motion.div
        className="w-full h-full relative transition-transform duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden glass-card flex flex-col items-center justify-center shadow-[0_4px_30px_rgba(217,70,239,0.25)] border border-[#F472B6]/40"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-2 border border-[#D4AF37]/40 rounded-lg pointer-events-none" />
          <div className="absolute inset-4 border border-[#D4AF37]/20 rounded-lg flex flex-col items-center justify-center p-4 text-center pointer-events-none">
            <Star className="w-8 h-8 text-[#D4AF37] mb-4 opacity-70 group-hover:scale-110 transition-transform duration-500" />
            <span className="font-serif text-lg text-white font-semibold tracking-wider">{title}</span>
            <span className="text-[10px] text-gray-400 mt-6 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Click to reveal</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#380E31] to-[#1F071B] flex flex-col items-center justify-center shadow-lg border border-[#D4AF37]/50 p-5 text-center"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-lg pointer-events-none" />
          <Sparkles className="w-8 h-8 text-[#F472B6] mb-4" />
          <h4 className="font-serif text-xl text-[#E8CC6F] font-semibold mb-3">{backTitle}</h4>
          <p className="text-sm text-gray-300 leading-relaxed font-light">{backDesc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [heroStars, setHeroStars] = useState<Array<{
    id: number;
    x: number;
    y: number;
    opacity: number;
    scale: number;
    yAnim: (number | null)[];
    duration: number;
  }>>([]);
  const { openBooking } = useBooking();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const newStars = [...Array(40)].map((_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      opacity: Math.random() * 0.5 + 0.2,
      scale: Math.random() * 0.5 + 0.5,
      yAnim: [null, Math.random() * -100 - 50],
      duration: Math.random() * 10 + 10,
    }));
    setHeroStars(newStars);
  }, []);

  const headingText1 = "Reveal the Secrets".split(" ");
  const headingText2 = "Hidden in the Cards".split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent pt-24 sm:pt-0">
      {/* Background Nebula/Gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#9D174D]/25 via-[#1F071B]/60 to-transparent pointer-events-none" />
      
      {/* Local Hero Stars for density */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroStars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: star.x,
                y: star.y,
                opacity: star.opacity,
                scale: star.scale,
              }}
              animate={{
                y: star.yAnim,
                opacity: [null, 1, 0],
                boxShadow: ["0 0 0px #fff", "0 0 10px #D4AF37", "0 0 0px #fff"],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto mt-4 sm:mt-8 gap-4 lg:gap-8 w-full">
        {/* Left Side: Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-0 w-full">
          <motion.h1 
            variants={containerVariants as any}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F5F0E6] to-[#E8CC6F]/80 mb-6 drop-shadow-lg leading-tight flex flex-col items-center lg:items-start w-full"
          >
            <div className="flex flex-wrap justify-center lg:justify-start">
            {headingText1.map((word, i) => (
              <motion.span key={i} variants={wordVariants as any} className="inline-block mr-3 md:mr-4">
                {word}
              </motion.span>
            ))}
            </div>
            <div className="mt-2 flex flex-wrap justify-center lg:justify-start">
              {headingText2.map((word, i) => (
                <motion.span key={i} variants={wordVariants as any} className="inline-block text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] mr-3 md:mr-4">
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-12 font-light"
          >
            Gain clarity, find peace, and illuminate your journey ahead with a personalized mystical tarot reading.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openBooking()}
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#A68625] text-[#0D0B1E] font-semibold text-base rounded-full relative overflow-hidden group border border-[#F5F0E6]/50 cursor-pointer"
          >
            <span className="relative z-10">Get Your Reading</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <motion.div 
              animate={{ left: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0" 
            />
          </motion.button>
        </div>

        {/* Right Side: Floating Cards */}
        <div className="flex-1 w-full relative z-20 mt-0 flex justify-center items-center">
          
          {/* Creepy Web Background */}
          <SpiderWeb className="w-72 h-72 absolute -top-10 -right-10 text-white/5 opacity-40 rotate-90 pointer-events-none" />
          <SpiderWeb className="w-96 h-96 absolute -bottom-20 -left-10 text-white/5 opacity-30 -rotate-90 pointer-events-none" />

          {/* Cards Container */}
          <div className="flex flex-row items-center justify-start lg:justify-center gap-4 sm:gap-6 w-full overflow-x-auto pb-8 pt-8 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Left Card: Past */}
            <div className="flex-shrink-0 snap-center transition-transform duration-300 hover:-translate-y-4">
              <TarotCard 
                defaultZIndex={10}
                title="Past" 
                delay={0.8} 
                backTitle="The Moon"
                backDesc="Illusions are fading. Trust your intuition."
              />
            </div>

            {/* Center Card: Present */}
            <div className="relative flex-shrink-0 snap-center transition-transform duration-300 hover:-translate-y-4 z-30">
              <TarotCard 
                defaultZIndex={30}
                title="Present" 
                delay={1.0} 
                backTitle="The Magician"
                backDesc="You hold all the tools required to manifest your desires."
              />
              
              {/* Hanging Spider */}
              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                <div className="w-[1px] h-14 bg-white/20" />
                <Spider className="w-5 h-5 -mt-1 text-gray-400" />
              </motion.div>
            </div>

            {/* Right Card: Future */}
            <div className="flex-shrink-0 snap-center transition-transform duration-300 hover:-translate-y-4">
              <TarotCard 
                defaultZIndex={10}
                title="Future" 
                delay={1.2} 
                backTitle="The Star"
                backDesc="Hope and inspiration light your path forward."
              />
            </div>

          </div>
        </div>
      </div>
      
      {/* Bottom fade for transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1F071B] to-transparent pointer-events-none z-30" />
    </section>
  );
}
