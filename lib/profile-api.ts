// lib/profile-api.ts
import { supabase } from "./supabase";
import { Database } from "@/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Get user profile by ID
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data;
}

// Update user profile
export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return data;
}

// Get user statistics (total bots, reviews, favorites)
export async function getUserStatistics(userId: string) {
  // Get bot count
  const { count: botCount, error: botError } = await supabase
    .from("bots")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (botError) {
    console.error("Error fetching bot count:", botError);
    throw botError;
  }

  // Get review count
  const { count: reviewCount, error: reviewError } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (reviewError) {
    console.error("Error fetching review count:", reviewError);
    throw reviewError;
  }

  // Get favorite count
  const { count: favoriteCount, error: favoriteError } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (favoriteError) {
    console.error("Error fetching favorite count:", favoriteError);
    throw favoriteError;
  }

  return {
    botCount: botCount || 0,
    reviewCount: reviewCount || 0,
    favoriteCount: favoriteCount || 0,
  };
}

// Get user reviews
export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      bots (
        id,
        name,
        avatar_url,
        category
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }

  return data;
}

// Check if profile exists
export async function checkProfileExists(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking profile:", error);
    throw error;
  }

  return !!data;
}

// Create default profile for user if it doesn't exist
export async function createDefaultProfile(userId: string, userData: any) {
  // Check if profile already exists
  const exists = await checkProfileExists(userId);

  if (exists) {
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username: userData.username || userData.name || "User",
      discriminator: userData.discriminator || "0000",
      avatar_url: userData.avatar_url,
      email: userData.email,
      is_verified: !!userData.email_confirmed_at,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating profile:", error);
    throw error;
  }

  return data;
}
