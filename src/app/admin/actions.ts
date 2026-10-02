"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUsernames = ["admin", "softtarotgirl", "nidhi"];
  const validPasswords = ["softtarotgirl22", "admin123", "softtarot2026"];

  if (
    validUsernames.includes(username?.trim().toLowerCase()) &&
    validPasswords.includes(password?.trim())
  ) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid Admin ID or Password. Please try again." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
}
