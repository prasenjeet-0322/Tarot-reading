"use server";

import { cookies } from "next/headers";

export async function loginAdmin(password: string) {
  if (password === "softtarotgirl22") {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
}
