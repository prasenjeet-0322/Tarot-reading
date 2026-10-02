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
import { FaWhatsapp } from "react-icons/fa";

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
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1.5 p-1 bg-pink-100/60 rounded-full border border-pink-200">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
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
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
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
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
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
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-pink-50/70 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 whitespace-nowrap">Submitted At</th>
              <th className="p-4 whitespace-nowrap">Client Name</th>
              <th className="p-4 whitespace-nowrap">WhatsApp Contact</th>
              <th className="p-4 whitespace-nowrap">Plan & Slot</th>
              <th className="p-4 min-w-[240px]">Question & Notes</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings && filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => {
                const cleanPhone = booking.email?.replace(/[^0-9]/g, "");
                const isCompleted = booking.status === "completed";
                const isBusy = loadingId === booking.id;

                return (
                  <tr
                    key={booking.id}
                    className={`transition-colors ${
                      isCompleted ? "bg-emerald-50/25 hover:bg-emerald-50/40" : "hover:bg-pink-50/40"
                    }`}
                  >
                    {/* Submitted At */}
                    <td className="p-4 text-gray-600 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-gray-800">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                      <span className="text-[11px] text-gray-400 pl-5">
                        {new Date(booking.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Client Name */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`font-bold text-sm ${
                          isCompleted ? "text-gray-600 line-through decoration-emerald-500" : "text-gray-900"
                        }`}
                      >
                        {booking.name}
                      </span>
                    </td>

                    {/* WhatsApp Contact */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {booking.email}
                        </span>
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                              booking.name
                            )}!%20This%20is%20Nidhi%20from%20SoftTarotGirl%20regarding%20your%20Tarot%20Reading%20session.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold shadow-sm transition-all"
                            title="Open WhatsApp chat"
                          >
                            <FaWhatsapp className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Plan & Slot */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 bg-pink-100/70 border border-pink-300 rounded-full text-xs font-semibold text-pink-800 shadow-sm">
                        {booking.plan}
                      </span>
                    </td>

                    {/* Question & Notes */}
                    <td className="p-4 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                      {booking.question}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons: Mark Complete & Delete */}
                    <td className="p-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Toggle Complete Button */}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleComplete(booking.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>Complete</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setDeleteConfirmId(booking.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all hover:border-rose-300 disabled:opacity-50"
                          title="Delete booking"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400 italic">
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
