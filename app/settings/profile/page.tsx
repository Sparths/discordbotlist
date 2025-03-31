"use client";

import ProfileDisplay from "@/app/components/profile-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account profile and how you appear on DiscordBotList.
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <User className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <ProfileDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
