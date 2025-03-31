import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Session } from "@/types/auth";

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Transform Supabase session to our custom Session type
  const customSession: Session = {
    user: {
      id: session.user.id,
      username:
        session.user.user_metadata.username ??
        session.user.email?.split("@")[0],
      discriminator: session.user.user_metadata.discriminator ?? "0000",
      avatar: session.user.user_metadata.avatar_url,
      email: session.user.email,
      createdAt: new Date(session.user.created_at),
      updatedAt: new Date(),
    },
    accessToken: session.access_token,
    expiresAt: Date.now() + session.expires_in * 1000,
  };

  return NextResponse.json(customSession);
}
