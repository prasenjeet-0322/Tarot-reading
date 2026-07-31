"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function BookingForm({ defaultPlan }: { defaultPlan?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan || "Voice Call - 10 Min (₹85)");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from('bookings').insert([
      { 
        name: formData.get('name'), 
        email: formData.get('email'), 
        plan: formData.get('plan'), 
        question: formData.get('question') 
      }
    ]);
    
    setLoading(false);
    
    if (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error submitting your request. Please try again.');
      return;
    }
    
    setSuccess(true);
    // Reset form after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="glass-card p-8 rounded-2xl max-w-lg mx-auto w-full relative overflow-hidden">
      {success && (
        <div className="absolute inset-0 bg-[#0D0B1E]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8">
          <Sparkles className="w-12 h-12 text-[#D4AF37] mb-4" />
          <h3 className="text-2xl font-serif text-white mb-2">Message Received</h3>
          <p className="text-gray-300">Your question has been cast into the cosmos. I will get back to you shortly.</p>
        </div>
      )}

      <h3 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
        <Send className="w-5 h-5 text-[#7B2FF7]" />
        Book Your Reading
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div className="relative">
          <label className="block text-sm text-gray-400 mb-1" htmlFor="plan">Selected Plan</label>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[#151233] border border-white/10 rounded-lg px-4 py-3 text-white cursor-pointer flex justify-between items-center hover:border-[#D4AF37]/50 transition-colors"
          >
            <span className="text-sm">{selectedPlan}</span>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
          </div>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-[#1A1642] border border-[#7B2FF7]/30 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {[
                  "Voice Call - 10 Min (₹85)",
                  "Voice Call - 20 Min (₹145)",
                  "Voice Call - 30 Min (₹170)",
                  "Voice Call - 1 Hour (₹450)",
                  "Card Reading (₹29 per card)"
                ].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelectedPlan(option);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[#7B2FF7]/30",
                      selectedPlan === option ? "text-[#D4AF37] bg-[#7B2FF7]/10" : "text-gray-300"
                    )}
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <input type="hidden" name="plan" value={selectedPlan} />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="question">Your Question or Focus</label>
          <textarea 
            id="question" 
            name="question" 
            required 
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
            placeholder="What guidance are you seeking?"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#7B2FF7] to-[#5816C7] hover:from-[#9B63F8] hover:to-[#7B2FF7] text-white px-4 py-4 rounded-lg font-medium transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              Send into the Universe
            </>
          )}
        </button>
      </form>
    </div>
  );
}
