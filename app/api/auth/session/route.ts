import { type NextRequest, NextResponse } from "next/server"
import type { Session } from "@/types/auth"

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const session: Session = JSON.parse(sessionCookie)

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Session expired, clear cookie
      const response = NextResponse.json({ error: "Session expired" }, { status: 401 })
      response.cookies.delete("session")
      return response
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Session parse error:", error)
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }
}

