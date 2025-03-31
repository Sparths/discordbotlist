"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bot, Edit, Plus, Trash, Star, Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Sample data for user's bots
const userBots = [
  {
    id: 1,
    name: "ModeratorBot",
    description: "A powerful moderation bot with advanced features.",
    status: "Approved",
    views: 1245,
    servers: 532,
    rating: 4.8,
  },
  {
    id: 2,
    name: "MusicMaster",
    description: "The ultimate music experience for Discord.",
    status: "Pending",
    views: 320,
    servers: 0,
    rating: 0,
  },
  {
    id: 3,
    name: "LevelUp",
    description: "Comprehensive leveling system with customizable rank cards.",
    status: "Draft",
    views: 0,
    servers: 0,
    rating: 0,
  },
]

// Sample data for favorite bots
const favoriteBots = [
  {
    id: 5,
    name: "TicketMaster",
    description: "Advanced ticket system for support and applications.",
    rating: 4.7,
  },
  {
    id: 6,
    name: "AICompanion",
    description: "Intelligent AI chatbot with natural language processing.",
    rating: 4.9,
  },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("my-bots")

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-center">Welcome, {user?.username}!</h1>
          <p className="text-muted-foreground text-center">Manage your Discord bots and track their performance.</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-bots">My Bots</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="my-bots" className="space-y-6 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Bots</h2>
              <Link href="/developers/add-bot">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Bot
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userBots.map((bot) => (
                <Card key={bot.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{bot.name}</CardTitle>
                      <Badge
                        variant={
                          bot.status === "Approved" ? "default" : bot.status === "Pending" ? "secondary" : "outline"
                        }
                      >
                        {bot.status}
                      </Badge>
                    </div>
                    <CardDescription>{bot.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                        <Bot className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <span>Views:</span>
                            <span className="font-medium">{bot.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Servers:</span>
                            <span className="font-medium">{bot.servers.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Rating:</span>
                            <span className="font-medium">{bot.rating > 0 ? `${bot.rating.toFixed(1)}/5` : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6 pt-4">
            <h2 className="text-xl font-bold">Your Favorite Bots</h2>
            {favoriteBots.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Browse bots and add them to your favorites for quick access.
                </p>
                <Link href="/bots">
                  <Button>Browse Bots</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteBots.map((bot) => (
                  <Card key={bot.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{bot.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                          <span className="text-sm">{bot.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <CardDescription>{bot.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                          <Bot className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Link href={`/bots/${bot.id}`} className="flex-1">
                        <Button variant="default" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" className="ml-2">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 pt-4">
            <h2 className="text-xl font-bold">Bot Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Total Views", value: "5,432" },
                { title: "Total Servers", value: "1,245" },
                { title: "Average Rating", value: "4.7/5" },
                { title: "Feature Requests", value: "23" },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>View your bots' performance metrics over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Analytics Chart Placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

