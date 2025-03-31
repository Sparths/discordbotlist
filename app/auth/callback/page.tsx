// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the page loads, handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the auth code from the URL
      const code = searchParams.get("code");

      if (code) {
        try {
          // Exchange code for session (Supabase handles this automatically)
          // We just need to handle successful auth
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error);
            router.push("/auth/error?error=session_error");
            return;
          }

          if (data.session) {
            // Check if user has a profile, create one if not
            const userId = data.session.user.id;
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single();

            if (profileError && profileError.code === "PGRST116") {
              // Profile doesn't exist, create it from Discord user data
              const { user } = data.session;

              // Get Discord user metadata
              const discordData = user.user_metadata;

              if (discordData) {
                await supabase.from("profiles").insert({
                  id: userId,
                  username: discordData.name || discordData.user_name || "User",
                  discriminator: discordData.full_name?.split("#")[1] || "0000",
                  avatar_url: discordData.avatar_url,
                  email: user.email,
                  is_verified: user.email_confirmed_at ? true : false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
              }
            }

            // Redirect to dashboard
            router.push("/dashboard");
          } else {
            router.push("/auth/login");
          }
        } catch (err) {
          console.error("Auth callback error:", err);
          router.push("/auth/error?error=server_error");
        }
      } else {
        // No code in URL
        router.push("/auth/error?error=invalid_state");
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
