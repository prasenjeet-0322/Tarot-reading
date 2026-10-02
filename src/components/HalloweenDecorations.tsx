"use client";

import { motion } from "framer-motion";

export function HalloweenDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Left Spider Web */}
      <svg
        className="absolute -top-4 -left-4 w-40 h-40 text-pink-300/40 opacity-70"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <path d="M0,0 L100,0 M0,0 L90,40 M0,0 L65,75 M0,0 L35,90 M0,0 L0,100" />
        <path d="M20,0 Q18,12 0,20" />
        <path d="M40,0 Q36,24 0,40" />
        <path d="M60,0 Q54,36 0,60" />
        <path d="M80,0 Q72,48 0,80" />
        <path d="M100,0 Q90,60 0,100" />
      </svg>

      {/* Hanging Spider from Web */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-12 left-16 flex flex-col items-center"
      >
        <div className="w-[1px] h-12 bg-pink-400/40" />
        <span className="text-sm select-none">🕷️</span>
      </motion.div>

      {/* Top Right Spider Web */}
      <svg
        className="absolute -top-4 -right-4 w-44 h-44 text-pink-300/40 opacity-70 rotate-90"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <path d="M0,0 L100,0 M0,0 L90,40 M0,0 L65,75 M0,0 L35,90 M0,0 L0,100" />
        <path d="M20,0 Q18,12 0,20" />
        <path d="M40,0 Q36,24 0,40" />
        <path d="M60,0 Q54,36 0,60" />
        <path d="M80,0 Q72,48 0,80" />
        <path d="M100,0 Q90,60 0,100" />
      </svg>

      {/* Floating Halloween Bats */}
      <motion.div
        initial={{ x: "-10%", y: "15%" }}
        animate={{ x: "110%", y: "8%" }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        className="absolute text-xl opacity-25 select-none"
      >
        🦇
      </motion.div>
      <motion.div
        initial={{ x: "110%", y: "45%" }}
        animate={{ x: "-10%", y: "55%" }}
        transition={{ repeat: Infinity, duration: 32, ease: "linear", delay: 8 }}
        className="absolute text-base opacity-20 select-none"
      >
        🦇
      </motion.div>

      {/* Floating Gentle Ghost */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-20 left-8 text-2xl opacity-30 select-none"
      >
        👻
      </motion.div>

      {/* Floating Mini Pumpkin */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute bottom-16 right-10 text-2xl opacity-40 select-none"
      >
        🎃
      </motion.div>

      {/* Witchy Green Potion Sparkles */}
      <motion.div
        animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]"
      />
    </div>
  );
}
