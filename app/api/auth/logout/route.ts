import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient({
    cookieStore,
    cookieOptions: {
      server: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  });

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }

  // Clear all cookies
  const response = NextResponse.json({ success: true });
  response.cookies.delete("sb-access-token");
  response.cookies.delete("sb-refresh-token");

  return response;
}
