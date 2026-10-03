"use client";

import { motion } from "framer-motion";

export function HalloweenDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Left Spider Web */}
      <svg
        className="absolute -top-4 -left-4 w-44 h-44 text-pink-400/35 opacity-70"
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
        animate={{ y: [0, 22, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-12 left-16 flex flex-col items-center"
      >
        <div className="w-[1px] h-12 bg-pink-400/40" />
        <span className="text-sm select-none">🕷️</span>
      </motion.div>

      {/* Top Right Spider Web */}
      <svg
        className="absolute -top-4 -right-4 w-48 h-48 text-pink-400/35 opacity-70 rotate-90"
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

      {/* Floating Witchy Crescent Moon in corner */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-28 right-8 text-2xl opacity-40 select-none drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]"
      >
        🌙
      </motion.div>

      {/* Hanging Crystal Pendulum Diviner on Right */}
      <motion.div
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
        className="absolute top-0 right-32 flex flex-col items-center opacity-40"
      >
        <div className="w-[1px] h-20 bg-pink-400/60" />
        <span className="text-base select-none -mt-1 drop-shadow-[0_0_8px_rgba(219,39,119,0.5)]">🔮</span>
      </motion.div>

      {/* Floating Halloween Witch Bats */}
      <motion.div
        initial={{ x: "-10%", y: "15%" }}
        animate={{ x: "110%", y: "8%" }}
        transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
        className="absolute text-xl opacity-25 select-none"
      >
        🦇
      </motion.div>
      <motion.div
        initial={{ x: "110%", y: "42%" }}
        animate={{ x: "-10%", y: "52%" }}
        transition={{ repeat: Infinity, duration: 34, ease: "linear", delay: 9 }}
        className="absolute text-base opacity-20 select-none"
      >
        🦇
      </motion.div>

      {/* Floating Witch Hat / Broom */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 10, 0], rotate: [0, 8, -4, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-1/2 left-6 text-2xl opacity-35 select-none drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
      >
        🧹
      </motion.div>

      {/* Floating Pumpkin Lantern */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute bottom-16 right-10 text-2xl opacity-45 select-none drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]"
      >
        🎃
      </motion.div>

      {/* Floating Friendly Spirit / Ghost */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-24 left-8 text-2xl opacity-30 select-none"
      >
        👻
      </motion.div>

      {/* Witchy Potion Orbs & Celestial Sparkles */}
      <motion.div
        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.3, 0.8], y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_14px_#f472b6]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.95, 0.3], scale: [0.9, 1.4, 0.9], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.7, 1.2, 0.7], y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 2.2 }}
        className="absolute top-3/4 right-1/6 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_16px_#c084fc]"
      />
    </div>
  );
}
