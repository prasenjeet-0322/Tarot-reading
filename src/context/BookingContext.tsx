"use client";

import { createContext, useContext, useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { motion, AnimatePresence } from "framer-motion";

const BookingContext = createContext<{
  openBooking: (plan?: string) => void;
  closeBooking: () => void;
  isOpen: boolean;
}>({
  openBooking: () => {},
  closeBooking: () => {},
  isOpen: false,
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

  const openBooking = (plan?: string) => {
    if (plan) setSelectedPlan(plan);
    setIsOpen(true);
  };
  
  const closeBooking = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg my-8"
            >
              <button 
                onClick={closeBooking}
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="max-h-[85vh] overflow-y-auto no-scrollbar rounded-2xl shadow-2xl">
                <BookingForm defaultPlan={selectedPlan} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
