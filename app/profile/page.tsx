"use client";

import { useAuth } from "@/contexts/supabase-auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Calendar, Edit, Shield, User, Star, Heart } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
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
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <Card className="flex-1">
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 right-4">
                <Link href="/settings">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={getDiscordAvatar() || ""}
                    alt={user?.username}
                  />
                  <AvatarFallback className="text-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user?.username}</CardTitle>
                <CardDescription>#{user?.discriminator}</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#5865F2] text-white"
                  >
                    Discord User
                  </Badge>
                  {user?.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500 text-white"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Bots</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined</span>
                  <span className="ml-auto">January 2023</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">User ID</span>
                  <span className="ml-auto font-mono text-xs">{user?.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role</span>
                  <span className="ml-auto">Bot Developer</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Your activity and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bot Submissions</span>
                    <span className="text-sm">3</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[60%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reviews Written</span>
                    <span className="text-sm">12</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[80%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Feature Requests
                    </span>
                    <span className="text-sm">5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[40%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Community Reputation
                    </span>
                    <span className="text-sm">Good</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-green-500 w-[75%]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Added a new bot:{" "}
                      <span className="font-medium">MusicMaster</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Reviewed:{" "}
                      <span className="font-medium">TicketMaster</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Favorited:{" "}
                      <span className="font-medium">AICompanion</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="bots" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bots">My Bots</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="bots" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((bot) => (
                <Card key={bot} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>ModeratorBot #{bot}</CardTitle>
                    <CardDescription>
                      A powerful moderation bot with advanced features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="tag-badge-primary">
                        Ban Command
                      </Badge>
                      <Badge variant="outline" className="tag-badge-secondary">
                        Auto-Moderation
                      </Badge>
                      <Badge variant="outline" className="tag-badge-blue">
                        +3 more
                      </Badge>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Link href={`/bots/${bot}`}>
                      <Button
                        variant="default"
                        className="w-full btn-primary-gradient"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
                <CardDescription>
                  Reviews you've written for bots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div
                      key={review}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">TicketMaster</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= 4
                                  ? "fill-yellow-500 text-yellow-500"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great bot with lots of features. The ticket system works
                        flawlessly and has saved me a lot of time managing
                        support requests.
                      </p>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>2 weeks ago</span>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Edit Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((bot) => (
                <Card key={bot} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>AICompanion #{bot}</CardTitle>
                    <CardDescription>
                      Intelligent AI chatbot with natural language processing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="tag-badge-primary">
                        AI Chatbot
                      </Badge>
                      <Badge variant="outline" className="tag-badge-secondary">
                        GPT Integration
                      </Badge>
                      <Badge variant="outline" className="tag-badge-blue">
                        +2 more
                      </Badge>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex gap-2">
                    <Link href={`/bots/${bot}`} className="flex-1">
                      <Button variant="default" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
