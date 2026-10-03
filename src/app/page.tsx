"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SessionsView } from "@/components/SessionsView";
import { BookingDetailView } from "@/components/BookingDetailView";
import { HalloweenDecorations } from "@/components/HalloweenDecorations";
import { TarotSession } from "@/data/sessions";
import { FaInstagram } from "react-icons/fa";

export default function Home() {
  const [selectedSession, setSelectedSession] = useState<TarotSession | null>(null);

  return (
    <main className="min-h-screen bg-[#FDF2F8] text-gray-800 relative selection:bg-pink-300 selection:text-pink-900">
      {/* Halloween Ambient Atmosphere */}
      <HalloweenDecorations />

      {/* Top Banner Area with rich velvet witchy dusk gradient */}
      <div className="relative bg-gradient-to-b from-[#1C0413] via-[#3E0A27] to-[#5C0D37] border-b border-pink-500/25 shadow-xl">
        {/* Celestial Starfield / Mystic Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-pink-500/20 via-purple-900/15 to-transparent pointer-events-none" />
        
        {/* Subtle Constellation Sparkles */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f472b6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <ProfileHeader />

        {/* Bottom smooth curve / fade into baby pink background */}
        <div className="h-6 w-full bg-gradient-to-b from-transparent to-[#FDF2F8]/80 pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 pb-20 relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-pink-200/90 shadow-[0_12px_40px_rgba(244,114,182,0.2)] relative">
          {selectedSession ? (
            <BookingDetailView
              session={selectedSession}
              onBack={() => setSelectedSession(null)}
            />
          ) : (
            <SessionsView
              onSelectSession={(session) => setSelectedSession(session)}
            />
          )}
        </div>

        {/* Footer with Witchy occult motto */}
        <footer className="mt-12 text-center text-xs text-pink-900/70 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/softarotgirl?stkn=MWVmOHMwb3lqMWkwaQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:text-pink-800 flex items-center gap-1.5 font-medium transition-colors"
            >
              <FaInstagram className="w-4 h-4 text-pink-600" />
              <span>@softarotgirl</span>
            </a>
          </div>

          <p className="flex items-center gap-1.5 font-light text-pink-900/80">
            <span>🔮</span>
            <span className="font-serif italic">As Above, So Below</span>
            <span>•</span>
            <span>SoftTarotGirl • Sacred Divinations & Intuitive Sanctuary</span>
            <span>✨</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
