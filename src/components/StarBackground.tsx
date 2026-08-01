"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StarBackground() {
  const [stars, setStars] = useState<Array<{
    id: number;
    left: string;
    top: string;
    opacity: number;
    scale: number;
    yAnim: number[];
    duration: number;
  }>>([]);

  useEffect(() => {
    const newStars = [...Array(200)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      scale: Math.random() * 0.8 + 0.5,
      yAnim: [0, Math.random() * -200 - 50],
      duration: Math.random() * 15 + 10,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(newStars);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: star.left,
            top: star.top,
          }}
          initial={{
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
  );
}
