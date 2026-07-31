import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";
import { supabaseAdmin } from "@/lib/supabase";
import { logoutAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Fetch bookings from Supabase
  const { data: bookings, error: bookingsError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
    
  // Fetch reviews from Supabase
  const { data: reviews, error: reviewsError } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0D0B1E] text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-[#7B2FF7]/30 pb-6">
          <div>
            <h1 className="text-3xl font-serif text-[#D4AF37] mb-2">Superadmin Dashboard</h1>
            <p className="text-gray-400">Manage your tarot reading bookings and client reviews.</p>
          </div>
          <form action={logoutAdmin}>
            <button 
              type="submit" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
            >
              Logout
            </button>
          </form>
        </header>

        <div className="mb-12">
          <h2 className="text-2xl font-serif text-[#E8CC6F] mb-6">Booking Requests</h2>
          {bookingsError ? (
            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
              Error loading bookings: {bookingsError.message}
              <br/>
              <span className="text-sm opacity-80 mt-2 block">Make sure you have created the `bookings` table in Supabase!</span>
            </div>
          ) : (
            <div className="bg-[#1A1642] border border-[#7B2FF7]/30 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b border-white/5 font-medium">Date</th>
                    <th className="p-4 border-b border-white/5 font-medium">Name</th>
                    <th className="p-4 border-b border-white/5 font-medium">Email</th>
                    <th className="p-4 border-b border-white/5 font-medium">Plan</th>
                    <th className="p-4 border-b border-white/5 font-medium max-w-xs">Question</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-300 whitespace-nowrap text-sm">
                          {new Date(booking.created_at).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleTimeString()}</span>
                        </td>
                        <td className="p-4 font-medium text-[#E8CC6F] whitespace-nowrap">
                          {booking.name}
                        </td>
                        <td className="p-4 text-gray-300 whitespace-nowrap">
                          <a href={`mailto:${booking.email}`} className="hover:text-white transition-colors">
                            {booking.email}
                          </a>
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 bg-[#7B2FF7]/20 border border-[#7B2FF7]/30 rounded-full text-xs font-semibold text-[#9B63F8] whitespace-nowrap">
                            {booking.plan}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-sm min-w-[300px]">
                          {booking.question}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                        No bookings yet. When users submit the form, they will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-serif text-[#E8CC6F] mb-6">Client Reviews</h2>
          {reviewsError ? (
            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
              Error loading reviews: {reviewsError.message}
              <br/>
              <span className="text-sm opacity-80 mt-2 block">Make sure you have created the `reviews` table in Supabase!</span>
            </div>
          ) : (
            <div className="bg-[#1A1642] border border-[#7B2FF7]/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4 border-b border-white/5 font-medium">Date</th>
                      <th className="p-4 border-b border-white/5 font-medium">Name</th>
                      <th className="p-4 border-b border-white/5 font-medium">Rating</th>
                      <th className="p-4 border-b border-white/5 font-medium w-full">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <tr key={review.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-gray-300 whitespace-nowrap text-sm">
                            {new Date(review.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-medium text-[#E8CC6F] whitespace-nowrap">
                            {review.name}
                          </td>
                          <td className="p-4 text-gray-300 whitespace-nowrap">
                            <div className="flex gap-1 text-[#D4AF37]">
                              {review.rating} / 5
                            </div>
                          </td>
                          <td className="p-4 text-gray-400 text-sm min-w-[300px]">
                            {review.review}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                          No reviews yet. When users submit reviews, they will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
