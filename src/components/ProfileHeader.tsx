"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { Sparkles } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="relative pt-10 pb-8 px-6 text-white max-w-5xl mx-auto w-full">
      {/* Top right Halloween badge */}
      <div className="absolute top-4 right-6 hidden sm:flex items-center gap-1.5 text-xs font-medium text-pink-200/80 bg-pink-900/40 px-3 py-1.5 rounded-full border border-pink-500/20 backdrop-blur-sm">
        <span>Built with</span>
        <span className="text-pink-400">🖤</span>
        <span>on SoftTarot</span>
        <span className="text-emerald-400 font-bold ml-1">🎃</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Profile Avatar with Halloween Witch Theme */}
        <div className="relative shrink-0 group">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-pink-300 shadow-[0_0_25px_rgba(244,114,182,0.4)]">
            <Image
              src="/logo.jpeg"
              alt="SoftTarotGirl Avatar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          {/* Mini Pumpkin Badge on Avatar */}
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md text-base select-none border border-emerald-300">
            🎃
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 max-w-2xl">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
              SoftTarotGirl
              <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400 animate-pulse" />
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Online for Sessions
            </span>
          </div>

          <p className="text-pink-200/90 text-sm font-medium mb-3">
            Nidhi Shah • Intuitive Tarot Reader & Energy Alchemist
          </p>

          <p className="text-pink-100/80 text-sm leading-relaxed mb-4 font-light">
            Upgrading you in the journey of life through Tarot Sessions and spiritual practices, 
            law of attraction, and intuitive guidance programs curated specially for you to attract your desired reality. 🔮✨
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center sm:justify-start gap-3">

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/softarotgirl?stkn=MWVmOHMwb3lqMWkwaQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[0_0_15px_rgba(238,42,123,0.5)] transition-all"
            >
              <FaInstagram className="w-5 h-5" />
            </a>

            {/* Witchy Halloween tag */}
            <span className="text-xs text-emerald-300/90 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 ml-1">
              <span>🕷️</span>
              <span>Halloween Specials Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
