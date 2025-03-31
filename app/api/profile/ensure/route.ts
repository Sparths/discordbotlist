// app/api/profile/ensure/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
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
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  try {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    // If profile doesn't exist, create one based on auth data
    if (!existingProfile) {
      // Get Discord identity data
      const identities = user.identities;
      const discordIdentity = identities?.find(
        (identity) => identity.provider === "discord"
      );

      if (discordIdentity && discordIdentity.identity_data) {
        const { username, global_name, avatar_url, discriminator } =
          discordIdentity.identity_data;

        // Use global_name (display name) from Discord or fall back to username
        const displayName = global_name || username;

        // Create the profile
        const { error: createError } = await supabase.from("profiles").insert({
          id: user.id,
          username: username,
          discriminator: discriminator || "0000",
          avatar_url: avatar_url,
          email: user.email,
          display_name: displayName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          throw createError;
        }

        return NextResponse.json({
          message: "Profile created successfully",
          created: true,
        });
      }
    }

    return NextResponse.json({
      message: "Profile exists",
      created: false,
    });
  } catch (error) {
    console.error("Error ensuring profile exists:", error);
    return NextResponse.json(
      { error: "Failed to ensure profile exists" },
      { status: 500 }
    );
  }
}
