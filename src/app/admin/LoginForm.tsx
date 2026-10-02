"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginAdmin } from "./actions";
import { Lock, User, Sparkles, ArrowLeft, ShieldAlert } from "lucide-react";
import { HalloweenDecorations } from "@/components/HalloweenDecorations";

export function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const res = await loginAdmin(formData);
    if (res.success) {
      window.location.reload();
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF2F8] flex flex-col justify-center items-center p-4 relative selection:bg-pink-300 selection:text-pink-900">
      <HalloweenDecorations />

      {/* Back to Site Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-pink-200 text-xs font-semibold text-gray-700 hover:text-pink-700 shadow-sm transition-all hover:bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md border border-pink-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(244,114,182,0.22)] relative z-10">
        {/* Brand Avatar */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-pink-300 shadow-md mb-3">
            <Image
              src="/logo.jpeg"
              alt="SoftTarotGirl Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Admin Portal
            </h1>
            <span className="text-lg">🎃</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            SoftTarotGirl • Booking & Client Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="admin-id">
              Admin ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-id"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="admin-password">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:brightness-105 active:scale-95 text-white font-bold text-sm shadow-md hover:shadow-pink-300/50 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
