"use client";

import { motion } from "framer-motion";
import { TAROT_SESSIONS, TarotSession } from "@/data/sessions";
import { ArrowRight, Clock, Phone, Sparkles } from "lucide-react";

interface SessionsViewProps {
  onSelectSession: (session: TarotSession) => void;
}

export function SessionsView({ onSelectSession }: SessionsViewProps) {
  const voiceSessions = TAROT_SESSIONS.filter((s) => s.category === "voice");
  const cardSessions = TAROT_SESSIONS.filter((s) => s.category === "card");

  return (
    <div className="w-full">
      {/* Main Title Row */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-pink-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center text-xl shadow-inner border border-pink-300/60 shrink-0">
          🔮
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Tarot Divination Offerings
          </h2>
          <p className="text-xs text-pink-700/85 font-medium mt-0.5">
            Choose your reading format & step into the sacred circle
          </p>
        </div>
      </div>

      {/* SECTION 1: Voice Call Readings */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl select-none">🕯️</span>
          <h3 className="text-base sm:text-lg font-serif font-bold text-gray-800">
            Live Voice Divinations
          </h3>
        </div>

        {/* Grid of Voice Call Sessions styled as Witchy Tarot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {voiceSessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -4, boxShadow: "0 14px 30px -6px rgba(219, 39, 119, 0.22)" }}
              className="group relative bg-white/95 rounded-2xl p-5 sm:p-6 border border-pink-200/80 hover:border-pink-400 shadow-sm flex flex-col justify-between transition-all cursor-pointer overflow-hidden"
              onClick={() => onSelectSession(session)}
            >
              {/* Witchy Celestial Corner Filigree */}
              <div className="absolute top-2 left-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">
                ✦
              </div>
              <div className="absolute top-2 right-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">
                ✦
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">
                ✦
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">
                ✦
              </div>

              {/* Watermark Occult Moon Glyph */}
              <div className="absolute -bottom-8 -right-8 w-28 h-28 pointer-events-none opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-500 text-pink-900">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 0 C65 20 65 80 50 100 C80 85 95 55 85 20 C75 5 60 0 50 0 Z" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-100 via-rose-50 to-purple-100 border border-pink-200/90 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform group-hover:border-pink-400">
                    {session.icon}
                  </div>

                  {/* Badges styled as witchy seals */}
                  {session.badge?.type === "popular" && (
                    <span className="inline-flex items-center gap-1 bg-amber-50/90 text-amber-800 border border-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>✨</span>
                      {session.badge.text}
                    </span>
                  )}

                  {session.badge?.type === "rating" && (
                    <span className="inline-flex items-center gap-1 bg-purple-50/90 text-purple-800 border border-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🔮</span>
                      {session.badge.text}
                    </span>
                  )}

                  {session.badge?.type === "halloween" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50/90 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🎃</span>
                      {session.badge.text}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-serif font-bold text-gray-900 mb-2 leading-snug group-hover:text-pink-700 transition-colors flex items-center justify-between">
                  <span>{session.title}</span>
                </h4>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light mb-5">
                  {session.description}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="pt-3.5 border-t border-pink-100/70 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                    {session.duration}
                  </span>
                  <span className="text-[11px] text-pink-700/80 font-medium flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {session.contactType}
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-purple-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-pink-300/60 hover:brightness-110 active:scale-95 transition-all"
                >
                  <span className="tracking-wide">{session.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Witchy Decorative Constellation Divider */}
      <div className="flex items-center justify-center gap-3 my-8 text-pink-300/80 select-none">
        <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-pink-300/60" />
        <span className="text-xs tracking-widest font-serif text-pink-400">✧ ─── ☾ ✦ ☽ ─── ✧</span>
        <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-pink-300/60" />
      </div>

      {/* SECTION 2: Card Readings */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl select-none">🃏</span>
          <h3 className="text-base sm:text-lg font-serif font-bold text-gray-800">
            Sacred Arcana Pulls
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cardSessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -4, boxShadow: "0 14px 30px -6px rgba(219, 39, 119, 0.22)" }}
              className="group relative bg-white/95 rounded-2xl p-5 sm:p-6 border border-pink-200/80 hover:border-pink-400 shadow-sm flex flex-col justify-between transition-all cursor-pointer md:col-span-2 overflow-hidden"
              onClick={() => onSelectSession(session)}
            >
              {/* Corner Filigree */}
              <div className="absolute top-2 left-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">✦</div>
              <div className="absolute top-2 right-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">✦</div>
              <div className="absolute bottom-2 left-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">✦</div>
              <div className="absolute bottom-2 right-2 text-[10px] text-pink-300/70 select-none group-hover:text-pink-500 transition-colors">✦</div>

              {/* Watermark Occult Card */}
              <div className="absolute -top-10 -right-6 w-36 h-36 pointer-events-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 text-pink-900">
                <svg viewBox="0 0 100 140" fill="currentColor">
                  <rect x="10" y="10" width="80" height="120" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="50" cy="70" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <polygon points="50,50 55,65 70,70 55,75 50,90 45,75 30,70 45,65" fill="currentColor" />
                </svg>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-100 via-purple-50 to-rose-100 border border-pink-300 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                    {session.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                        {session.title}
                      </h4>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {session.badge?.text}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light max-w-xl">
                      {session.description}
                    </p>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm text-gray-500 font-medium block">/ Tarot Card</span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-purple-800 text-white font-bold text-sm shadow-md hover:shadow-pink-300/60 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span className="tracking-wide">{session.price}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
