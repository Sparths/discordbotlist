"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponent } from "@/contexts/supabase-auth-context";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponent();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The actual auth exchange happens in the route.ts file
    // This component just handles the UI during the callback
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        // If we have a session, redirect to dashboard
        if (data.session) {
          router.push("/dashboard");
        } else {
          // If no session and no URL error, wait for the route handler
          setTimeout(() => {
            setLoading(false);
            // After timeout, check session again or show error
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                router.push("/dashboard");
              } else {
                setError("Authentication failed. Please try again.");
              }
            });
          }, 3000);
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    };

    checkSession();
  }, [supabase, router]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Completing authentication...
            </p>
          </>
        ) : error ? (
          <>
            <p className="text-red-500">{error}</p>
            <Button onClick={() => router.push("/auth/login")}>
              Return to Login
            </Button>
          </>
        ) : (
          <>
            <p className="mt-4 text-muted-foreground">
              Authentication complete! Redirecting...
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </>
        )}
        <Button variant="outline" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}
