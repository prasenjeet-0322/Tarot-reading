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

      {/* Top Banner Area with rich witchy berry-pink gradient */}
      <div className="relative bg-gradient-to-b from-[#500724] via-[#70123D] to-[#831843] border-b border-pink-500/20 shadow-lg">
        {/* Subtle decorative stars in banner */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-pink-500/15 via-transparent to-transparent pointer-events-none" />
        
        <ProfileHeader />

        {/* Bottom smooth curve / fade into baby pink background */}
        <div className="h-6 w-full bg-gradient-to-b from-transparent to-[#FDF2F8]/60 pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 pb-20 relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-pink-200/80 shadow-[0_10px_35px_rgba(244,114,182,0.18)]">
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

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-pink-900/60 flex flex-col items-center gap-3">
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

          <p className="flex items-center gap-1 font-light">
            <span>🎃 SoftTarotGirl • Crafted with cosmic energy & intuition</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
