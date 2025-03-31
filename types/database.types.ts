// types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bots: {
        Row: {
          id: number;
          name: string;
          description: string;
          short_description: string;
          avatar_url: string | null;
          prefix: string;
          category: string;
          tags: string[];
          verified: boolean;
          premium: boolean;
          rating: number;
          servers: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          short_description: string;
          avatar_url?: string | null;
          prefix: string;
          category: string;
          tags: string[];
          verified?: boolean;
          premium?: boolean;
          rating?: number;
          servers?: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          short_description?: string;
          avatar_url?: string | null;
          prefix?: string;
          category?: string;
          tags?: string[];
          verified?: boolean;
          premium?: boolean;
          rating?: number;
          servers?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: number;
          user_id: string;
          bot_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          bot_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          bot_id?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          user_id: string;
          bot_id: number;
          rating: number;
          comment: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          bot_id: number;
          rating: number;
          comment: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          bot_id?: number;
          rating?: number;
          comment?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bot_commands: {
        Row: {
          id: number;
          bot_id: number;
          name: string;
          description: string;
          usage: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          bot_id: number;
          name: string;
          description: string;
          usage: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          bot_id?: number;
          name?: string;
          description?: string;
          usage?: string;
          category?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          discriminator: string;
          avatar_url: string | null;
          email: string | null;
          display_name: string | null;
          bio: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          discriminator: string;
          avatar_url?: string | null;
          email?: string | null;
          display_name?: string | null;
          bio?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          discriminator?: string;
          avatar_url?: string | null;
          email?: string | null;
          display_name?: string | null;
          bio?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
