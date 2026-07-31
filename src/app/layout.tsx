import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SoftTarotGirl | Unlock the Secrets Written in the Stars",
  description: "Get personalized tarot readings and guidance from SoftTarotGirl.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
