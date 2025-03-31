import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient({
    cookieStore,
    cookieOptions: {
      server: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      scopes: "identify email",
    },
  });

  if (error) {
    console.error("Server-side login error:", error);
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(error.message)}`)
    );
  }

  // Redirect to the OAuth provider's authentication page
  return NextResponse.redirect(data.url!);
}
