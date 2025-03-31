// lib/bot-api.ts
import { supabase, createServerSupabaseClient } from "./supabase";
import { Database } from "@/types/database.types";

export type Bot = Database["public"]["Tables"]["bots"]["Row"];
export type BotInsert = Database["public"]["Tables"]["bots"]["Insert"];
export type BotUpdate = Database["public"]["Tables"]["bots"]["Update"];

export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type BotCommand = Database["public"]["Tables"]["bot_commands"]["Row"];

// Get all bots with optional filtering
export async function getAllBots({
  searchQuery,
  category,
  tags,
  verified,
  premium,
  minRating,
  sortBy = "servers",
  sortOrder = "desc",
  limit = 10,
  page = 1,
}: {
  searchQuery?: string;
  category?: string;
  tags?: string[];
  verified?: boolean;
  premium?: boolean;
  minRating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
}) {
  let query = supabase.from("bots").select("*", { count: "exact" });

  // Apply filters
  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`
    );
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (tags && tags.length > 0) {
    // Filter bots that have all the specified tags
    query = query.containsAllOf("tags", tags);
  }

  if (verified !== undefined) {
    query = query.eq("verified", verified);
  }

  if (premium !== undefined) {
    query = query.eq("premium", premium);
  }

  if (minRating) {
    query = query.gte("rating", minRating);
  }

  // Apply sorting
  if (sortBy && sortOrder) {
    query = query.order(sortBy, { ascending: sortOrder === "asc" });
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching bots:", error);
    throw error;
  }

  return { bots: data || [], count: count || 0 };
}

// Get a single bot by ID
export async function getBot(id: number) {
  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching bot:", error);
    throw error;
  }

  return data;
}

// Get bot commands
export async function getBotCommands(botId: number) {
  const { data, error } = await supabase
    .from("bot_commands")
    .select("*")
    .eq("bot_id", botId)
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching bot commands:", error);
    throw error;
  }

  return data;
}

// Get bot reviews
export async function getBotReviews(botId: number) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles:user_id (
        id,
        username,
        avatar_url
      )
    `
    )
    .eq("bot_id", botId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bot reviews:", error);
    throw error;
  }

  return data;
}

// Add a bot
export async function addBot(bot: BotInsert) {
  const { data, error } = await supabase
    .from("bots")
    .insert(bot)
    .select()
    .single();

  if (error) {
    console.error("Error adding bot:", error);
    throw error;
  }

  return data;
}

// Update a bot
export async function updateBot(id: number, updates: BotUpdate) {
  const { data, error } = await supabase
    .from("bots")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating bot:", error);
    throw error;
  }

  return data;
}

// Delete a bot
export async function deleteBot(id: number) {
  const { error } = await supabase.from("bots").delete().eq("id", id);

  if (error) {
    console.error("Error deleting bot:", error);
    throw error;
  }

  return true;
}

// Add bot commands
export async function addBotCommands(
  commands: Database["public"]["Tables"]["bot_commands"]["Insert"][]
) {
  const { data, error } = await supabase
    .from("bot_commands")
    .insert(commands)
    .select();

  if (error) {
    console.error("Error adding bot commands:", error);
    throw error;
  }

  return data;
}

// Get user's favorite bots
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      *,
      bots (*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }

  return data;
}

// Add bot to favorites
export async function addToFavorites(userId: string, botId: number) {
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      bot_id: botId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }

  return data;
}

// Remove bot from favorites
export async function removeFromFavorites(userId: string, botId: number) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ user_id: userId, bot_id: botId });

  if (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }

  return true;
}

// Check if a bot is in the user's favorites
export async function isBotFavorited(userId: string, botId: number) {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .match({ user_id: userId, bot_id: botId })
    .maybeSingle();

  if (error) {
    console.error("Error checking favorite status:", error);
    throw error;
  }

  return !!data;
}

// Add a review for a bot
export async function addReview(
  review: Database["public"]["Tables"]["reviews"]["Insert"]
) {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error("Error adding review:", error);
    throw error;
  }

  // Update the bot's average rating
  await updateBotRating(review.bot_id);

  return data;
}

// Update a review
export async function updateReview(
  id: number,
  updates: Partial<Database["public"]["Tables"]["reviews"]["Update"]>
) {
  const { data, error } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating review:", error);
    throw error;
  }

  // Update the bot's average rating
  const botId = data.bot_id;
  await updateBotRating(botId);

  return data;
}

// Delete a review
export async function deleteReview(id: number, botId: number) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error("Error deleting review:", error);
    throw error;
  }

  // Update the bot's average rating
  await updateBotRating(botId);

  return true;
}

// Utility function to update a bot's average rating
async function updateBotRating(botId: number) {
  const { data, error } = await supabase.rpc("calculate_bot_average_rating", {
    bot_id_param: botId,
  });

  if (error) {
    console.error("Error updating bot rating:", error);
    throw error;
  }

  return data;
}

// Get user's bots
export async function getUserBots(userId: string) {
  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user bots:", error);
    throw error;
  }

  return data;
}
