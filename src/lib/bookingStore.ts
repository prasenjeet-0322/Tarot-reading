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
}

const DATA_FILE = path.join(process.cwd(), "data", "bookings.json");

function getLocalBookings(): BookingRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
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

export async function addBooking(booking: {
  name: string;
  email: string;
  plan: string;
  question: string;
}): Promise<BookingRecord> {
  const newRecord: BookingRecord = {
    id: "booking_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
    name: booking.name,
    email: booking.email,
    plan: booking.plan,
    question: booking.question,
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

  return newRecord;
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
          mergedMap.set(item.id || item.created_at, item);
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
