// app/components/profile-display.tsx (Improved version)
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
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProfileDisplay() {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponent();

  useEffect(() => {
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    // Initialize displayName from profile when it's available
    if (profile) {
      setDisplayName(profile.display_name || profile.username || "");
      setLoading(false);
    } else {
      // If profile isn't available, try to fetch it
      const loadProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            setError("Failed to load profile information");
          } else if (data) {
            setDisplayName(data.display_name || data.username || "");
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      };

      loadProfile();
    }
  }, [user, profile, supabase]);

  const updateDisplayName = async () => {
    if (!user) return;

    try {
      setUpdating(true);

      // Validate
      if (!displayName.trim()) {
        toast({
          title: "Error",
          description: "Display name cannot be empty",
          variant: "destructive",
        });
        return;
      }

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

      // Refresh profile data
      await refreshProfile();
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
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage how your profile appears on DiscordBotList
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-[100px]" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()}>
              Retry Loading Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user || !profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Logged In</AlertTitle>
            <AlertDescription>
              You need to be logged in to view profile information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
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
        <Button
          onClick={updateDisplayName}
          disabled={updating || !displayName.trim()}
        >
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
