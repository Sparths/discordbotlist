"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bot, ArrowRight, Zap, Filter, TrendingUp } from "lucide-react"
import { BotCard } from "./components/bot-card"
import { SearchForm } from "./components/search-form"

// Sample data for featured bots
const featuredBots = [
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
  },
]

// Sample data for trending tags
const trendingTags = [
  { name: "AI Chatbot", trend: "+120%" },
  { name: "Reaction Roles", trend: "+85%" },
  { name: "Ticket System", trend: "+62%" },
  { name: "Verification System", trend: "+45%" },
  { name: "Economy System", trend: "+38%" },
]

// Function to get a random tag badge style
const getTagBadgeClass = (index: number) => {
  const classes = [
    "tag-badge-primary",
    "tag-badge-secondary",
    "tag-badge-purple",
    "tag-badge-blue",
    "tag-badge-pink",
    "tag-badge-green",
    "tag-badge-orange",
  ]
  return classes[index % classes.length]
}

export default function Home() {
  // Function to handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get("search") as string

    // Redirect to the bots page with the search query
    window.location.href = `/bots?search=${encodeURIComponent(searchQuery)}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-subtle">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find the Perfect <span className="brand-gradient-text">Discord Bot</span> for Your Server
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Compare features, functionality, and find exactly what you need with our comprehensive tag-based search
                system.
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <SearchForm />
              <div className="flex justify-end">
                <Link href="/bots">
                  <Button variant="outline" className="whitespace-nowrap">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced Filters
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                "Ban Command",
                "Leveling System",
                "Music Player",
                "Reaction Roles",
                "Ticket System",
                "Economy System",
                "AI Chatbot",
                "+ More Features",
              ].map((tag, index) => (
                <Link key={tag} href={`/bots?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className={getTagBadgeClass(index)}>
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tags Section */}
      <section className="w-full py-8 bg-background border-y">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-primary font-medium whitespace-nowrap">
              <TrendingUp className="h-4 w-4" />
              Trending Tags
            </div>
            {trendingTags.map((tag, index) => (
              <Link key={tag.name} href={`/bots?tag=${encodeURIComponent(tag.name)}`}>
                <div
                  className={`flex items-center gap-2 ${getTagBadgeClass(index)} rounded-full px-3 py-1 text-sm whitespace-nowrap`}
                >
                  <span>{tag.name}</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                    {tag.trend}
                  </Badge>
                </div>
              </Link>
            ))}
            <Link href="/tags/trending" className="text-primary text-sm font-medium whitespace-nowrap">
              View All Trending Tags
              <ArrowRight className="inline ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Bots */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <span className="brand-gradient-text">Featured Bots</span>
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover top-rated Discord bots with the features you need.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredBots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/bots">
              <Button
                variant="outline"
                className="gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
              >
                View All Bots
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 bg-gradient-subtle">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find and compare Discord bots in three simple steps.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm brand-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Search by Tags</h3>
              <p className="text-muted-foreground text-center">
                Use our comprehensive tag system to find bots with specific features you need.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm brand-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Select Bots</h3>
              <p className="text-muted-foreground text-center">
                Choose multiple bots that match your requirements for comparison.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm brand-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full animated-gradient text-white">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Compare Features</h3>
              <p className="text-muted-foreground text-center">
                See a side-by-side comparison of features to find the perfect bot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">For Developers</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">List Your Discord Bot</h2>
              <p className="text-muted-foreground md:text-xl">
                Showcase your bot's features to thousands of potential users. Add descriptions, images, and tag all your
                bot's functions.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/developers/register">
                  <Button className="btn-primary-gradient">Add Your Bot</Button>
                </Link>
                <Link href="/developers/dashboard">
                  <Button
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    Developer Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg border bg-card p-8 shadow-sm w-full max-w-md brand-card">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Request New Tags</h3>
                    <p className="text-sm text-muted-foreground">
                      Don't see a tag for your bot's unique feature? Request a new one!
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Feature name" />
                    <Input placeholder="Brief description" />
                    <Button className="w-full btn-primary-gradient">Submit Request</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

