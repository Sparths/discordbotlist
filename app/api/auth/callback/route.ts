import { type NextRequest, NextResponse } from "next/server"
import type { DiscordTokenResponse, DiscordUser } from "@/types/auth"

// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const DISCORD_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  // Verify state to prevent CSRF attacks
  const storedState = request.cookies.get("discord_oauth_state")?.value

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/auth/error?error=invalid_state", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code: ${tokenResponse.statusText}`)
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json()

    // Fetch user data
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.statusText}`)
    }

    const discordUser: DiscordUser = await userResponse.json()

    // Create or update user in your database
    // For this example, we'll just store the user in a session cookie
    const user = {
      id: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
      email: discordUser.email,
      verified: discordUser.verified,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Create session
    const session = {
      user,
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    }

    // Store session in a cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url))

    response.cookies.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=server_error", request.url))
  }
}

