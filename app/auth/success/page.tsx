// app/auth/success/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientComponent } from "@/contexts/supabase-auth-context";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthSuccessPage() {
  const router = useRouter();
  const supabase = createClientComponent();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        setLoading(true);

        // Check for error in URL params
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get("error");
        const errorDescription = params.get("error_description");

        if (errorParam) {
          setError(errorDescription || `Authentication error: ${errorParam}`);
          setLoading(false);
          return;
        }

        // Check session status
        const { data, error } = await supabase.auth.getSession();

        if (data.session) {
          // We have a session - ensure profile exists before redirecting
          try {
            const response = await fetch("/api/profile/ensure", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              router.push("/dashboard");
            } else {
              setError("Failed to initialize user profile.");
            }
          } catch (profileError) {
            console.error("Profile initialization error:", profileError);
            setError("An error occurred while setting up your profile.");
          }
        } else if (error) {
          console.error("Session error:", error);
          setError(error.message || "Authentication failed. Please try again.");
        } else {
          // No session yet - listen for auth state change
          const authStateChange = supabase.auth.onAuthStateChange(
            (event, session) => {
              if (session) {
                router.push("/dashboard");
              } else if (event === "SIGNED_OUT") {
                setError("Authentication failed. Please try again.");
                setLoading(false);
              }
            }
          );

          // Set a maximum timeout
          const timeout = setTimeout(() => {
            setError("Authentication timed out. Please try again.");
            setLoading(false);
          }, 10000);

          return () => {
            authStateChange.data.subscription.unsubscribe();
            clearTimeout(timeout);
          };
        }
      } catch (err) {
        console.error("Error in auth success:", err);
        setError("Authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleAuthSuccess();
  }, [supabase, router]);

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => router.push("/auth/login")}>
              Return to Login
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
      </div>
    </div>
  );
}
