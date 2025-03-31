// app/api/auth/logout/route.ts (Improved version)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }

  // Clear all auth-related cookies
  const response = NextResponse.json({ success: true });

  // Explicitly clear known auth cookies
  response.cookies.delete("sb-access-token");
  response.cookies.delete("sb-refresh-token");
  response.cookies.delete("sb-provider-token");
  response.cookies.delete("sb-auth-token");

  // Also clear any session cookies
  response.cookies.delete("__session");
  response.cookies.delete("supabase-auth-token");

  return response;
}
