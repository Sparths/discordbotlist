"use client";

import { createClientComponent } from "@/contexts/supabase-auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponent();

  const handleAuthCallback = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        router.push("/auth/error");
        return;
      }

      // If session exists, redirect to dashboard
      if (data.session) {
        router.push("/dashboard");
      } else {
        // No session found, potentially show an error
        router.push("/auth/error");
      }
    } catch (catchError) {
      console.error("Unexpected error during auth callback:", catchError);
      router.push("/auth/error");
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          Completing authentication...
        </p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    </div>
  );
}
