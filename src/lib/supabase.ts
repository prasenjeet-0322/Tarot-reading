import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for public operations (e.g. submitting a form)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin operations (e.g. fetching bookings)
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);
