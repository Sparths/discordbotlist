// app/auth/callback/route.ts (Improved version)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle error case
  if (error) {
    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", error);
    if (errorDescription) {
      errorUrl.searchParams.set("message", errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  // If no code is present, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const cookieStore = cookies();

  // Create a response early to have a cookie container
  const response = NextResponse.redirect(new URL(next, request.url));

  // Create supabase client with both the request and response cookie containers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookies on both the request and response
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

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=server_error&message=${encodeURIComponent(
            error.message
          )}`,
          request.url
        )
      );
    }

    // Return the response with cookies already set
    return response;
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=unknown", request.url)
    );
  }
}
