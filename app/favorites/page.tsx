"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BotCard } from "@/app/components/bot-card"
import { Heart, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Sample data for favorite bots
const favoriteBots = [
  {
    id: 1,
    name: "ModeratorBot",
    description: "A powerful moderation bot with advanced features to keep your server safe and organized.",
    tags: ["Ban Command", "Kick Command", "Auto-Moderation", "Anti-Spam", "Logging System"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: false,
    rating: 4.8,
    servers: 15420,
    category: "Moderation",
  },
  {
    id: 5,
    name: "TicketMaster",
    description: "Advanced ticket system for support, applications, and more with customizable forms.",
    tags: ["Ticket System", "Custom Forms", "Support System", "Staff Management"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: false,
    rating: 4.7,
    servers: 12840,
    category: "Utility",
  },
  {
    id: 6,
    name: "AICompanion",
    description: "Intelligent AI chatbot with natural language processing and custom responses.",
    tags: ["AI Chatbot", "GPT Integration", "Custom Responses", "Conversation Memory"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: true,
    rating: 4.9,
    servers: 9870,
    category: "AI & Advanced",
  },
]

export default function FavoritesPage() {
  const { isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your favorites...</p>
      </div>
    )
  }

  // Filter bots based on search query
  const filteredBots = favoriteBots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            <span className="brand-gradient-text">Your Favorite Bots</span>
          </h1>
          <p className="text-muted-foreground text-center">Manage your favorite Discord bots for quick access.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your favorites..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto whitespace-nowrap">
            <Filter className="mr-2 h-4 w-4" />
            Filter by Category
          </Button>
        </div>

        {filteredBots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorites found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? `No favorites matching "${searchQuery}". Try a different search term.`
                : "You haven't added any bots to your favorites yet."}
            </p>
            <Link href="/bots">
              <Button className="btn-primary-gradient">Browse Bots</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

