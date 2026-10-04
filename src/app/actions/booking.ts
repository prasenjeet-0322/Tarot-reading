"use server";

import {
  addBooking,
  getBookedIntervalsForDate,
  timeToMinutes,
} from "@/lib/bookingStore";

export async function submitBooking(data: {
  name: string;
  phone: string;
  plan: string;
  notes: string;
  bookingDate?: string;
  bookingTime?: string;
  durationMinutes?: number;
}) {
  try {
    const startMinutes = data.bookingTime ? timeToMinutes(data.bookingTime) : 0;
    const dur = data.durationMinutes || 10;
    const endMinutes = startMinutes + dur;

    const result = await addBooking({
      name: data.name,
      email: data.phone,
      plan: data.plan,
      question: data.notes,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      startMinutes,
      endMinutes,
      durationMinutes: dur,
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, booking: result.record };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "Failed to save booking" };
  }
}

export async function fetchBookedIntervals(dateStr: string) {
  try {
    const intervals = getBookedIntervalsForDate(dateStr);
    return { success: true, intervals };
  } catch (error) {
    console.error("Error fetching booked intervals:", error);
    return { success: false, intervals: [] };
  }
}
