"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useContext, createContext, useState, useEffect } from "react";
import { Database } from "@/types/database.types";
import type { Session, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const REDIRECT_URL = process.env.NEXT_PUBLIC_APP_URL + "/auth/callback";

export function createClientComponent() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Define the context type
type AuthContextType = {
  user: User | null;
  profile: any | null; // Replace 'any' with your profile type if available
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signInWithDiscord: async () => {},
  signOut: async () => {},
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClientComponent());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    fetchSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithDiscord = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: REDIRECT_URL,
          scopes: "identify email",
        },
      });

      if (error) {
        console.error("OAuth Sign In Error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Unexpected OAuth Error:", error);
      setIsLoading(false);
      // Optionally show user-friendly error toast
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error", error);
        throw error;
      }
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
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

// Export the useAuth hook
export function useAuth() {
  return useContext(AuthContext);
}
