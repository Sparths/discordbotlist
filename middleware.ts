import { type NextRequest, NextResponse } from "next/server"
import type { Session } from "./types/auth"

// Define which routes require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/favorites"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isProtectedRoute) {
    // Check if user is authenticated
    const sessionCookie = request.cookies.get("session")?.value

    if (!sessionCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      const session: Session = JSON.parse(sessionCookie)

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        // Session expired, redirect to login
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }
    } catch (error) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/favorites/:path*"],
}

