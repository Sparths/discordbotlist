"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { FeatureComparisonTable } from "../components/feature-comparison-table"

// Sample data for demonstration - Make sure IDs match exactly with the bots page
const allBots = [
  {
    id: 1,
    name: "ModeratorBot",
    description: "A powerful moderation bot with advanced features.",
    category: "Moderation",
    features: {
      "Ban Command": true,
      "Kick Command": true,
      "Mute Command": true,
      "Warn System": true,
      "Auto-Moderation": true,
      "Anti-Spam": true,
      "Anti-Raid": true,
      "Message Filtering": true,
      "Role Management": true,
      "Logging System": true,
      "Temporary Bans": true,
      "IP Bans": "Premium only",
      "Strike System": true,
      "User Reports": true,
      "Audit Logs": true,
      "Nickname Moderation": true,
      "Word Blacklist": true,
      "Link Filtering": true,
      "Invite Filtering": true,
      "Mass Mention Prevention": true,
      "Caps Filtering": true,
      "Anti-Phishing": true,
      "Anti-Scam": true,
      "Slowmode Management": true,
    },
  },
  {
    id: 2,
    name: "MusicMaster",
    description: "The ultimate music experience for Discord.",
    category: "Music",
    features: {
      "Music Player": true,
      "Playlist Support": true,
      "Queue Management": true,
      "Volume Control": true,
      "Audio Filters": "Premium only",
      Equalizer: "Premium only",
      Lyrics: true,
      "Spotify Integration": true,
      "YouTube Integration": true,
      "SoundCloud Integration": true,
      "Apple Music Integration": false,
      "Radio Stations": true,
      "DJ Role": true,
      "24/7 Playback": "Premium only",
      Autoplay: true,
      "Song Recommendations": true,
      "Ban Command": false,
      "Kick Command": false,
      "Mute Command": false,
      "Warn System": false,
      "Auto-Moderation": false,
      "Anti-Spam": false,
      "Anti-Raid": false,
      "Message Filtering": false,
    },
  },
  {
    id: 3,
    name: "LevelUp",
    description: "Comprehensive leveling system with customizable rank cards.",
    category: "Leveling",
    features: {
      "Leveling System": true,
      "Rank Cards": true,
      "Custom Rank Cards": "Premium only",
      "Role Rewards": true,
      "Experience Boosters": true,
      "Voice Leveling": true,
      "Message Tracking": true,
      Leaderboards: true,
    },
  },
  {
    id: 4,
    name: "EconomyPro",
    description: "Complete economy system with currency, shops, jobs, gambling, and more.",
    category: "Economy",
    features: {
      "Currency System": true,
      "Shop System": true,
      "Inventory System": true,
      "Work Commands": true,
      "Daily Rewards": true,
      Gambling: true,
      Heists: "Premium only",
      Robberies: true,
      Fishing: true,
      Hunting: true,
      Mining: true,
      Farming: "Premium only",
      "Pet System": "Premium only",
      "Marriage System": true,
      Leaderboards: true,
    },
  },
  {
    id: 5,
    name: "TicketMaster",
    description: "Advanced ticket system for support, applications, and more.",
    category: "Utility",
    features: {
      "Ticket System": true,
      "Custom Forms": true,
      "Support System": true,
      "Staff Management": true,
      "Ticket Categories": true,
      "Ticket Transcripts": true,
      "Ticket Analytics": "Premium only",
      "Ticket Automation": true,
    },
  },
  {
    id: 6,
    name: "AICompanion",
    description: "Intelligent AI chatbot with natural language processing and custom responses.",
    category: "AI & Advanced",
    features: {
      "AI Chatbot": true,
      "GPT Integration": true,
      "Custom Responses": true,
      "Conversation Memory": true,
      "Natural Language Processing": true,
      "Sentiment Analysis": "Premium only",
      "Language Translation": true,
      "Voice Recognition": "Premium only",
      "Image Generation": "Premium only",
      "Knowledge Base": true,
      "Contextual Awareness": true,
      "Personality Customization": true,
      "Command Learning": true,
      "Auto-Responses": true,
      "Scheduled Messages": true,
    },
  },
  {
    id: 7,
    name: "GiveawayBot",
    description: "Create and manage giveaways with customizable requirements and multiple winners.",
    category: "Social & Community",
    features: {
      Giveaways: true,
      Raffles: true,
      Contests: true,
      "Role Requirements": true,
      "Multiple Winners": true,
      "Timed Giveaways": true,
      "Giveaway Rerolls": true,
      "Giveaway Announcements": true,
    },
  },
  {
    id: 8,
    name: "ReactionRoles",
    description: "Easily set up reaction roles with customizable messages and multiple role options.",
    category: "Administration",
    features: {
      "Reaction Roles": true,
      "Button Roles": true,
      "Dropdown Roles": "Premium only",
      "Temporary Roles": true,
      "Role Management": true,
      "Custom Embeds": true,
      "Role Menus": true,
      "Role Groups": true,
      "Role Limits": true,
      "Role Requirements": "Premium only",
      "Role Expiry": true,
      "Role Logging": true,
      "Role Backup": true,
      "Role Sync": "Premium only",
      "Role Analytics": true,
    },
  },
  {
    id: 9,
    name: "WelcomeBot",
    description: "Customize welcome and goodbye messages with images, embeds, and more.",
    category: "Social & Community",
    features: {
      "Welcome Messages": true,
      "Goodbye Messages": true,
      "Custom Images": true,
      "Member Counter": true,
      "Welcome DMs": true,
      "Welcome Roles": true,
      "Welcome Channels": true,
      "Welcome Embeds": true,
    },
  },
  {
    id: 10,
    name: "PollMaster",
    description: "Create advanced polls with multiple options, timers, and result tracking.",
    category: "Fun & Games",
    features: {
      Polls: true,
      Voting: true,
      Surveys: true,
      "Scheduled Events": true,
      "Poll Analytics": true,
      "Poll Templates": true,
      "Poll Reminders": true,
      "Poll Results": true,
    },
  },
]

// Feature categories for organized comparison
const featureCategories = {
  Moderation: [
    "Ban Command",
    "Kick Command",
    "Mute Command",
    "Warn System",
    "Auto-Moderation",
    "Anti-Spam",
    "Anti-Raid",
    "Message Filtering",
    "Temporary Bans",
    "IP Bans",
    "Strike System",
    "User Reports",
  ],
  Administration: [
    "Role Management",
    "Logging System",
    "Audit Logs",
    "Nickname Moderation",
    "Word Blacklist",
    "Link Filtering",
    "Invite Filtering",
    "Slowmode Management",
    "Reaction Roles",
    "Button Roles",
    "Dropdown Roles",
    "Role Menus",
    "Role Groups",
    "Role Limits",
    "Role Requirements",
    "Role Expiry",
    "Role Logging",
    "Role Backup",
    "Role Sync",
    "Role Analytics",
  ],
  Security: ["Anti-Phishing", "Anti-Scam", "Mass Mention Prevention", "Caps Filtering"],
  Music: [
    "Music Player",
    "Playlist Support",
    "Queue Management",
    "Volume Control",
    "Audio Filters",
    "Equalizer",
    "Lyrics",
    "Spotify Integration",
    "YouTube Integration",
    "SoundCloud Integration",
    "Apple Music Integration",
    "Radio Stations",
    "DJ Role",
    "24/7 Playback",
    "Autoplay",
    "Song Recommendations",
  ],
  Leveling: [
    "Leveling System",
    "Rank Cards",
    "Custom Rank Cards",
    "Role Rewards",
    "Experience Boosters",
    "Voice Leveling",
    "Message Tracking",
    "Leaderboards",
  ],
  Economy: [
    "Currency System",
    "Shop System",
    "Inventory System",
    "Work Commands",
    "Daily Rewards",
    "Gambling",
    "Heists",
    "Robberies",
    "Fishing",
    "Hunting",
    "Mining",
    "Farming",
    "Pet System",
    "Marriage System",
    "Leaderboards",
  ],
  "AI & Advanced": [
    "AI Chatbot",
    "GPT Integration",
    "Custom Responses",
    "Conversation Memory",
    "Natural Language Processing",
    "Sentiment Analysis",
    "Language Translation",
    "Voice Recognition",
    "Image Generation",
    "Knowledge Base",
    "Contextual Awareness",
    "Personality Customization",
    "Command Learning",
    "Auto-Responses",
    "Scheduled Messages",
  ],
  "Social & Community": [
    "Welcome Messages",
    "Goodbye Messages",
    "Custom Images",
    "Member Counter",
    "Welcome DMs",
    "Welcome Roles",
    "Welcome Channels",
    "Welcome Embeds",
    "Giveaways",
    "Raffles",
    "Contests",
    "Role Requirements",
    "Multiple Winners",
    "Timed Giveaways",
    "Giveaway Rerolls",
    "Giveaway Announcements",
  ],
  "Fun & Games": [
    "Polls",
    "Voting",
    "Surveys",
    "Scheduled Events",
    "Poll Analytics",
    "Poll Templates",
    "Poll Reminders",
    "Poll Results",
  ],
  Utility: [
    "Ticket System",
    "Custom Forms",
    "Support System",
    "Staff Management",
    "Ticket Categories",
    "Ticket Transcripts",
    "Ticket Analytics",
    "Ticket Automation",
  ],
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [hasEnoughBots, setHasEnoughBots] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")

  // Use useMemo to compute the bots to compare only when searchParams changes
  const botsToCompare = useMemo(() => {
    const botIdsParam = searchParams.get("bots")

    if (!botIdsParam) {
      setDebugInfo("No bot IDs found in URL")
      return []
    }

    // Parse bot IDs from URL parameter
    const botIds = botIdsParam
      .split(",")
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id))

    setDebugInfo(`Found ${botIds.length} bot IDs: ${botIds.join(", ")}`)

    // Filter bots based on the IDs in the URL
    const foundBots = allBots.filter((bot) => botIds.includes(bot.id))

    if (foundBots.length !== botIds.length) {
      const foundIds = foundBots.map((bot) => bot.id)
      const missingIds = botIds.filter((id) => !foundIds.includes(id))
      setDebugInfo((prev) => `${prev}\nMissing bots: ${missingIds.join(", ")}`)
    }

    return foundBots
  }, [searchParams])

  // Use a separate effect to update the hasEnoughBots state
  useEffect(() => {
    setHasEnoughBots(botsToCompare.length >= 2)
  }, [botsToCompare.length])

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/bots">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Bots
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="brand-gradient-text">Bot Comparison</span>
          </h1>
        </div>

        {!hasEnoughBots ? (
          <div className="rounded-lg border bg-card p-8 text-center brand-card">
            <h2 className="text-xl font-bold mb-4">Not enough bots selected</h2>
            <p className="text-muted-foreground mb-6">Please select at least 2 bots to compare their features.</p>
            <Link href="/bots" className="flex justify-center">
              <Button className="btn-primary-gradient">Browse Bots</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Comparing {botsToCompare.length} Bots</h2>
              <Link href="/bots">
                <Button variant="outline" size="sm" className="text-primary hover:bg-primary/10">
                  Add More Bots
                </Button>
              </Link>
            </div>

            <FeatureComparisonTable bots={botsToCompare} featureCategories={featureCategories} />

            <div className="flex justify-center space-x-4 mt-6">
              <Link href="/bots">
                <Button className="btn-primary-gradient">Browse More Bots</Button>
              </Link>
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                Export Comparison
              </Button>
            </div>
          </>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && debugInfo && (
          <div className="mt-8 p-4 border rounded bg-gray-100 text-xs font-mono whitespace-pre-wrap">{debugInfo}</div>
        )}
      </div>
    </div>
  )
}

