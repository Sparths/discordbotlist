// app/api/auth/login/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  // Create a response first to have a cookie jar
  const response = NextResponse.next();

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
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

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
