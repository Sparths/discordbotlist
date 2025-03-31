// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // If no code is present, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const cookieStore = await cookies(); // Await the cookies function
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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL("/auth/error?error=server_error", request.url)
      );
    }

    // After successful authentication, update the user's profile in the database
    if (data.user) {
      // Get user identity data from Discord
      const identities = data.user.identities;
      const discordIdentity = identities?.find(
        (identity) => identity.provider === "discord"
      );

      if (discordIdentity && discordIdentity.identity_data) {
        // Extract all needed values, ensuring username is not null
        const { username, global_name, avatar_url, email, discriminator } =
          discordIdentity.identity_data;

        // Ensure username is never null by providing fallbacks
        const usernameValue =
          username || global_name || email?.split("@")[0] || "User";

        // Use global_name (display name) from Discord or fall back to username
        const displayName = global_name || username;

        try {
          // Update the user profile in the database
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: data.user.id,
                username: usernameValue, // Use the validated username that won't be null
                discriminator: discriminator || "0000",
                avatar_url: avatar_url,
                email: email,
                display_name: displayName,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "id",
                ignoreDuplicates: false,
              }
            );

          if (profileError) {
            console.error("Error updating user profile:", profileError);
          }
        } catch (profileUpdateError) {
          console.error("Exception in profile update:", profileUpdateError);
        }
      }
    }

    // Instead of redirecting, return success since the page component will handle the redirect
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=unknown", request.url)
    );
  }
}
