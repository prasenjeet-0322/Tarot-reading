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
  paymentScreenshot?: string;
  paymentUtr?: string;
  amount?: string;
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
      paymentScreenshot: data.paymentScreenshot,
      paymentUtr: data.paymentUtr,
      amount: data.amount,
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    // --- SEND TO TELEGRAM ---
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      const text = `🔮 *New Tarot Booking Received!* 🔮\n\n👤 *Name:* ${data.name}\n📱 *WhatsApp:* ${data.phone}\n📝 *Plan:* ${data.plan}\n📅 *Date:* ${data.bookingDate}\n⏰ *Time:* ${data.bookingTime}\n💰 *Amount:* ${data.amount}\n\n📋 *Notes/Insta:*\n${data.notes}`;
      
      try {
        if (data.paymentScreenshot) {
          const base64Data = data.paymentScreenshot.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const blob = new Blob([buffer], { type: 'image/jpeg' });
          
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('caption', text);
          formData.append('parse_mode', 'Markdown');
          formData.append('photo', blob, 'screenshot.jpg');

          await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });
        } else {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' }),
          });
        }
      } catch (err) {
        console.error("Failed to send to Telegram:", err);
      }
    }
    // ------------------------

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
