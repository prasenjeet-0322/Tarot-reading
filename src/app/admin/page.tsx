import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";
import { supabaseAdmin } from "@/lib/supabase";
import { logoutAdmin } from "./actions";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Calendar,
  Phone,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { HalloweenDecorations } from "@/components/HalloweenDecorations";

import { getAllBookings } from "@/lib/bookingStore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Fetch bookings reliably from local store and Supabase
  const { data: bookings, error: bookingsError } = await getAllBookings();

  const totalBookings = bookings?.length || 0;
  const voiceCallBookings =
    bookings?.filter((b) => b.plan?.toLowerCase().includes("voice") || b.plan?.toLowerCase().includes("min") || b.plan?.toLowerCase().includes("hour")).length || 0;
  const cardPullBookings =
    bookings?.filter((b) => b.plan?.toLowerCase().includes("card")).length || 0;

  return (
    <div className="min-h-screen bg-[#FDF2F8] text-gray-800 font-sans relative selection:bg-pink-300 selection:text-pink-900 pb-20">
      <HalloweenDecorations />

      {/* Top Banner Header */}
      <header className="relative bg-gradient-to-b from-[#500724] via-[#70123D] to-[#831843] text-white border-b border-pink-500/20 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300 shadow-md shrink-0">
              <Image
                src="/logo.jpeg"
                alt="SoftTarotGirl Avatar"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                  Superadmin Dashboard
                </h1>
                <span className="text-xl">🎃</span>
              </div>
              <p className="text-xs text-pink-200/80 font-light mt-0.5">
                Manage your tarot client bookings, WhatsApp chats, and schedule.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-pink-900/60 hover:bg-pink-900 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🔮
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Total Bookings</span>
              <span className="text-2xl font-bold text-gray-900">{totalBookings}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
              📞
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Voice Calls</span>
              <span className="text-2xl font-bold text-emerald-700">{voiceCallBookings}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🃏
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Card Pulls</span>
              <span className="text-2xl font-bold text-amber-700">{cardPullBookings}</span>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200/90 shadow-[0_10px_35px_rgba(244,114,182,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                Booking Requests
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Client submissions with requested slot times, contact details, and questions.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Database Connected
            </span>
          </div>

          {bookingsError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              <p className="font-bold mb-1">Error loading bookings:</p>
              <p>{bookingsError.message}</p>
              <span className="text-xs opacity-80 mt-2 block">
                Ensure Supabase credentials and `bookings` table exist.
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-pink-50/70 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 whitespace-nowrap">Submitted At</th>
                    <th className="p-4 whitespace-nowrap">Client Name</th>
                    <th className="p-4 whitespace-nowrap">WhatsApp Contact</th>
                    <th className="p-4 whitespace-nowrap">Plan & Slot</th>
                    <th className="p-4 min-w-[280px]">Question & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking) => {
                      const cleanPhone = booking.email?.replace(/[^0-9]/g, "");
                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-pink-50/40 transition-colors"
                        >
                          {/* Date Column */}
                          <td className="p-4 text-gray-600 whitespace-nowrap text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-gray-800">
                              <Calendar className="w-3.5 h-3.5 text-pink-500" />
                              {new Date(booking.created_at).toLocaleDateString()}
                            </div>
                            <span className="text-[11px] text-gray-400 pl-5">
                              {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Client Name */}
                          <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                            {booking.name}
                          </td>

                          {/* Phone / WhatsApp Action */}
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700 text-xs flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {booking.email}
                              </span>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(booking.name)}!%20This%20is%20Nidhi%20from%20SoftTarotGirl%20regarding%20your%20Tarot%20Reading%20session.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold shadow-sm transition-all"
                                  title="Open WhatsApp chat"
                                >
                                  <FaWhatsapp className="w-3.5 h-3.5" />
                                  <span>Chat</span>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Plan Badge */}
                          <td className="p-4 whitespace-nowrap">
                            <span className="inline-block px-3 py-1 bg-pink-100/70 border border-pink-300 rounded-full text-xs font-semibold text-pink-800 shadow-sm">
                              {booking.plan}
                            </span>
                          </td>

                          {/* Question / Notes */}
                          <td className="p-4 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                            {booking.question}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                        <span className="text-3xl block mb-2">🔮</span>
                        No bookings yet. When clients submit on the website, they will appear here in real-time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
