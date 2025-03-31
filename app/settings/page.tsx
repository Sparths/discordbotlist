"use client";

import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/contexts/supabase-auth-context";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Bell, Lock, User, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  const getDiscordAvatar = () => {
    if (!user?.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="danger">
              <Shield className="mr-2 h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  This information is imported from your Discord account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={getDiscordAvatar() || ""}
                      alt={user?.username}
                    />
                    <AvatarFallback className="text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium text-lg">
                      {user?.username}#{user?.discriminator}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your avatar and username are managed through Discord.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="display-name">
                      Display Name (Optional)
                    </Label>
                    <Input
                      id="display-name"
                      placeholder="Enter a custom display name"
                    />
                    <p className="text-sm text-muted-foreground">
                      This name will be shown instead of your Discord username.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-sm text-muted-foreground">
                      This will be displayed on your public profile.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>
                  Control what information is visible on your public profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">
                      Your email will be visible to other users.
                    </p>
                  </div>
                  <Switch id="show-email" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-bots">Show My Bots</Label>
                    <p className="text-sm text-muted-foreground">
                      Your bots will be displayed on your public profile.
                    </p>
                  </div>
                  <Switch id="show-bots" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-reviews">Show My Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Your reviews will be displayed on your public profile.
                    </p>
                  </div>
                  <Switch id="show-reviews" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Privacy Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Types</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bot-updates">Bot Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates about your bots (approvals, rejections, etc.)
                      </p>
                    </div>
                    <Switch id="bot-updates" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reviews">Reviews</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone reviews your bots
                      </p>
                    </div>
                    <Switch id="reviews" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        News, updates, and promotions
                      </p>
                    </div>
                    <Switch id="marketing" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    Discord Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your account is linked to Discord. You can only sign in
                    using Discord.
                  </p>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                    <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 71 55"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Discord</div>
                      <div className="text-xs text-muted-foreground">
                        Connected as {user?.username}#{user?.discriminator}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        Connected
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Session Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your active sessions and sign out from other devices.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted">
                      <div className="text-sm">
                        <div className="font-medium">Current Session</div>
                        <div className="text-xs text-muted-foreground">
                          Chrome on Windows • Active now
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        Current
                      </Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Sign Out All Other Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  These actions are irreversible. Please proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sign Out</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out from your current session.
                  </p>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
