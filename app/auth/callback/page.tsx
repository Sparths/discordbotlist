"use client";

import { createClientComponent } from "@/contexts/supabase-auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponent();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSessionFromStorage();

      if (error) {
        console.error("Error handling auth callback:", error);
        router.push("/auth/error");
        return;
      }

      // Redirect to dashboard or desired page
      router.push("/dashboard");
    };

    handleAuthCallback();
  }, [router, supabase]);

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
