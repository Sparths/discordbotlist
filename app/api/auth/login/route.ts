import { NextResponse } from "next/server";

// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_REDIRECT_URI = `https://fobhfzjqximhtnddjxrm.supabase.co/auth/v1/callback`;

export async function GET() {
  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);

  // Store state in a cookie for verification later
  const response = NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify%20email&state=${state}`
  );

  response.cookies.set("discord_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}
