"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Plus, Search, X } from "lucide-react"

// Comprehensive list of Discord bot tags organized by category
const tagCategories = {
  Moderation: [
    "Ban Command",
    "Kick Command",
    "Mute Command",
    "Warn System",
    "Timeout Command",
    "Auto-Moderation",
    "Anti-Spam",
    "Anti-Raid",
    "Anti-Phishing",
    "Anti-Scam",
    "Message Filtering",
    "Word Blacklist",
    "Link Filtering",
    "Invite Filtering",
    "Slowmode Management",
    "Mass Mention Prevention",
    "Caps Filtering",
    "Nickname Moderation",
    "Moderation Logs",
    "Audit Logs",
    "User Reports",
    "Strike System",
    "Temporary Bans",
    "IP Bans",
    "Ban Appeals",
  ],
  Administration: [
    "Role Management",
    "Channel Management",
    "Permission Management",
    "Server Backup",
    "Welcome Messages",
    "Goodbye Messages",
    "Auto-Role",
    "Reaction Roles",
    "Verification System",
    "Member Screening",
    "Captcha Verification",
    "Server Stats",
    "Member Counter",
    "Custom Commands",
    "Command Aliases",
    "Command Cooldowns",
    "Command Permissions",
    "Scheduled Messages",
    "Scheduled Events",
    "Announcement System",
  ],
  Utility: [
    "Polls",
    "Reminders",
    "Notes",
    "Tags",
    "Custom Embeds",
    "Server Info",
    "User Info",
    "Role Info",
    "Channel Info",
    "Emoji Info",
    "Invite Tracking",
    "Message Snipe",
    "Edit Snipe",
    "Starboard",
    "Pinboard",
    "Bookmarks",
    "Timezone Converter",
    "Calculator",
    "Translator",
    "Dictionary",
    "Weather",
    "URL Shortener",
    "QR Code Generator",
    "Ticket System",
    "Suggestion System",
  ],
  "Fun & Games": [
    "Memes",
    "Reddit Integration",
    "Image Manipulation",
    "GIF Commands",
    "Trivia",
    "Hangman",
    "Tic-Tac-Toe",
    "Connect Four",
    "Rock Paper Scissors",
    "Blackjack",
    "Poker",
    "Slots",
    "Dice",
    "8Ball",
    "Fortune Cookies",
    "Jokes",
    "Facts",
    "Quotes",
    "Would You Rather",
    "Truth or Dare",
    "Akinator",
    "Wordle",
    "Counting Game",
    "Idle/Clicker Game",
  ],
  "Economy & Leveling": [
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
    "Leveling System",
    "Rank Cards",
    "Custom Rank Cards",
    "Role Rewards",
    "Experience Boosters",
    "Voice Leveling",
    "Message Tracking",
  ],
  "Music & Audio": [
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
    "Voice Recording",
    "Soundboard",
    "Text-to-Speech",
    "Voice Effects",
  ],
  "Social & Community": [
    "Social Media Alerts",
    "Twitch Notifications",
    "YouTube Notifications",
    "Twitter/X Feeds",
    "Instagram Updates",
    "Reddit Updates",
    "Discord Server Feeds",
    "GitHub Notifications",
    "RSS Feeds",
    "Giveaways",
    "Raffles",
    "Contests",
    "Birthdays",
    "Anniversaries",
    "Reputation System",
    "Profile System",
    "Bio System",
    "Achievements",
    "Badges",
    "Server Partnerships",
  ],
  Integrations: [
    "Webhook Management",
    "API Integration",
    "Database Support",
    "Web Dashboard",
    "Discord OAuth2",
    "Trello Integration",
    "GitHub Integration",
    "GitLab Integration",
    "Patreon Integration",
    "Ko-fi Integration",
    "PayPal Integration",
    "Stripe Integration",
    "Google Services",
    "Microsoft Services",
    "Steam Integration",
    "Minecraft Integration",
    "Fortnite Integration",
    "Valorant Integration",
    "League of Legends Integration",
    "Overwatch Integration",
    "Custom API Endpoints",
  ],
  "AI & Advanced": [
    "AI Chatbot",
    "GPT Integration",
    "Image Generation",
    "Voice Recognition",
    "Sentiment Analysis",
    "Content Moderation AI",
    "Language Detection",
    "Translation AI",
    "Summarization",
    "Custom AI Training",
    "Voice Cloning",
    "Face Detection",
    "OCR (Text Recognition)",
    "Data Analysis",
    "Machine Learning",
    "Neural Networks",
    "Recommendation Engine",
    "Anomaly Detection",
  ],
}

// Flatten all tags for search functionality
const allTags = Object.values(tagCategories).flat()

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  maxHeight?: string
}

export function TagSelector({ selectedTags, onChange, maxHeight = "400px" }: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTags, setFilteredTags] = useState<string[]>(allTags)
  const [activeCategory, setActiveCategory] = useState("Moderation")
  const [popularTags, setPopularTags] = useState([
    "Ban Command",
    "Music Player",
    "Leveling System",
    "Auto-Moderation",
    "Reaction Roles",
    "Currency System",
    "Ticket System",
    "Giveaways",
  ])

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

  // Filter tags based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTags(allTags)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredTags(allTags.filter((tag) => tag.toLowerCase().includes(query)))
    }
  }, [searchQuery])

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 brand-card">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-primary">Selected Features</h3>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => onChange([])} className="h-8 text-xs text-primary">
              Clear All
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px] bg-muted/30">
          {selectedTags.length === 0 ? (
            <p className="text-sm text-muted-foreground w-full text-center my-2">
              No features selected. Select features below to find the perfect bot.
            </p>
          ) : (
            selectedTags.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className={`flex items-center gap-1 px-2 py-1 ${getTagBadgeClass(index)}`}
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-muted rounded-full"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for features..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">Search Results</h3>
          <ScrollArea className={`h-[${maxHeight}]`}>
            <div className="grid grid-cols-2 gap-2 pr-4">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag, index) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Button
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className={`justify-start h-8 w-full text-xs truncate ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground"
                          : "border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => (selectedTags.includes(tag) ? removeTag(tag) : addTag(tag))}
                      title={tag} // Add title for tooltip on hover
                    >
                      {selectedTags.includes(tag) && <Check className="mr-1 h-3 w-3 flex-shrink-0" />}
                      <span className="truncate">{tag}</span>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-4 text-center text-muted-foreground">
                  <p>No features found matching "{searchQuery}"</p>
                  <Button variant="link" className="mt-1 h-auto p-0 text-primary" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary">Popular Features</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : getTagBadgeClass(index)
                  }`}
                  onClick={() => (selectedTags.includes(tag) ? removeTag(tag) : addTag(tag))}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <TabsList className="w-max">
                {Object.keys(tagCategories).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {Object.entries(tagCategories).map(([category, tags]) => (
              <TabsContent key={category} value={category} className="mt-2">
                <ScrollArea className={`h-[${maxHeight}]`}>
                  <div className="grid grid-cols-2 gap-2 pr-4">
                    {tags.map((tag, index) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Button
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          className={`justify-start h-8 w-full text-xs ${
                            selectedTags.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                          }`}
                          onClick={() => (selectedTags.includes(tag) ? removeTag(tag) : addTag(tag))}
                          title={tag} // Add title for tooltip on hover
                        >
                          {selectedTags.includes(tag) && <Check className="mr-1 h-3 w-3 flex-shrink-0" />}
                          <span className="truncate">{tag}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          <div className="pt-2 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary truncate"
              title="Request New Feature Tag" // Add title for tooltip on hover
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Request New Feature Tag</span>
            </Button>
            <Button
              size="sm"
              className="gap-1 btn-primary-gradient"
              onClick={() => onChange(selectedTags)}
              disabled={selectedTags.length === 0}
            >
              Apply Filters
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

