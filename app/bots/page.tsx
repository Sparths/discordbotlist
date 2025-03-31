"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Bot, Search, SlidersHorizontal, Grid, List, X } from "lucide-react"
import { TagSelector } from "../components/tag-selector"
import { BotCard } from "../components/bot-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample data for bots - Fixed to include Kick Command for ModeratorBot
const sampleBots = [
  {
    id: 1,
    name: "ModeratorBot",
    description: "A powerful moderation bot with advanced features to keep your server safe and organized.",
    tags: ["Ban Command", "Kick Command", "Mute Command", "Auto-Moderation", "Anti-Spam", "Logging System"],
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

export default function BotsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for UI controls
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [sortOption, setSortOption] = useState("popular")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBots, setSelectedBots] = useState<number[]>([])

  // State for filters
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [verifiedFilter, setVerifiedFilter] = useState<string | null>(null)
  const [premiumFilter, setPremiumFilter] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number | null>(null)

  // State for pagination
  const [page, setPage] = useState(1)
  const [botsPerPage] = useState(6)

  // Initialize state from URL parameters
  useEffect(() => {
    // Get search query from URL
    const searchFromUrl = searchParams.get("search")
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }

    // Get tag from URL
    const tagFromUrl = searchParams.get("tag")
    if (tagFromUrl) {
      setSelectedTags([tagFromUrl])
    }

    // Get category from URL
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl])
    }
  }, [searchParams])

  // Handle bot selection for comparison
  const handleBotSelection = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedBots((prev) => [...prev, id])
    } else {
      setSelectedBots((prev) => prev.filter((botId) => botId !== id))
    }
  }

  // Apply all filters and sorting to the bots
  const filteredAndSortedBots = useMemo(() => {
    // First apply search filter
    let result = sampleBots.filter((bot) => {
      if (searchQuery.trim() === "") return true

      const query = searchQuery.toLowerCase()
      return (
        bot.name.toLowerCase().includes(query) ||
        bot.description.toLowerCase().includes(query) ||
        bot.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })

    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter((bot) => selectedCategories.includes(bot.category))
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter((bot) => selectedTags.every((tag) => bot.tags.includes(tag)))
    }

    // Apply verification filter
    if (verifiedFilter === "verified") {
      result = result.filter((bot) => bot.verified)
    } else if (verifiedFilter === "unverified") {
      result = result.filter((bot) => !bot.verified)
    }

    // Apply premium filter
    if (premiumFilter === "premium") {
      result = result.filter((bot) => bot.premium)
    } else if (premiumFilter === "free") {
      result = result.filter((bot) => !bot.premium)
    }

    // Apply rating filter
    if (minRating !== null) {
      result = result.filter((bot) => bot.rating >= minRating)
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortOption) {
        case "popular":
          return b.servers - a.servers
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id - a.id // Using ID as a proxy for creation date
        case "oldest":
          return a.id - b.id
        case "servers":
          return b.servers - a.servers
        default:
          return 0
      }
    })
  }, [searchQuery, selectedTags, selectedCategories, verifiedFilter, premiumFilter, minRating, sortOption])

  // Get current page of bots
  const currentBots = useMemo(() => {
    const indexOfLastBot = page * botsPerPage
    const indexOfFirstBot = indexOfLastBot - botsPerPage
    return filteredAndSortedBots.slice(indexOfFirstBot, indexOfLastBot)
  }, [filteredAndSortedBots, page, botsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedTags, selectedCategories, verifiedFilter, premiumFilter, minRating])

  // Handle category checkbox changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  // Handle verification filter changes
  const handleVerificationChange = (type: string, checked: boolean) => {
    if (checked) {
      setVerifiedFilter(type)
    } else if (verifiedFilter === type) {
      setVerifiedFilter(null)
    }
  }

  // Handle premium filter changes
  const handlePremiumChange = (type: string, checked: boolean) => {
    if (checked) {
      setPremiumFilter(type)
    } else if (premiumFilter === type) {
      setPremiumFilter(null)
    }
  }

  // Handle rating filter changes
  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setMinRating(rating)
    } else if (minRating === rating) {
      setMinRating(null)
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTags([])
    setSelectedCategories([])
    setVerifiedFilter(null)
    setPremiumFilter(null)
    setMinRating(null)
    setSearchQuery("")
  }

  // Load more bots
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  // Navigate to compare page with selected bots
  const handleCompare = () => {
    if (selectedBots.length >= 2) {
      router.push(`/compare?bots=${selectedBots.join(",")}`)
    }
  }

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

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            <span className="brand-gradient-text">Discord Bots</span>
          </h1>
          <p className="text-muted-foreground text-center">
            Browse and search for Discord bots by features and functionality.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Filters */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="rounded-lg border bg-card p-4 brand-card">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary">Filters</h3>
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="categories">
                  <AccordionTrigger className="text-sm py-2">Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[
                        "Moderation",
                        "Music",
                        "Utility",
                        "Economy & Leveling",
                        "Fun & Games",
                        "Social & Community",
                        "Administration",
                        "AI & Advanced",
                      ].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="verification">
                  <AccordionTrigger className="text-sm py-2">Verification Status</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified"
                          checked={verifiedFilter === "verified"}
                          onCheckedChange={(checked) => handleVerificationChange("verified", !!checked)}
                          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                          htmlFor="verified"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Verified Bots
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="unverified"
                          checked={verifiedFilter === "unverified"}
                          onCheckedChange={(checked) => handleVerificationChange("unverified", !!checked)}
                          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                          htmlFor="unverified"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Unverified Bots
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="premium">
                  <AccordionTrigger className="text-sm py-2">Premium Status</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="premium"
                          checked={premiumFilter === "premium"}
                          onCheckedChange={(checked) => handlePremiumChange("premium", !!checked)}
                          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                          htmlFor="premium"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Premium Bots
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="free"
                          checked={premiumFilter === "free"}
                          onCheckedChange={(checked) => handlePremiumChange("free", !!checked)}
                          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                          htmlFor="free"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Free Bots
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rating">
                  <AccordionTrigger className="text-sm py-2">Minimum Rating</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={(checked) => handleRatingChange(rating, !!checked)}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <label
                            htmlFor={`rating-${rating}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {rating}+ Stars
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {(selectedCategories.length > 0 || verifiedFilter || premiumFilter || minRating) && (
                <Button variant="ghost" className="w-full mt-2 text-xs text-primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>

            <div className="rounded-lg border bg-card p-4 brand-card">
              <h3 className="font-medium text-primary mb-4">Features</h3>
              <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} maxHeight="300px" />
            </div>

            <div className="rounded-lg border bg-card p-4 brand-card">
              <h3 className="font-medium text-primary">Compare Bots</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select multiple bots to compare their features side by side.
              </p>
              <div className="mt-4 space-y-2">
                {selectedBots.length > 0 ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      {selectedBots.length} bot{selectedBots.length !== 1 ? "s" : ""} selected
                    </div>
                    <Button
                      className="w-full btn-primary-gradient"
                      onClick={handleCompare}
                      disabled={selectedBots.length < 2}
                    >
                      Compare Selected
                    </Button>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Select at least 2 bots to compare</div>
                )}
              </div>
            </div>
          </div>

          {/* Bot Listings */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for bots by name or feature..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px] border-primary/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="servers">Most Servers</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md border-primary/20">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className={`h-9 w-9 rounded-none rounded-l-md ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className={`h-9 w-9 rounded-none rounded-r-md ${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            {(selectedTags.length > 0 ||
              selectedCategories.length > 0 ||
              verifiedFilter ||
              premiumFilter ||
              minRating) && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium text-primary">Active filters:</span>

                {selectedCategories.map((category, index) => (
                  <Badge
                    key={`cat-${category}`}
                    variant="outline"
                    className="tag-badge-primary flex items-center gap-1"
                  >
                    Category: {category}
                    <button
                      onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== category))}
                      className="ml-1 hover:bg-primary/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}

                {selectedTags.map((tag, index) => (
                  <Badge
                    key={`tag-${tag}`}
                    variant="outline"
                    className={getTagBadgeClass(index) + " flex items-center gap-1"}
                  >
                    {tag}
                    <button
                      onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}

                {verifiedFilter && (
                  <Badge variant="outline" className="tag-badge-blue flex items-center gap-1">
                    {verifiedFilter === "verified" ? "Verified" : "Unverified"}
                    <button onClick={() => setVerifiedFilter(null)} className="ml-1 hover:bg-blue-500/20 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {premiumFilter && (
                  <Badge variant="outline" className="tag-badge-orange flex items-center gap-1">
                    {premiumFilter === "premium" ? "Premium" : "Free"}
                    <button onClick={() => setPremiumFilter(null)} className="ml-1 hover:bg-orange-500/20 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {minRating && (
                  <Badge variant="outline" className="tag-badge-green flex items-center gap-1">
                    {minRating}+ Stars
                    <button onClick={() => setMinRating(null)} className="ml-1 hover:bg-green-500/20 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-7 text-xs text-primary"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              </div>
            )}

            {currentBots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No bots found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  We couldn't find any bots matching your search criteria. Try adjusting your filters or search query.
                </p>
                <Button onClick={clearAllFilters} className="btn-primary-gradient">
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentBots.map((bot) => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    selectable
                    selected={selectedBots.includes(bot.id)}
                    onSelect={handleBotSelection}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentBots.map((bot) => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    compact
                    selectable
                    selected={selectedBots.includes(bot.id)}
                    onSelect={handleBotSelection}
                  />
                ))}
              </div>
            )}

            {filteredAndSortedBots.length > currentBots.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

