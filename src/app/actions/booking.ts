"use server";

import { addBooking } from "@/lib/bookingStore";

export async function submitBooking(data: {
  name: string;
  phone: string;
  plan: string;
  notes: string;
}) {
  try {
    const record = await addBooking({
      name: data.name,
      email: data.phone,
      plan: data.plan,
      question: data.notes,
    });
    return { success: true, booking: record };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "Failed to save booking" };
  }
}
