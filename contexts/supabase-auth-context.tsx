"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { Database } from "@/types/database.types";
import type { Session, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClientComponent() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClientComponent());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Initial session check
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };

    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider
      value={{
        supabase,
        session,
        user,
        isAuthenticated: !!user,
        signIn: async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              scopes: "identify email", // Specify required scopes
            },
          });
          if (error) {
            console.error("Sign in error", error);
            throw error; // Allows caller to handle the error
          }
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Sign out error", error);
            throw error;
          }
          // Optional: additional cleanup or redirection
          window.location.href = "/"; // Redirect to home page after logout
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

import { createContext, useContext } from "react";

type ContextType = {
  supabase: ReturnType<typeof createClientComponent>;
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Context = createContext<ContextType>({
  supabase: createClientComponent(),
  session: null,
  user: null,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const useSupabase = () => useContext(Context);
