"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StarBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(200)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            opacity: Math.random() * 0.5 + 0.3,
            scale: Math.random() * 0.8 + 0.5,
          }}
          animate={{
            y: [0, Math.random() * -200 - 50],
            opacity: [null, 1, 0],
            boxShadow: ["0 0 0px #fff", "0 0 10px #D4AF37", "0 0 0px #fff"],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
