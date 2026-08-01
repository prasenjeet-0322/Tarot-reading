"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const initialTestimonials = [
  {
    name: "Priya S.",
    review: "The reading was incredibly accurate and gave me exactly the clarity I needed for my career transition. Highly recommended!",
    rating: 5,
  },
  {
    name: "Rohan M.",
    review: "I was skeptical at first, but the insights provided were so spot-on it gave me goosebumps. A truly mystical experience.",
    rating: 5,
  },
  {
    name: "Anita K.",
    review: "Her energy is so calming. I felt safe asking vulnerable questions, and the guidance I received was deeply healing.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", review: "", rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data && data.length > 0) {
        // We can prepend the fetched reviews to the initial ones, or just use fetched.
        // For now, let's prepend them to initial ones to always have some content.
        setTestimonials([...data, ...initialTestimonials]);
      }
    };
    
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.review) return;
    
    setLoading(true);
    
    const { error } = await supabase.from('reviews').insert([
      {
        name: newReview.name,
        review: newReview.review,
        rating: newReview.rating
      }
    ]);
    
    setLoading(false);
    
    if (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
      return;
    }
    
    setTestimonials([{...newReview}, ...testimonials]);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setNewReview({ name: "", review: "", rating: 5 });
    }, 3000);
  };

  return (
    <section id="reviews" className="py-12 bg-[#151233]/80 relative">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4"
          >
            Client Reviews
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto mb-8"
          >
            See what others have experienced on their journey.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-2 border border-[#D4AF37]/50 text-[#E8CC6F] rounded-full hover:bg-[#D4AF37]/10 transition-colors"
          >
            Leave a Review
          </motion.button>
        </div>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#151233] border border-[#7B2FF7]/30 p-8 rounded-2xl w-full max-w-md relative shadow-2xl"
              >
                <button 
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 fill-[#D4AF37]" />
                    <h3 className="text-2xl font-serif text-[#E8CC6F] mb-2">Thank You!</h3>
                    <p className="text-gray-300">Your review has been shared with the stars.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <h3 className="text-2xl font-serif text-[#E8CC6F] mb-2">Share your experience</h3>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={newReview.name}
                        onChange={e => setNewReview({...newReview, name: e.target.value})}
                        className="w-full bg-[#0D0B1E] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className={`w-6 h-6 cursor-pointer ${newReview.rating >= star ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Your Review</label>
                      <textarea 
                        required
                        rows={4}
                        value={newReview.review}
                        onChange={e => setNewReview({...newReview, review: e.target.value})}
                        className="w-full bg-[#0D0B1E] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#A68625] text-[#0D0B1E] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-70"
                    >
                      {loading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 pb-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
              className="glass-card p-8 rounded-2xl relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-6 leading-relaxed font-light">&quot;{t.review}&quot;</p>
              <div className="font-serif text-white font-medium">— {t.name}</div>
              
              <div className="absolute top-4 right-6 text-6xl font-serif text-[#7B2FF7]/10 pointer-events-none">
                &quot;
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Marquee View (Left to Right Loop) */}
        <div className="md:hidden overflow-hidden w-full relative py-4">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#151233]/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#151233]/90 to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex gap-4 w-max"
            animate={{ x: ["-33.333333%", "0%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, index) => (
              <div
                key={`mobile-${index}`}
                className="glass-card p-6 rounded-2xl relative w-[280px] shrink-0"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4 leading-relaxed font-light text-sm">&quot;{t.review}&quot;</p>
                <div className="font-serif text-white font-medium text-sm">— {t.name}</div>
                
                <div className="absolute top-4 right-4 text-4xl font-serif text-[#7B2FF7]/10 pointer-events-none">
                  &quot;
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
