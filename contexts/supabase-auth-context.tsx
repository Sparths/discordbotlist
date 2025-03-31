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

// Define the profile type based on your database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Define the context type
type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
  refreshProfile: async () => {},
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClientComponent());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch the user's profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  // Function to ensure the user profile exists
  const ensureUserProfile = async (userId: string) => {
    try {
      // First try to fetch the profile
      const existingProfile = await fetchUserProfile(userId);

      if (existingProfile) {
        setProfile(existingProfile);
        return;
      }

      // If no profile exists, create one based on auth data
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      // Get Discord identity data
      const identities = userData.user.identities;
      const discordIdentity = identities?.find(
        (identity) => identity.provider === "discord"
      );

      if (discordIdentity && discordIdentity.identity_data) {
        const { username, global_name, avatar_url, discriminator } =
          discordIdentity.identity_data;

        // Use global_name (display name) from Discord or fall back to username
        const displayName = global_name || username;

        // Create the profile
        const { data: newProfile, error } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            username: username,
            discriminator: discriminator || "0000",
            avatar_url: avatar_url,
            email: userData.user.email,
            display_name: displayName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating profile:", error);
        } else if (newProfile) {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
    }
  };

  // Function to allow manually refreshing the profile
  const refreshProfile = async () => {
    if (!user) return;

    const profileData = await fetchUserProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Ensure profile exists and fetch it
          await ensureUserProfile(session.user.id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Ensure profile exists and fetch it
        await ensureUserProfile(session.user.id);
      } else {
        setProfile(null);
      }

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
    } finally {
      setIsLoading(false);
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
        refreshProfile,
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
