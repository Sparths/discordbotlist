import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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

  await supabase.auth.getSession();

  return response;
}

export const config = {
  matcher: [
    // List your protected routes
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/favorites/:path*",
    "/developers/add-bot/:path*",
    "/developers/dashboard/:path*",
  ],
};
