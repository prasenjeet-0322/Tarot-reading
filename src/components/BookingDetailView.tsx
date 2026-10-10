"use client";

import { useState, useEffect } from "react";
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
  Lock,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  QrCode,
  CreditCard,
  X,
  AlertCircle,
} from "lucide-react";
import { submitBooking, fetchBookedIntervals } from "@/app/actions/booking";

interface BookingDetailViewProps {
  session: TarotSession;
  onBack: () => void;
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function minutesToTimeString(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function getSessionDurationMinutes(session: TarotSession): number {
  const id = session.id.toLowerCase();
  const dur = (session.duration || "").toLowerCase();
  if (id.includes("10-min") || dur.includes("10")) return 10;
  if (id.includes("20-min") || dur.includes("20")) return 20;
  if (id.includes("30-min") || dur.includes("30")) return 30;
  if (id.includes("1-hour") || dur.includes("1 hour") || dur.includes("60")) return 60;
  return 15;
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
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    days.push({
      dayName: dayNames[dayOfWeek],
      dateStr: `${String(d.getDate()).padStart(2, "0")} ${monthNames[d.getMonth()]}`,
      fullIso: d.toISOString().split("T")[0],
      dayOfWeek,
      isWeekend,
    });
  }
  return days;
}

export const BREAK_MINUTES = 10;

export function generateSlotsForDay(isWeekend: boolean, durationMinutes: number) {
  // Monday to Friday: 6:00 PM (1080) to 9:00 PM (1260)
  // Saturday & Sunday: 12:00 PM (720) to 10:00 PM (1320)
  // Step between slot start times includes session duration + minimum 10-minute break:
  let step = durationMinutes + BREAK_MINUTES;
  if (durationMinutes === 60) {
    step = 75; // 60 min session + 15 min break (clean 1h 15m intervals with >= 10m break)
  }

  const middaySlots: string[] = [];
  const eveningSlots: string[] = [];

  if (!isWeekend) {
    // Weekdays (Mon-Fri): 6:00 PM to 9:00 PM
    for (let m = 1080; m + durationMinutes <= 1260; m += step) {
      eveningSlots.push(minutesToTimeString(m));
    }
  } else {
    // Weekends (Sat-Sun): 12:00 PM to 10:00 PM
    // Afternoon: 12:00 PM (720) to 5:00 PM (1020)
    for (let m = 720; m < 1020 && m + durationMinutes <= 1320; m += step) {
      middaySlots.push(minutesToTimeString(m));
    }
    // Evening & Night: 5:00 PM (1020) to 10:00 PM (1320)
    for (let m = 1020; m + durationMinutes <= 1320; m += step) {
      eveningSlots.push(minutesToTimeString(m));
    }
  }

  return {
    midday: middaySlots,
    evening: eveningSlots,
  };
}

// Helper to compress screenshot to responsive base64
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function BookingDetailView({ session, onBack }: BookingDetailViewProps) {
  const days = getUpcomingDays();
  const durationMinutes = getSessionDurationMinutes(session);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentSelectedDay = days[selectedDayIndex];

  // Dynamic slots based on day
  const daySlots = generateSlotsForDay(currentSelectedDay.isWeekend, durationMinutes);

  const [selectedPeriod, setSelectedPeriod] = useState<"midday" | "evening">(
    currentSelectedDay.isWeekend ? "midday" : "evening"
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [dateScrollOffset, setDateScrollOffset] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Booked Intervals from server to detect collisions
  const [bookedIntervals, setBookedIntervals] = useState<
    Array<{ startMinutes: number; endMinutes: number; timeStr: string }>
  >([]);

  // Alert State for Already Booked Slots
  const [alreadyBookedAlert, setAlreadyBookedAlert] = useState<{
    slot: string;
    date: string;
  } | null>(null);

  // Step State: "slot" | "details" | "payment"
  const [bookingStep, setBookingStep] = useState<"slot" | "details" | "payment">("slot");
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");

  // Payment State
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [paymentFileName, setPaymentFileName] = useState<string | null>(null);
  const [paymentUtr, setPaymentUtr] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [desktopNotice, setDesktopNotice] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "7439630848@ybl";
  const UPI_PAYEE_NAME = "PRAGYA MONDAL";
  const UPI_PHONE_NUMBER = "7439630848";
  // Clean standard UPI link without long commercial notes that trigger bank fraud filters
  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${session.priceValue}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiDeepLink)}`;

  // Helper to check if a specific time slot is booked (including 10 min break buffer)
  const isSlotBooked = (slotTimeStr: string): boolean => {
    if (!slotTimeStr) return false;
    const start = timeToMinutes(slotTimeStr);
    const end = start + durationMinutes;
    return bookedIntervals.some(
      (b) => start < b.endMinutes && b.startMinutes < (end + BREAK_MINUTES)
    );
  };

  // Fetch booked slots whenever the selected day changes
  useEffect(() => {
    let isMounted = true;
    async function loadBookedSlots() {
      const res = await fetchBookedIntervals(currentSelectedDay.dateStr);
      if (isMounted && res.success && res.intervals) {
        setBookedIntervals(res.intervals);
      }
    }
    loadBookedSlots();
    return () => {
      isMounted = false;
    };
  }, [currentSelectedDay.dateStr]);

  // Adjust period and time whenever day changes
  useEffect(() => {
    const slots = generateSlotsForDay(currentSelectedDay.isWeekend, durationMinutes);
    let nextPeriod: "midday" | "evening" = "evening";
    if (currentSelectedDay.isWeekend) {
      nextPeriod = selectedPeriod === "midday" ? "midday" : "evening";
    } else {
      nextPeriod = "evening";
    }
    setSelectedPeriod(nextPeriod);

    const activeList = nextPeriod === "midday" ? slots.midday : slots.evening;
    // Auto-select first available slot if current selected is empty or not in list
    if (activeList.length > 0) {
      const firstAvailable = activeList.find((s) => !isSlotBooked(s)) || activeList[0];
      setSelectedTime(firstAvailable);
    }
  }, [selectedDayIndex, currentSelectedDay.isWeekend, durationMinutes]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleProceedToDetails = () => {
    if (!selectedTime || isSlotBooked(selectedTime)) {
      setAlreadyBookedAlert({
        slot: selectedTime || "Selected Time",
        date: currentSelectedDay.dateStr,
      });
      return;
    }
    setBookingError(null);
    setBookingStep("details");
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !instagram.trim()) {
      setBookingError("Please complete all required fields.");
      return;
    }
    setBookingError(null);
    setUploadError(null);
    setBookingStep("payment");
  };

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    try {
      const base64 = await compressImage(file);
      setPaymentScreenshot(base64);
      setPaymentFileName(file.name);
    } catch {
      setUploadError("Failed to process image. Please try again.");
    }
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_PHONE_NUMBER);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handlePayViaUpi = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Launch UPI app on mobile devices
      window.location.href = upiDeepLink;
    } else {
      // On desktop PCs / laptops, browsers crash if navigating to upi://
      // So show a clear guide to scan the QR code with their mobile phone!
      setDesktopNotice(true);
      const el = document.getElementById("upi-qr-card");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentScreenshot) {
      setUploadError("Please attach your payment screenshot to confirm.");
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    const bookingPlan = `${session.title} - ${currentSelectedDay.dayName} ${currentSelectedDay.dateStr} at ${selectedTime}`;
    const fullNotes = `Instagram: ${instagram}\nSelected Time: ${currentSelectedDay.dateStr} (${selectedTime})\nQuestion: To be asked directly on call / WhatsApp\nPayment Proof: Screenshot Attached${paymentUtr ? `\nUTR/Ref: ${paymentUtr}` : ""}`;

    const res = await submitBooking({
      name,
      phone,
      plan: bookingPlan,
      notes: fullNotes,
      bookingDate: currentSelectedDay.dateStr,
      bookingTime: selectedTime,
      durationMinutes,
      paymentScreenshot,
      paymentUtr,
      amount: session.price,
    });

    setSubmitting(false);

    if (!res.success) {
      const errorMsg = res.error || "Already this slot is booked! Please select another time.";
      setBookingError(errorMsg);
      setAlreadyBookedAlert({
        slot: selectedTime,
        date: currentSelectedDay.dateStr,
      });

      // Refresh booked intervals to update UI immediately
      const refreshed = await fetchBookedIntervals(currentSelectedDay.dateStr);
      if (refreshed.success && refreshed.intervals) {
        setBookedIntervals(refreshed.intervals);
      }
      return;
    }

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
          {bookingStep === "slot" ? (
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
                          className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border transition-all text-center ${
                            isSelected
                              ? "border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 shadow-sm"
                              : "border-gray-200 hover:border-pink-300 hover:bg-gray-50/70"
                          }`}
                        >
                          <span className={`text-[10px] sm:text-xs font-semibold uppercase ${isSelected ? "text-pink-700" : "text-gray-500"}`}>
                            {day.dayName}
                          </span>
                          <span className={`text-xs sm:text-sm font-bold mt-1 ${isSelected ? "text-gray-900" : "text-gray-800"}`}>
                            {day.dateStr}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slot Picker Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      Select your preferred time slot
                    </h3>
                    <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
                      {currentSelectedDay.isWeekend
                        ? "Weekends: 12:00 PM – 10:00 PM"
                        : "Mon – Fri: 6:00 PM – 9:00 PM"}
                    </span>
                  </div>

                  {/* Period Filter Tabs */}
                  {currentSelectedDay.isWeekend ? (
                    <div className="flex items-center rounded-full bg-gray-100 p-1 mb-5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPeriod("midday");
                          const available = daySlots.midday.find((s) => !isSlotBooked(s)) || daySlots.midday[0];
                          if (available) setSelectedTime(available);
                        }}
                        className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                          selectedPeriod === "midday"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <span>☀️</span> Afternoon (12 PM – 5 PM)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPeriod("evening");
                          const available = daySlots.evening.find((s) => !isSlotBooked(s)) || daySlots.evening[0];
                          if (available) setSelectedTime(available);
                        }}
                        className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                          selectedPeriod === "evening"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <span>🌙</span> Evening & Night (5 PM – 10 PM)
                      </button>
                    </div>
                  ) : (
                    <div className="mb-5 py-2 px-3 rounded-xl bg-pink-50/80 border border-pink-100 text-xs text-pink-900 font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>🌙</span>
                        <span className="font-semibold">Weekday Evening Sessions:</span>
                        <span>6:00 PM – 9:00 PM</span>
                      </span>
                      <span className="text-[11px] text-pink-700 bg-white/90 px-2 py-0.5 rounded-full border border-pink-200">
                        {durationMinutes} min slots
                      </span>
                    </div>
                  )}

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
                    {(selectedPeriod === "midday" ? daySlots.midday : daySlots.evening).map((slot) => {
                      const isSelected = selectedTime === slot;
                      const booked = isSlotBooked(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            if (booked) {
                              setAlreadyBookedAlert({
                                slot,
                                date: currentSelectedDay.dateStr,
                              });
                              alert(`Already this slot (${slot}) is booked! Please select another time.`);
                              return;
                            }
                            setSelectedTime(slot);
                          }}
                          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                            booked
                              ? "border-rose-200 bg-rose-50/80 text-rose-500 hover:bg-rose-100 cursor-pointer shadow-2xs"
                              : isSelected
                              ? "border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20 shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-gray-50"
                          }`}
                        >
                          {booked ? (
                            <>
                              <span className="line-through opacity-75">{slot}</span>
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-200/90 px-1.5 py-0.5 rounded">
                                🔒 Booked
                              </span>
                            </>
                          ) : (
                            <span>{slot}</span>
                          )}
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
                    onClick={handleProceedToDetails}
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
            /* STEP 2 & 3: Details & Payment */
            <motion.div
              key={bookingStep}
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
                    <span className="font-semibold text-gray-900">{currentSelectedDay.dateStr} at {selectedTime}</span> and payment screenshot of{" "}
                    <span className="font-bold text-pink-700">{session.price}</span> have been received. 
                    SoftTarotGirl will verify your proof and reach out to you on WhatsApp shortly to divine your spread. 🔮✨
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium mb-8 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sacred sanctuary reserved & payment proof submitted!</span>
                  </div>

                  <button
                    onClick={onBack}
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm transition-all shadow-md"
                  >
                    Back to Sessions
                  </button>
                </div>
              ) : bookingStep === "details" ? (
                /* STEP 2: Contact Details Form */
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Step 2: Your Details</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Selected: <span className="text-pink-600 font-semibold">{session.title}</span> on{" "}
                        <span className="text-gray-800 font-semibold">{currentSelectedDay.dateStr}, {selectedTime}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setBookingStep("slot")}
                      type="button"
                      className="text-xs font-semibold text-gray-500 hover:text-pink-600 underline"
                    >
                      Change slot
                    </button>
                  </div>

                  {bookingError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <form onSubmit={handleProceedToPayment} className="space-y-4">
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
                        placeholder="e.g. Aarohi Verma"
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
                        placeholder="e.g. @softarotgirl"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-100 text-xs text-pink-900/80 leading-relaxed flex items-center gap-2.5">
                      <span className="text-base select-none">🔮</span>
                      <span>Questions will be channeled and discussed directly during your voice call or WhatsApp session.</span>
                    </div>

                    <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingStep("slot")}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 text-center"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-bold text-sm shadow-lg hover:shadow-pink-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Proceed to Payment ({session.price})</span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* STEP 3: Payment & Screenshot Upload */
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Step 3: Payment & Confirmation</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Amount to pay: <span className="font-extrabold text-pink-700 text-sm">{session.price}</span> for {session.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setBookingStep("details")}
                      type="button"
                      className="text-xs font-semibold text-gray-500 hover:text-pink-600 underline"
                    >
                      Edit details
                    </button>
                  </div>

                  {bookingError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Booking summary pill */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-gray-800 block text-sm">{name}</span>
                        <span className="text-gray-500">{phone} • {instagram}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-pink-100 border border-pink-300 font-bold text-pink-800">
                          {currentSelectedDay.dateStr} at {selectedTime}
                        </span>
                      </div>
                    </div>

                    {/* Mobile 1-Tap Pay via PhonePe / UPI App */}
                    {/* QR Code Payment Card */}
                    <div id="upi-qr-card" className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-200/90 shadow-sm text-center">
                      <div className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold mb-3 border border-pink-200 shadow-2xs">
                        ⚡ Total Payable: {session.price}
                      </div>

                      <h4 className="text-base font-bold text-gray-900 mb-1">
                        Scan QR Code to Pay
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4 leading-relaxed">
                        Scan this QR code using PhonePe, Google Pay, or Paytm, then attach your payment screenshot below:
                      </p>

                      {/* QR Code Container */}
                      <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 max-w-xs mx-auto flex flex-col items-center shadow-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-pink-200 shadow-2xs inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={qrCodeUrl}
                            alt="PhonePe / UPI QR Code"
                            className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-lg"
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-800 mt-2.5">
                          Scan with PhonePe, GPay, or Paytm
                        </span>
                        <span className="text-[11px] text-gray-500 mt-0.5 flex flex-col items-center gap-0.5">
                          <span>Account: <strong className="text-gray-900">{UPI_PAYEE_NAME}</strong></span>
                          <span>Number: <strong className="text-gray-900">{UPI_PHONE_NUMBER}</strong></span>
                        </span>
                      </div>
                    </div>

                    {/* Screenshot Upload Form */}
                    <form onSubmit={handleConfirmBooking} className="p-4 sm:p-5 rounded-2xl bg-white border border-pink-200/90 shadow-sm space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                          <span>Upload Payment Screenshot *</span>
                          <span className="text-[11px] text-pink-700 font-normal">Required for confirmation</span>
                        </label>

                        {!paymentScreenshot ? (
                          <label className="border-2 border-dashed border-pink-300 hover:border-pink-500 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-pink-50/40 hover:bg-pink-50/70 transition-all text-center">
                            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-xs">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">
                                Tap or click to select payment screenshot
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                Mobile screenshot or camera (JPG, PNG, WebP)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleScreenshotChange}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-200 flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={paymentScreenshot}
                              alt="Payment Screenshot Preview"
                              className="w-14 h-14 object-cover rounded-xl border border-pink-300 shadow-xs"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-900 truncate block">
                                {paymentFileName || "Payment Screenshot"}
                              </span>
                              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Attached successfully
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentScreenshot(null);
                                setPaymentFileName(null);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-all"
                            >
                              <X className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingStep("details")}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 text-center"
                        >
                          Back
                        </button>

                        <button
                          type="submit"
                          disabled={submitting || !paymentScreenshot}
                          className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-bold text-sm shadow-lg hover:shadow-pink-300/50 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4 shrink-0" />
                          <span className="text-center">
                            {submitting
                              ? "Verifying..."
                              : !paymentScreenshot
                              ? "Upload Screenshot to Confirm"
                              : `Confirm Booking (${session.price})`}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Already Booked Alert Dialog */}
      {alreadyBookedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-pink-200 shadow-2xl text-center relative">
            <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-300 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-sm">
              🔒
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">
              Already This Slot Is Booked!
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
              The time slot for <span className="font-bold text-pink-700">{alreadyBookedAlert.slot}</span> on <span className="font-bold text-gray-900">{alreadyBookedAlert.date}</span> has already been reserved.
            </p>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-800 font-medium mb-5">
              Please choose another available time slot from the list.
            </div>
            <button
              type="button"
              onClick={() => {
                setAlreadyBookedAlert(null);
                setBookingStep("slot");
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-105 text-white font-semibold text-sm transition-all shadow-md"
            >
              Select Another Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
