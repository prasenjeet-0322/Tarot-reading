import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";
import { logoutAdmin } from "./actions";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { HalloweenDecorations } from "@/components/HalloweenDecorations";
import { getAllBookings } from "@/lib/bookingStore";
import { AdminBookingsTable } from "./AdminBookingsTable";

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
  const pendingBookings =
    bookings?.filter((b) => (b.status || "pending") === "pending").length || 0;
  const completedBookings =
    bookings?.filter((b) => b.status === "completed").length || 0;

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
                className="px-4 py-2 rounded-full bg-pink-900/60 hover:bg-pink-900 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
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
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Pending Requests</span>
              <span className="text-2xl font-bold text-amber-700">{pendingBookings}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Completed Sessions</span>
              <span className="text-2xl font-bold text-emerald-700">{completedBookings}</span>
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
                Client submissions with requested slot times, contact details, status, and management controls.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Database Connected
            </span>
          </div>

          {bookingsError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              <p className="font-bold mb-1">Notice loading bookings:</p>
              <p>{bookingsError}</p>
            </div>
          ) : (
            <AdminBookingsTable initialBookings={bookings || []} />
          )}
        </div>
      </main>
    </div>
  );
}
