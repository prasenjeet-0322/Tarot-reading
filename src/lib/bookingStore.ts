import fs from "fs";
import path from "path";
import { supabaseAdmin } from "./supabase";

export interface BookingRecord {
  id: string;
  created_at: string;
  name: string;
  email: string; // holds phone number
  plan: string;
  question: string;
  status?: "pending" | "completed";
  bookingDate?: string; // YYYY-MM-DD or e.g. "05 Oct"
  bookingTime?: string; // e.g. "06:00 PM"
  startMinutes?: number; // minutes from midnight (e.g. 1080 for 06:00 PM)
  endMinutes?: number; // e.g. 1090 for 06:10 PM
  durationMinutes?: number;
}

const DATA_FILE = path.join(process.cwd(), "data", "bookings.json");

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

function extractDateFromBooking(b: BookingRecord): string {
  if (b.bookingDate) return b.bookingDate;
  const qMatch = b.question?.match(/Selected Time:\s*([^\n(]+)/i);
  if (qMatch) return qMatch[1].trim();
  const pMatch = b.plan?.match(/(?:SUN|MON|TUE|WED|THU|FRI|SAT)\s+(\d{1,2}\s+[A-Za-z]{3})/i);
  if (pMatch) return pMatch[1].trim();
  return "";
}

function extractTimeFromBooking(b: BookingRecord): string {
  if (b.bookingTime) return b.bookingTime;
  const qMatch = b.question?.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM))\)/i);
  if (qMatch) return qMatch[1].trim();
  const pMatch = b.plan?.match(/at\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  if (pMatch) return pMatch[1].trim();
  return "";
}

function extractDurationFromBooking(b: BookingRecord): number {
  if (b.durationMinutes) return b.durationMinutes;
  const plan = (b.plan || "").toLowerCase();
  if (plan.includes("10 min")) return 10;
  if (plan.includes("20 min")) return 20;
  if (plan.includes("30 min")) return 30;
  if (plan.includes("1 hour") || plan.includes("60 min")) return 60;
  return 15;
}

function getLocalBookings(): BookingRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const list: BookingRecord[] = JSON.parse(raw);
    return list.map((b) => ({
      ...b,
      status: b.status || "pending",
      bookingDate: extractDateFromBooking(b),
      bookingTime: extractTimeFromBooking(b),
      durationMinutes: extractDurationFromBooking(b),
      startMinutes: b.startMinutes ?? timeToMinutes(extractTimeFromBooking(b)),
      endMinutes:
        b.endMinutes ??
        timeToMinutes(extractTimeFromBooking(b)) + extractDurationFromBooking(b),
    }));
  } catch {
    return [];
  }
}

function saveLocalBookings(bookings: BookingRecord[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write bookings to disk:", err);
  }
}

export const BREAK_MINUTES = 10;

export function isSlotOverlapping(
  dateStr: string,
  startMinutes: number,
  endMinutes: number
): boolean {
  const bookings = getLocalBookings();
  const cleanTargetDate = dateStr.trim().toLowerCase();

  for (const b of bookings) {
    const bDate = (b.bookingDate || "").trim().toLowerCase();
    if (!bDate) continue;

    // Check if the booking matches the same date
    const dateMatches =
      bDate === cleanTargetDate ||
      cleanTargetDate.includes(bDate) ||
      bDate.includes(cleanTargetDate);

    if (dateMatches) {
      const bStart = b.startMinutes ?? 0;
      const bDur = b.durationMinutes || 10;
      // Existing booking block includes session duration + minimum 10-minute break
      const bEnd = b.endMinutes ?? (bStart + bDur);
      const bBlockedEnd = bEnd + BREAK_MINUTES;

      // Incoming session also requires its duration + minimum 10-minute break
      const incomingBlockedEnd = endMinutes + BREAK_MINUTES;

      // Overlap condition: startA < endB && startB < endA
      if (startMinutes < bBlockedEnd && bStart < incomingBlockedEnd) {
        return true;
      }
    }
  }
  return false;
}

export function getBookedIntervalsForDate(dateStr: string): Array<{
  startMinutes: number;
  endMinutes: number;
  timeStr: string;
  durationMinutes: number;
}> {
  const bookings = getLocalBookings();
  const cleanTargetDate = dateStr.trim().toLowerCase();
  const intervals: Array<{
    startMinutes: number;
    endMinutes: number;
    timeStr: string;
    durationMinutes: number;
  }> = [];

  for (const b of bookings) {
    const bDate = (b.bookingDate || "").trim().toLowerCase();
    if (!bDate) continue;

    const dateMatches =
      bDate === cleanTargetDate ||
      cleanTargetDate.includes(bDate) ||
      bDate.includes(cleanTargetDate);

    if (dateMatches) {
      const bStart = b.startMinutes ?? 0;
      const dur = b.durationMinutes || 10;
      // Block the duration plus the 10-minute break
      const bEnd = (b.endMinutes ?? (bStart + dur)) + BREAK_MINUTES;
      intervals.push({
        startMinutes: bStart,
        endMinutes: bEnd,
        timeStr: b.bookingTime || "",
        durationMinutes: dur,
      });
    }
  }
  return intervals;
}

export async function addBooking(booking: {
  name: string;
  email: string;
  plan: string;
  question: string;
  bookingDate?: string;
  bookingTime?: string;
  startMinutes?: number;
  endMinutes?: number;
  durationMinutes?: number;
}): Promise<{ record?: BookingRecord; error?: string }> {
  const start =
    booking.startMinutes ?? (booking.bookingTime ? timeToMinutes(booking.bookingTime) : 0);
  const dur = booking.durationMinutes || 10;
  const end = booking.endMinutes ?? (start + dur);

  // Validate double booking collision
  if (booking.bookingDate && isSlotOverlapping(booking.bookingDate, start, end)) {
    return {
      error: "Already this slot is booked! Please select another time.",
    };
  }

  const newRecord: BookingRecord = {
    id: "booking_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
    name: booking.name,
    email: booking.email,
    plan: booking.plan,
    question: booking.question,
    status: "pending",
    bookingDate: booking.bookingDate,
    bookingTime: booking.bookingTime,
    startMinutes: start,
    endMinutes: end,
    durationMinutes: dur,
  };

  // 1. Persist locally immediately
  const current = getLocalBookings();
  current.unshift(newRecord);
  saveLocalBookings(current);

  // 2. Also try Supabase safely in background if configured and online
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes("placeholder")) {
      const supaPromise = supabaseAdmin.from("bookings").insert([
        {
          name: booking.name,
          email: booking.email,
          plan: booking.plan,
          question: booking.question,
        },
      ]);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 1500)
      );
      await Promise.race([supaPromise, timeoutPromise]);
    }
  } catch {
    // Network or DNS error gracefully ignored since data is safely stored locally
  }

  return { record: newRecord };
}

export async function deleteBookingRecord(id: string): Promise<boolean> {
  const current = getLocalBookings();
  const updated = current.filter((b) => b.id !== id);
  saveLocalBookings(updated);

  // Also attempt Supabase deletion if connected
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes("placeholder")) {
      const supaPromise = supabaseAdmin.from("bookings").delete().eq("id", id);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 1500)
      );
      await Promise.race([supaPromise, timeoutPromise]);
    }
  } catch {
    // Fallback handled locally
  }

  return true;
}

export async function toggleBookingStatusRecord(id: string): Promise<BookingRecord | null> {
  const current = getLocalBookings();
  let updatedRecord: BookingRecord | null = null;

  const updated = current.map((b) => {
    if (b.id === id) {
      const nextStatus: "pending" | "completed" = b.status === "completed" ? "pending" : "completed";
      updatedRecord = { ...b, status: nextStatus };
      return updatedRecord;
    }
    return b;
  });

  saveLocalBookings(updated);
  return updatedRecord;
}

export async function getAllBookings(): Promise<{ data: BookingRecord[]; error: string | null }> {
  const local = getLocalBookings();

  // Try Supabase if reachable, with quick fallback to local storage
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes("placeholder")) {
      const supaPromise = supabaseAdmin
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 1500)
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = (await Promise.race([supaPromise, timeoutPromise])) as any;
      if (res && !res.error && Array.isArray(res.data) && res.data.length > 0) {
        const mergedMap = new Map<string, BookingRecord>();
        for (const item of local) {
          mergedMap.set(item.id, item);
        }
        for (const item of res.data) {
          const existing = mergedMap.get(item.id || item.created_at);
          mergedMap.set(item.id || item.created_at, {
            ...item,
            status: existing?.status || item.status || "pending",
          });
        }
        const sorted = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return { data: sorted, error: null };
      }
    }
  } catch {
    // Fallback to local data
  }

  return { data: local, error: null };
}
