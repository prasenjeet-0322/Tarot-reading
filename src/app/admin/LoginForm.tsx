"use client";

import { useState } from "react";
import { loginAdmin } from "./actions";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAdmin(password);
    if (res.success) {
      window.location.reload();
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B1E] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#1A1642] border border-[#7B2FF7]/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#D4AF37] mb-2">Admin Portal</h1>
          <p className="text-gray-400">Enter your master password to access bookings.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#A68625] hover:from-[#E8CC6F] hover:to-[#D4AF37] text-[#0D0B1E] font-bold py-3 rounded-lg transition-all disabled:opacity-70"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
