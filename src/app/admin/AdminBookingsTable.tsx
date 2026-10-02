"use client";

import { useState } from "react";
import { BookingRecord } from "@/lib/bookingStore";
import { deleteBookingAction, toggleBookingStatusAction } from "./actions";
import {
  Calendar,
  Phone,
  CheckCircle2,
  Trash2,
  Clock,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

interface AdminBookingsTableProps {
  initialBookings: BookingRecord[];
}

export function AdminBookingsTable({ initialBookings }: AdminBookingsTableProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "pending") return (b.status || "pending") === "pending";
    if (filter === "completed") return b.status === "completed";
    return true;
  });

  const handleToggleComplete = async (id: string) => {
    setLoadingId(id);
    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status === "completed" ? "pending" : "completed";
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );

    await toggleBookingStatusAction(id);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    // Optimistic UI update
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirmId(null);

    await deleteBookingAction(id);
    setLoadingId(null);
  };

  return (
    <div className="w-full">
      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1.5 p-1 bg-pink-100/60 rounded-full border border-pink-200">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filter === "pending"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>⏳</span>
            <span>Pending ({bookings.filter((b) => (b.status || "pending") === "pending").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filter === "completed"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>✓</span>
            <span>Completed ({bookings.filter((b) => b.status === "completed").length})</span>
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredBookings.length} of {bookings.length} requests
        </span>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-200 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center text-xl mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">
              Delete Booking?
            </h4>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to delete this booking request? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single View Bookings Container - Fits on screen with NO horizontal scroll slider */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm table-fixed">
          <thead>
            <tr className="bg-pink-50/70 text-gray-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="p-3 sm:p-4 w-[28%]">Client & Contact</th>
              <th className="p-3 sm:p-4 w-[30%]">Booked Session & Slot</th>
              <th className="p-3 sm:p-4 w-[16%] hidden md:table-cell">Submitted</th>
              <th className="p-3 sm:p-4 w-[12%]">Status</th>
              <th className="p-3 sm:p-4 w-[14%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings && filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => {
                const cleanPhone = booking.email?.replace(/[^0-9]/g, "");
                const isCompleted = booking.status === "completed";
                const isBusy = loadingId === booking.id;

                // Extract Instagram handle from question notes if present
                const instaMatch = booking.question?.match(/Instagram:\s*(@?[\w_.]+)/i);
                const instaHandle = instaMatch ? instaMatch[1] : null;

                return (
                  <tr
                    key={booking.id}
                    className={`transition-colors ${
                      isCompleted ? "bg-emerald-50/20 hover:bg-emerald-50/35" : "hover:bg-pink-50/35"
                    }`}
                  >
                    {/* 1. Client & Contact */}
                    <td className="p-3 sm:p-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-bold text-sm sm:text-base leading-tight ${
                            isCompleted ? "text-gray-500 line-through decoration-emerald-500" : "text-gray-900"
                          }`}
                        >
                          {booking.name}
                        </span>

                        {/* Phone & WhatsApp Chat Button */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-gray-600 text-xs flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            {booking.email}
                          </span>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                                booking.name
                              )}!%20This%20is%20Nidhi%20from%20SoftTarotGirl%20regarding%20your%20Tarot%20Reading%20session.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold shadow-xs transition-all"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp className="w-3 h-3" />
                              <span>Chat</span>
                            </a>
                          )}
                        </div>

                        {/* Instagram handle */}
                        {instaHandle && (
                          <div className="flex items-center gap-1 text-[11px] text-pink-700 font-medium">
                            <FaInstagram className="w-3 h-3 text-pink-500 shrink-0" />
                            <span>{instaHandle.startsWith("@") ? instaHandle : `@${instaHandle}`}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 2. Booked Session & Slot */}
                    <td className="p-3 sm:p-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-block px-2.5 py-1 bg-pink-100/70 border border-pink-300 rounded-lg text-xs font-semibold text-pink-800 leading-snug">
                          {booking.plan}
                        </span>

                        <div className="text-[11px] text-gray-500 font-light flex items-center gap-1">
                          <Clock className="w-3 h-3 text-pink-500 shrink-0" />
                          <span>Question to be asked directly on call</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Submitted At (Visible on tablet/desktop) */}
                    <td className="p-3 sm:p-4 align-top hidden md:table-cell text-xs text-gray-600">
                      <div className="flex items-center gap-1 font-medium text-gray-800">
                        <Calendar className="w-3 h-3 text-pink-500 shrink-0" />
                        <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {new Date(booking.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* 4. Status */}
                    <td className="p-3 sm:p-4 align-top">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Done</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* 5. Actions */}
                    <td className="p-3 sm:p-4 align-top text-right">
                      <div className="inline-flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                        {/* Complete / Reopen */}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleComplete(booking.id)}
                          className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCompleted
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          } disabled:opacity-50`}
                          title={isCompleted ? "Reopen as pending" : "Mark as completed"}
                        >
                          {isCompleted ? (
                            <>
                              <RotateCcw className="w-3 h-3 text-gray-500" />
                              <span>Reopen</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                              <span>Done</span>
                            </>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setDeleteConfirmId(booking.id)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all hover:border-rose-300 disabled:opacity-50 cursor-pointer"
                          title="Delete booking"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                  <span className="text-3xl block mb-2">🔮</span>
                  No bookings found in this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
