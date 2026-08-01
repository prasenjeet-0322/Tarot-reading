"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";

const TarotCard = ({ title, delay, backTitle, backDesc, defaultZIndex }: { title: string; delay: number; backTitle: string; backDesc: string; defaultZIndex: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateY: 90 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      className="relative w-48 h-80 perspective-[1000px] cursor-pointer group"
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
          className="absolute inset-0 rounded-xl overflow-hidden glass-card flex flex-col items-center justify-center shadow-[0_4px_30px_rgba(123,47,247,0.3)] border border-[#7B2FF7]/40"
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
          className="absolute inset-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#1A1642] to-[#0D0B1E] flex flex-col items-center justify-center shadow-lg border border-[#D4AF37]/50 p-5 text-center"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-lg pointer-events-none" />
          <Sparkles className="w-8 h-8 text-[#7B2FF7] mb-4" />
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

  const headingText1 = "Unlock the Secrets".split(" ");
  const headingText2 = "Written in the Stars".split(" ");

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Background Nebula/Gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5816C7]/20 via-[#0D0B1E]/60 to-transparent pointer-events-none" />
      
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
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto mt-12 sm:mt-20 gap-8 sm:gap-16 w-full">
        {/* Left Side: Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-0">
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-[#F5F0E6] to-[#E8CC6F]/80 mb-6 drop-shadow-lg leading-tight flex flex-col items-center lg:items-start"
          >
            <div>
            {headingText1.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-2 md:mr-3">
                {word}
              </motion.span>
            ))}
            </div>
            <div className="mt-2 text-center lg:text-left">
              {headingText2.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="inline-block italic text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] mr-2 md:mr-3">
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
        <div className="flex-1 w-full relative h-[250px] sm:h-[450px] perspective-[1000px] z-20 mt-24 sm:mt-12 lg:mt-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 sm:-rotate-12 -ml-[110px] sm:-ml-24 lg:-ml-32 scale-[0.55] sm:scale-100 transition-transform duration-300">
             <TarotCard 
                defaultZIndex={0}
                title="The Past" 
                delay={1.0} 
                backTitle="The Moon"
                backDesc="Hidden influences and lessons learned from the shadows of your past."
              />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl scale-[0.55] sm:scale-110 transition-transform duration-300">
            <TarotCard 
              defaultZIndex={10}
              title="The Present" 
              delay={1.1} 
              backTitle="The Magician"
              backDesc="You hold all the tools required to manifest your current desires."
            />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 sm:rotate-12 ml-[110px] sm:ml-24 lg:ml-32 scale-[0.55] sm:scale-100 transition-transform duration-300">
            <TarotCard 
              defaultZIndex={0}
              title="The Future" 
              delay={1.2} 
              backTitle="The Sun"
              backDesc="Joy, success, and brilliant outcomes await on your horizon."
            />
          </div>
        </div>
      </div>
      
      {/* Bottom fade for transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0B1E] to-transparent pointer-events-none z-30" />
    </section>
  );
}
