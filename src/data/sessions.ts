export interface TarotSession {
  id: string;
  title: string;
  duration: string;
  price: string;
  priceValue: number;
  contactType: string;
  category: "voice" | "card";
  description: string;
  detailedDescription: string;
  icon: string;
  badge?: {
    text: string;
    type: "popular" | "rating" | "halloween" | "healing";
  };
}

export const TAROT_SESSIONS: TarotSession[] = [
  {
    id: "10-min-voice-call",
    title: "10 Min Session - Voice Call Reading",
    duration: "10 Minutes",
    contactType: "Voice Call / Phone",
    price: "₹110",
    priceValue: 110,
    category: "voice",
    icon: "⏱️",
    badge: {
      text: "Most Popular",
      type: "popular",
    },
    description:
      "Quick, focused check for specific questions or concerns about your life, giving a clear, crispy direction to head!",
    detailedDescription:
      "Tarot session booked with me is a very divine and special space where you can not just understand but also get honest guidance, insights about your life and solutions for different concerns. Quite in-depth and magical experience to know reality through the universe's touch.",
  },
  {
    id: "20-min-voice-call",
    title: "20 Min Session - Voice Call Reading",
    duration: "20 Minutes",
    contactType: "Voice Call / Phone",
    price: "₹199",
    priceValue: 199,
    category: "voice",
    icon: "⏱️",
    badge: {
      text: "★ 5",
      type: "rating",
    },
    description:
      "Balanced session exploring 1-2 major life areas such as love, career, or personal growth with multiple card spreads.",
    detailedDescription:
      "A 20-minute spiritual voice call session. Gives deeper insights and time to evaluate different aspects, clearing confusion and aligning your energy.",
  },
  {
    id: "30-min-voice-call",
    title: "30 Min Session - Voice Call Reading",
    duration: "30 Minutes",
    contactType: "Voice Call / Phone",
    price: "₹249",
    priceValue: 249,
    category: "voice",
    icon: "⏱️",
    badge: {
      text: "🎃 Spooky Special",
      type: "halloween",
    },
    description:
      "It's a more detailed session where different aspects can be evaluated, giving deeper insights and comprehensive time to discuss!",
    detailedDescription:
      "A deeper spiritual dive into your love life, career, finances, or soul path. We pull multiple card spreads and channel intuitive spirit guidance for comprehensive solutions.",
  },
  {
    id: "1-hour-voice-call",
    title: "1 Hour Session - Voice Call Reading",
    duration: "1 Hour",
    contactType: "Voice Call / Phone",
    price: "₹450",
    priceValue: 450,
    category: "voice",
    icon: "⏱️",
    badge: {
      text: "★ 5 Blueprint",
      type: "rating",
    },
    description:
      "Best way to understand a complete blueprint of your life that covers the unheard, raw, and spiritual awakening!",
    detailedDescription:
      "The ultimate 1-hour life blueprint session. We uncover subconscious blocks, karmic patterns, future potentials, and divine alignments with unlimited questions during your hour.",
  },
  {
    id: "card-reading-35",
    title: "Card Readings - Single or Custom Pulls",
    duration: "Per Card",
    contactType: "WhatsApp Delivery",
    price: "₹35",
    priceValue: 35,
    category: "card",
    icon: "🃏",
    badge: {
      text: "✨ ₹35 Tarot Card",
      type: "popular",
    },
    description:
      "Personalized tarot card pulls with detailed audio and text interpretation, plus high-res photo of your cards sent to WhatsApp!",
    detailedDescription:
      "Fast, convenient card pull for pressing questions. Pick as many cards as you want (₹35 per card). You will receive an authentic photo of your drawn cards alongside an in-depth voice note.",
  },
];
