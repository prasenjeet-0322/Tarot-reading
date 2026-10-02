"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotSession } from "@/data/sessions";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Phone,
  Send,
  Share2,
  Sparkles,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { submitBooking } from "@/app/actions/booking";

interface BookingDetailViewProps {
  session: TarotSession;
  onBack: () => void;
}

// Generate the next 7 days for the slot selector
function getUpcomingDays() {
  const days = [];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    days.push({
      dayName: dayNames[d.getDay()],
      dateStr: `${String(d.getDate()).padStart(2, "0")} ${monthNames[d.getMonth()]}`,
      fullIso: d.toISOString().split("T")[0],
      // realistic slot counts
      slots: i === 0 ? 4 : i === 1 ? 6 : i === 2 ? 14 : i === 3 ? 20 : 9,
    });
  }
  return days;
}

const TIME_SLOTS = {
  morning: ["10:00 AM", "10:30 AM", "11:15 AM", "11:45 AM"],
  midday: ["01:00 PM", "02:30 PM", "03:45 PM", "04:30 PM"],
  evening: ["06:00 PM", "06:15 PM", "08:45 PM", "09:00 PM"],
};

export function BookingDetailView({ session, onBack }: BookingDetailViewProps) {
  const days = getUpcomingDays();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"morning" | "midday" | "evening">("evening");
  const [selectedTime, setSelectedTime] = useState<string>("06:00 PM");
  const [dateScrollOffset, setDateScrollOffset] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Form State for Checkout/Confirmation
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [question, setQuestion] = useState("");

  const currentSelectedDay = days[selectedDayIndex];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingPlan = `${session.title} - ${currentSelectedDay.dayName} ${currentSelectedDay.dateStr} at ${selectedTime}`;
    const fullNotes = `Instagram: ${instagram || "Not provided"}\nSelected Time: ${currentSelectedDay.dateStr} (${selectedTime})\nQuestion: ${question || "General guidance"}`;

    await submitBooking({
      name,
      phone,
      plan: bookingPlan,
      notes: fullNotes,
    });

    setSubmitting(false);
    setSubmittedSuccess(true);
  };

  return (
    <div className="w-full">
      {/* Top back navigation button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-pink-100/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all sessions</span>
        </button>

        <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
          <span>🎃</span>
          <span>Instant WhatsApp Confirmation</span>
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-md">
        <AnimatePresence mode="wait">
          {!isCheckoutStep ? (
            /* STEP 1: Session Details & Slot Picker (Matches Image 2) */
            <motion.div
              key="slot-selection"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Left Column: Session Info */}
              <div className="lg:col-span-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                    {session.title}
                  </h2>

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-pink-500" />
                      {session.duration}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      {session.contactType}
                    </span>
                  </div>

                  {/* Price & Badges */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-bold text-base shadow-sm">
                      {session.price}
                    </span>

                    {session.badge?.type === "popular" && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <span className="text-amber-500">↗</span>
                        {session.badge.text}
                      </span>
                    )}

                    {session.badge?.type === "rating" && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {session.badge.text}
                      </span>
                    )}
                  </div>

                  {/* Spiritual intuitive message */}
                  <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100/80 mb-6">
                    <p className="text-sm text-gray-700 italic leading-relaxed font-light">
                      &quot;{session.detailedDescription}&quot;
                    </p>
                  </div>
                </div>

                {/* Share Button */}
                <div className="pt-4 mt-auto">
                  <button
                    onClick={handleShare}
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-pink-300 hover:bg-pink-50/40 text-gray-700 text-sm font-medium transition-all"
                  >
                    <Share2 className="w-4 h-4 text-pink-500" />
                    <span>{copiedShare ? "Link copied to clipboard!" : "Share this session"}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Date & Slot Picker */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Date Selector Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      When should we connect?
                    </h3>

                    {/* Pagination Arrows */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDateScrollOffset(Math.max(0, dateScrollOffset - 1))}
                        disabled={dateScrollOffset === 0}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDateScrollOffset(Math.min(2, dateScrollOffset + 1))}
                        disabled={dateScrollOffset >= 2}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Date Carousel Pills */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-2.5 mb-8">
                    {days.slice(dateScrollOffset, dateScrollOffset + 5).map((day, idx) => {
                      const actualIdx = dateScrollOffset + idx;
                      const isSelected = selectedDayIndex === actualIdx;
                      return (
                        <button
                          key={day.fullIso}
                          onClick={() => setSelectedDayIndex(actualIdx)}
                          className={`flex flex-col items-center justify-center py-3 px-1.5 rounded-xl border transition-all text-center ${
                            isSelected
                              ? "border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-sm"
                              : "border-gray-200 hover:border-pink-300 hover:bg-gray-50/70"
                          }`}
                        >
                          <span className={`text-[10px] sm:text-xs font-semibold uppercase ${isSelected ? "text-pink-700" : "text-gray-500"}`}>
                            {day.dayName}
                          </span>
                          <span className={`text-xs sm:text-sm font-bold my-0.5 ${isSelected ? "text-gray-900" : "text-gray-800"}`}>
                            {day.dateStr}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                            {day.slots} slots
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slot Picker Header */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                    Select your preferred time slot
                  </h3>

                  {/* Period Filter Tabs */}
                  <div className="flex items-center rounded-full bg-gray-100 p-1 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPeriod("morning");
                        setSelectedTime(TIME_SLOTS.morning[0]);
                      }}
                      className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                        selectedPeriod === "morning"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <span>🌅</span> Morning
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPeriod("midday");
                        setSelectedTime(TIME_SLOTS.midday[0]);
                      }}
                      className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                        selectedPeriod === "midday"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <span>☀️</span> Midday
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPeriod("evening");
                        setSelectedTime(TIME_SLOTS.evening[0]);
                      }}
                      className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                        selectedPeriod === "evening"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <span>🌙</span> Evening
                    </button>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
                    {TIME_SLOTS[selectedPeriod].map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                            isSelected
                              ? "border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20 shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-gray-50"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Row: Timezone & Confirm Button */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Asia/Calcutta (GMT+5:30)</span>
                  </div>

                  <button
                    onClick={() => setIsCheckoutStep(true)}
                    type="button"
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-bold text-sm shadow-lg hover:shadow-pink-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Confirm details</span>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: Checkout Form & Client Details */
            <motion.div
              key="checkout-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              {submittedSuccess ? (
                /* Success celebration */
                <div className="py-12 px-6 text-center flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-4xl mb-4 shadow-lg animate-bounce">
                    🎃
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
                    Session Request Confirmed!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
                    Thank you, <span className="font-semibold text-pink-700">{name}</span>! Your slot for{" "}
                    <span className="font-semibold text-gray-900">{currentSelectedDay.dateStr} at {selectedTime}</span> has been saved. 
                    Nidhi will reach out to you on WhatsApp shortly. ✨
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium mb-8 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Admin dashboard notified. Prepare your energy & intentions!</span>
                  </div>

                  <button
                    onClick={onBack}
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm transition-all"
                  >
                    Back to Sessions
                  </button>
                </div>
              ) : (
                /* Contact Details Form */
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Final Step: Your Details</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Selected: <span className="text-pink-600 font-semibold">{session.title}</span> on{" "}
                        <span className="text-gray-800 font-semibold">{currentSelectedDay.dateStr}, {selectedTime}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCheckoutStep(false)}
                      type="button"
                      className="text-xs font-semibold text-gray-500 hover:text-pink-600 underline"
                    >
                      Change slot
                    </button>
                  </div>

                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="client-name">
                        Your Full Name *
                      </label>
                      <input
                        id="client-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="client-phone">
                        WhatsApp Phone Number *
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="client-instagram">
                        Instagram Handle *
                      </label>
                      <input
                        id="client-instagram"
                        type="text"
                        required
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="e.g. @priya_tarot"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="client-question">
                        What would you like clarity on? (Optional)
                      </label>
                      <textarea
                        id="client-question"
                        rows={3}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Love, career, general life direction, spiritual blocks..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all resize-none"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setIsCheckoutStep(false)}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-bold text-sm shadow-lg hover:shadow-pink-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? "Booking Your Slot..." : `Confirm & Book (${session.price})`}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
