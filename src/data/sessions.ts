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
    title: "10 Min Session - Voice Call Divination",
    duration: "10 Minutes",
    contactType: "Live Voice Divination",
    price: "₹110",
    priceValue: 110,
    category: "voice",
    icon: "🕯️",
    badge: {
      text: "⚡ Crystal Clarity",
      type: "popular",
    },
    description:
      "Quick, focused flame divination for burning questions or urgent concerns, revealing a crisp, illuminated direction from the cards!",
    detailedDescription:
      "A sacred sanctuary for quick divination. Step into the circle for honest guidance, mystic revelations about your concerns, and direct answers channeled from the cosmic deck.",
  },
  {
    id: "20-min-voice-call",
    title: "20 Min Session - Voice Call Divination",
    duration: "20 Minutes",
    contactType: "Live Voice Divination",
    price: "₹199",
    priceValue: 199,
    category: "voice",
    icon: "🌙",
    badge: {
      text: "★ 5 Lunar Guidance",
      type: "rating",
    },
    description:
      "Balanced spread exploring 1-2 major life realms such as love, career, or spiritual growth with multiple intuitive tarot spreads.",
    detailedDescription:
      "A 20-minute spiritual voice divination. Explores deeper arcane currents, clearing confusion and weaving harmony back into your personal energy field.",
  },
  {
    id: "30-min-voice-call",
    title: "30 Min Session - Voice Call Divination",
    duration: "30 Minutes",
    contactType: "Live Voice Divination",
    price: "₹249",
    priceValue: 249,
    category: "voice",
    icon: "🔮",
    badge: {
      text: "🎃 Witch Spooky Special",
      type: "halloween",
    },
    description:
      "An in-depth divination where multi-layered arcane dimensions are examined, granting profound revelations and plenty of time to explore!",
    detailedDescription:
      "A deep mystical journey into your heart, destiny, karmic connections, and soul path. We pull multiple card spreads and channel intuitive spirit guidance for comprehensive solutions.",
  },
  {
    id: "1-hour-voice-call",
    title: "1 Hour Session - Complete Grimoire Reading",
    duration: "1 Hour",
    contactType: "Live Voice Divination",
    price: "₹450",
    priceValue: 450,
    category: "voice",
    icon: "📜",
    badge: {
      text: "⭐ Life Blueprint",
      type: "rating",
    },
    description:
      "The master divination to unveil the full tapestry of your life, unlocking hidden subconscious truths, karmic cycles, and spiritual awakening!",
    detailedDescription:
      "The ultimate 1-hour life blueprint session. We uncover subconscious blocks, karmic patterns, future potentials, and divine alignments with unlimited questions during your hour.",
  },
  {
    id: "card-reading-35",
    title: "Arcana Card Readings - Single or Custom Pulls",
    duration: "Per Card",
    contactType: "WhatsApp Audio + Photos",
    price: "₹35",
    priceValue: 35,
    category: "card",
    icon: "🃏",
    description:
      "Sacred card pulls with personalized intuitive audio whispers, written interpretations, and high-resolution photos of your drawn cards sent directly to WhatsApp!",
    detailedDescription:
      "Fast, convenient card pull for pressing questions. Pick as many cards as you want (₹35 per card). You will receive an authentic photo of your drawn cards alongside an in-depth voice note.",
  },
];
