// contexts/supabase-auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  signInWithDiscord: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Fix for contexts/supabase-auth-context.tsx
  // Add this modification to the useEffect hook

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error checking session:", error);
          return;
        }

        setSession(data.session);
        setUser(data.session?.user || null);

        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener with a more robust approach
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession);

        // Only update if there's a meaningful change
        if (
          (event === "SIGNED_IN" && !session) ||
          (event === "SIGNED_OUT" && session) ||
          event === "TOKEN_REFRESHED"
        ) {
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        }

        setIsLoading(false);
      }
    );

    // Set up a periodic session check
    const intervalId = setInterval(checkSession, 60000); // Check every minute

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Sign in with Discord OAuth
  const signInWithDiscord = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "identify email",
        },
      });

      if (error) {
        console.error("Discord sign in error:", error);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
        return;
      }

      setUser(null);
      setProfile(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        signInWithDiscord,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
