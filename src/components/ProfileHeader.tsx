"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { Sparkles } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="relative pt-10 pb-8 px-6 text-white max-w-5xl mx-auto w-full">
      {/* Top right Witchy / Halloween badge */}
      <div className="absolute top-4 right-6 hidden sm:flex items-center gap-2 text-xs font-medium text-pink-200/90 bg-pink-950/60 px-3.5 py-1.5 rounded-full border border-pink-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.2)]">
        <span className="text-amber-300">🌙</span>
        <span className="font-serif italic text-pink-200">The Velvet Grimoire</span>
        <span className="text-pink-400">✦</span>
        <span className="text-emerald-400 font-bold">🔮</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Profile Avatar with Witchy Celestial Orbit */}
        <div className="relative shrink-0 group">
          {/* Subtle Witchy Spinning Aura Ring */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-emerald-400 opacity-60 blur-md group-hover:opacity-90 animate-pulse transition duration-1000" />
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-pink-200/90 shadow-[0_0_30px_rgba(244,114,182,0.5)]">
            <Image
              src="/logo.jpeg"
              alt="SoftTarotGirl Avatar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Witch Hat / Crystal Ball Accent on Avatar */}
          <div className="absolute -bottom-1 -right-1 bg-[#2A081B] text-white p-1.5 rounded-full shadow-lg text-sm select-none border border-pink-400/50 flex items-center justify-center">
            🔮
          </div>

          {/* Mini Crescent Moon Accent */}
          <div className="absolute -top-1 -left-1 bg-[#2A081B] text-amber-200 p-1 rounded-full shadow-md text-xs select-none border border-amber-300/40">
            🌙
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 max-w-2xl">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
              <span>SoftTarotGirl</span>
              <Sparkles className="w-5 h-5 text-pink-300 fill-pink-300 animate-pulse" />
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Circle is Open • Live Divination
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-pink-200/95 text-sm font-medium mb-3">
            <span className="font-serif italic tracking-wide text-pink-100">
              Intuitive Witchy Tarot Diviner & Energy Alchemist
            </span>
            <span className="text-pink-400 text-xs">✦</span>
            <span className="text-xs text-amber-200/90 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/20">
              ☾ Moon Channeled
            </span>
          </div>

          <p className="text-pink-100/85 text-xs sm:text-sm leading-relaxed mb-4 font-light">
            Guiding your spirit through the ancient mystic veil of Tarot. Uncovering secrets, aligning your cosmic energy, and channeling direct answers from the universe to attract your sacred reality. 🕯️🔮✨
          </p>

          {/* Social Links & Witchy Tags */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/softarotgirl?stkn=MWVmOHMwb3lqMWkwaQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(238,42,123,0.6)] transition-all"
            >
              <FaInstagram className="w-5 h-5" />
            </a>

            {/* Witchy Occult Badges */}
            <span className="text-xs text-pink-200 bg-pink-950/70 border border-pink-400/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span>🧹</span>
              <span className="font-medium">Witchcraft & Divination</span>
            </span>

            <span className="text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span>🎃</span>
              <span>Spooky Season Magic</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
