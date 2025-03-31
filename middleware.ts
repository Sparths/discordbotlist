import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient({
    request,
    response,
    cookieOptions: {
      server: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Optional: Add custom logic based on session

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Optionally redirect to an error page or handle the error differently
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/favorites/:path*",
    "/developers/add-bot/:path*",
    "/developers/dashboard/:path*",
  ],
};
