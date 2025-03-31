"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { BotCard } from "@/app/components/bot-card"

// Sample data for bots
const sampleBots = [
  {
    id: 1,
    name: "ModeratorBot",
    description: "A powerful moderation bot with advanced features to keep your server safe and organized.",
    tags: ["Ban Command", "Auto-Moderation", "Anti-Spam", "Logging System"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: false,
    rating: 4.8,
    servers: 15420,
    category: "Moderation",
  },
  {
    id: 2,
    name: "MusicMaster",
    description: "The ultimate music experience for Discord with high-quality audio and extensive playlist support.",
    tags: ["Music Player", "Playlist Support", "Spotify Integration", "Audio Filters"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: true,
    rating: 4.9,
    servers: 32150,
    category: "Music",
  },
  {
    id: 3,
    name: "LevelUp",
    description: "Comprehensive leveling system with customizable rank cards, role rewards, and leaderboards.",
    tags: ["Leveling System", "Rank Cards", "Role Rewards", "Leaderboards"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: false,
    premium: false,
    rating: 4.6,
    servers: 8750,
    category: "Economy & Leveling",
  },
  {
    id: 4,
    name: "EconomyPro",
    description: "Complete economy system with currency, shops, jobs, gambling, and more.",
    tags: ["Currency System", "Shop System", "Work Commands", "Gambling"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: false,
    premium: true,
    rating: 4.5,
    servers: 6230,
    category: "Economy & Leveling",
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
  {
    id: 7,
    name: "GiveawayBot",
    description: "Create and manage giveaways with customizable requirements and multiple winners.",
    tags: ["Giveaways", "Raffles", "Contests", "Role Requirements"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: false,
    rating: 4.7,
    servers: 18650,
    category: "Social & Community",
  },
  {
    id: 8,
    name: "ReactionRoles",
    description: "Easily set up reaction roles with customizable messages and multiple role options.",
    tags: ["Reaction Roles", "Role Management", "Custom Embeds", "Button Roles"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: false,
    premium: true,
    rating: 4.6,
    servers: 9240,
    category: "Administration",
  },
  {
    id: 9,
    name: "WelcomeBot",
    description: "Customize welcome and goodbye messages with images, embeds, and more.",
    tags: ["Welcome Messages", "Goodbye Messages", "Custom Images", "Member Counter"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
    premium: false,
    rating: 4.5,
    servers: 7830,
    category: "Social & Community",
  },
  {
    id: 10,
    name: "PollMaster",
    description: "Create advanced polls with multiple options, timers, and result tracking.",
    tags: ["Polls", "Voting", "Surveys", "Scheduled Events"],
    avatar: "/placeholder.svg?height=80&width=80",
    verified: false,
    premium: false,
    rating: 4.4,
    servers: 5120,
    category: "Fun & Games",
  },
]

// Category descriptions
const categoryDescriptions = {
  moderation: {
    title: "Moderation Bots",
    description: "Keep your server safe and organized with powerful moderation tools.",
    icon: "🛡️",
  },
  music: {
    title: "Music Bots",
    description: "Enhance your voice channels with high-quality music and audio features.",
    icon: "🎵",
  },
  utility: {
    title: "Utility Bots",
    description: "Add useful tools and commands to improve your server functionality.",
    icon: "🔧",
  },
  "fun-games": {
    title: "Fun & Games Bots",
    description: "Entertain your members with games, memes, and interactive activities.",
    icon: "🎮",
  },
  "economy-leveling": {
    title: "Economy & Leveling Bots",
    description: "Implement currency systems, leveling, and rewards for your members.",
    icon: "💰",
  },
  "social-community": {
    title: "Social & Community Bots",
    description: "Build a stronger community with social features and engagement tools.",
    icon: "👥",
  },
  administration: {
    title: "Administration Bots",
    description: "Manage your server efficiently with advanced administration features.",
    icon: "⚙️",
  },
  "ai-advanced": {
    title: "AI & Advanced Bots",
    description: "Leverage artificial intelligence and cutting-edge features for your server.",
    icon: "🤖",
  },
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [categoryInfo, setCategoryInfo] = useState<any>(null)
  const [categoryBots, setCategoryBots] = useState<any[]>([])
  const slug = params.slug as string

  useEffect(() => {
    // Convert slug to category name
    let categoryName = ""

    if (slug === "moderation") {
      categoryName = "Moderation"
    } else if (slug === "music") {
      categoryName = "Music"
    } else if (slug === "utility") {
      categoryName = "Utility"
    } else if (slug === "fun-games") {
      categoryName = "Fun & Games"
    } else if (slug === "economy-leveling") {
      categoryName = "Economy & Leveling"
    } else if (slug === "social-community") {
      categoryName = "Social & Community"
    } else if (slug === "administration") {
      categoryName = "Administration"
    } else if (slug === "ai-advanced") {
      categoryName = "AI & Advanced"
    } else {
      // Redirect to 404 if category doesn't exist
      router.push("/404")
      return
    }

    // Set category info
    setCategoryInfo(categoryDescriptions[slug])

    // Filter bots by category
    const filteredBots = sampleBots.filter((bot) => bot.category.toLowerCase() === categoryName.toLowerCase())
    setCategoryBots(filteredBots)
  }, [slug, router])

  if (!categoryInfo) {
    return <div className="container py-12 text-center">Loading...</div>
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/bots">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to All Bots
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4 py-6">
          <div className="text-4xl mb-2">{categoryInfo.icon}</div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="brand-gradient-text">{categoryInfo.title}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{categoryInfo.description}</p>
        </div>

        {categoryBots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bots found in this category.</p>
            <Link href="/bots">
              <Button className="mt-4 btn-primary-gradient">Browse All Bots</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryBots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

