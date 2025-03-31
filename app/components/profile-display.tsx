"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/supabase-auth-context";
import { createClientComponent } from "@/contexts/supabase-auth-context";

export default function ProfileDisplay() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponent();

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user profile from the database
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data);
          setDisplayName(data.display_name || data.username || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, supabase, toast]);

  const updateDisplayName = async () => {
    if (!user) return;

    try {
      setUpdating(true);

      // Update the display name in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Display name updated successfully",
      });

      // Update local state
      setProfile({
        ...profile,
        display_name: displayName,
      });
    } catch (error) {
      console.error("Error updating display name:", error);
      toast({
        title: "Error",
        description: "Failed to update display name",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage how your profile appears on DiscordBotList
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="username">Discord Username</Label>
          <Input id="username" value={profile?.username || ""} disabled />
          <p className="text-sm text-muted-foreground">
            Your Discord username cannot be changed here.
          </p>
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter a custom display name"
          />
          <p className="text-sm text-muted-foreground">
            This name will be shown instead of your Discord username.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={updateDisplayName} disabled={updating || !displayName}>
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
