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
      {/* Main Title Row matching user's requested header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-pink-100">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl select-none">🔮</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Tarot Reading Price List
            </h2>
            <p className="text-xs text-pink-700/80 font-medium">
              Choose your reading format & connect directly with Nidhi
            </p>
          </div>
        </div>

        {/* Halloween Vibe Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold shadow-sm">
          <span>🎃</span>
          <span>Spooky Season Guidance</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 ml-0.5" />
        </div>
      </div>

      {/* SECTION 1: Voice Call Readings */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg select-none">📞</span>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Voice Call Readings
          </h3>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full ml-auto sm:ml-2">
            Live 1-on-1 Call
          </span>
        </div>

        {/* Grid of Voice Call Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {voiceSessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(244, 114, 182, 0.25)" }}
              className="group relative bg-white rounded-2xl p-5 border border-pink-100 hover:border-pink-300 shadow-sm flex flex-col justify-between transition-all cursor-pointer"
              onClick={() => onSelectSession(session)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {session.icon}
                  </div>

                  {/* Badges */}
                  {session.badge?.type === "popular" && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      <span className="text-amber-500">↗</span>
                      {session.badge.text}
                    </span>
                  )}

                  {session.badge?.type === "rating" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {session.badge.text}
                    </span>
                  )}

                  {session.badge?.type === "halloween" && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      {session.badge.text}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-pink-700 transition-colors">
                  {session.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light mb-5">
                  {session.description}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                    {session.duration}
                  </span>
                  <span className="text-[11px] text-gray-400 font-light flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    {session.contactType}
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-pink-300/50 hover:brightness-105 active:scale-95 transition-all"
                >
                  <span>{session.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Card Readings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg select-none">🃏</span>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Card Readings
          </h3>
          <span className="text-xs font-medium text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full ml-auto sm:ml-2">
            WhatsApp Audio + Photos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cardSessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(244, 114, 182, 0.25)" }}
              className="group relative bg-white rounded-2xl p-5 border border-pink-100 hover:border-pink-300 shadow-sm flex flex-col justify-between transition-all cursor-pointer md:col-span-2"
              onClick={() => onSelectSession(session)}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-pink-50 border border-pink-200 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                    {session.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                        {session.title}
                      </h4>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        {session.badge?.text}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                      {session.description}
                    </p>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-pink-700">₹35</span>
                    <span className="text-xs text-gray-500 font-medium block">/ Tarot Card</span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-bold text-sm shadow-md hover:shadow-pink-300/50 hover:brightness-105 active:scale-95 transition-all"
                  >
                    <span>Book Pull</span>
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
