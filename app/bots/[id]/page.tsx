import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Check, ExternalLink, Heart, Share2, ShieldCheck, Star } from "lucide-react"

// Sample data for bots
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
    developer: "BotCreator",
    created: "Jan 15, 2023",
    updated: "2 days ago",
    prefix: "!",
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
    developer: "AudioDev",
    created: "Mar 5, 2023",
    updated: "1 week ago",
    prefix: "m!",
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
    developer: "LevelMaster",
    created: "Apr 20, 2023",
    updated: "3 days ago",
    prefix: "lvl",
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
    developer: "AIDevs",
    created: "Feb 10, 2023",
    updated: "5 days ago",
    prefix: "ai!",
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
    developer: "RoleManager",
    created: "May 12, 2023",
    updated: "1 day ago",
    prefix: "rr!",
  },
]

export default function BotPage({ params }: { params: { id: string } }) {
  // Find the bot with the matching ID
  const botId = Number.parseInt(params.id, 10)
  const bot = sampleBots.find((b) => b.id === botId) || sampleBots[0]

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="h-32 bg-muted flex items-center justify-center">
              <Bot className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                  {bot.name} #{bot.id}
                </h1>
                <div className="flex items-center text-muted-foreground">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`mr-1 h-4 w-4 ${star <= Math.round(bot.rating) ? "fill-primary text-primary" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">({bot.rating.toFixed(1)})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {bot.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <div className="space-y-2">
                <Button className="w-full">Add to Server</Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-bold">Bot Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Developer</span>
                <span className="font-medium">{bot.developer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{bot.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{bot.updated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Servers</span>
                <span className="font-medium">{bot.servers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prefix</span>
                <span className="font-medium">{bot.prefix}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-bold">Compare With</h3>
            <div className="space-y-2">
              {sampleBots
                .filter((b) => b.id !== bot.id)
                .slice(0, 3)
                .map((otherBot) => (
                  <Button key={otherBot.id} variant="outline" className="w-full justify-start">
                    <Bot className="mr-2 h-4 w-4" />
                    {otherBot.name} #{otherBot.id}
                  </Button>
                ))}
            </div>
            <Link
              href={`/compare?bots=${bot.id},${sampleBots
                .filter((b) => b.id !== bot.id)
                .slice(0, 2)
                .map((b) => b.id)
                .join(",")}`}
            >
              <Button className="w-full">Compare Selected</Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="commands">Commands</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-bold">About {bot.name}</h2>
                <p className="mt-2 text-muted-foreground">{bot.description}</p>
                <p className="mt-2 text-muted-foreground">
                  The bot includes features like {bot.tags.join(", ")}, and much more. It's constantly updated with new
                  features based on community feedback.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-bold">Key Features</h2>
                <ul className="mt-2 space-y-2">
                  {bot.tags.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start">
                      <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                      <div>
                        <span className="font-medium">{feature}</span>
                        <p className="text-sm text-muted-foreground">
                          {feature === "Ban Command" &&
                            "Complete set of moderation commands including ban, kick, mute, and warn."}
                          {feature === "Auto-Moderation" &&
                            "Automatically detect and handle spam, inappropriate content, and raids."}
                          {feature === "Logging System" &&
                            "Comprehensive logging of all moderation actions and server events."}
                          {feature === "Music Player" &&
                            "High-quality music playback with support for multiple sources."}
                          {feature === "Playlist Support" && "Create and manage playlists for continuous playback."}
                          {feature === "Spotify Integration" && "Connect with Spotify to play your favorite music."}
                          {feature === "Leveling System" && "Track user activity and reward engagement with levels."}
                          {feature === "Rank Cards" && "Customizable cards to display user levels and stats."}
                          {feature === "Role Rewards" && "Automatically assign roles based on user levels."}
                          {feature === "AI Chatbot" && "Natural language processing for human-like conversations."}
                          {feature === "GPT Integration" &&
                            "Powered by advanced language models for intelligent responses."}
                          {feature === "Custom Responses" && "Create personalized responses for your server."}
                          {feature === "Reaction Roles" && "Assign roles based on message reactions."}
                          {feature === "Role Management" && "Comprehensive tools for managing server roles."}
                          {feature === "Custom Embeds" && "Create beautiful embedded messages for your server."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-bold">Screenshots</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((img) => (
                    <div key={img} className="aspect-video rounded-md bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Screenshot {img}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 pt-4">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-bold">Feature List</h2>
                <div className="mt-4 grid gap-2">
                  {bot.tags
                    .concat([
                      "Server Management",
                      "User Tracking",
                      "Custom Commands",
                      "Scheduled Messages",
                      "Backup System",
                      "Analytics Dashboard",
                      "Multi-language Support",
                      "API Integration",
                      "Web Dashboard",
                      "Mobile App",
                    ])
                    .slice(0, 10)
                    .map((feature) => (
                      <div key={feature} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span>{feature}</span>
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="commands" className="space-y-6 pt-4">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-bold">Command List</h2>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Main Commands</h3>
                    <div className="grid gap-2">
                      {[
                        { name: `${bot.prefix}help`, desc: "Display help information" },
                        { name: `${bot.prefix}settings`, desc: "Configure bot settings" },
                        { name: `${bot.prefix}info`, desc: "View bot information" },
                        { name: `${bot.prefix}stats`, desc: "View server statistics" },
                      ].map((cmd) => (
                        <div key={cmd.name} className="flex items-start py-2 border-b last:border-0">
                          <div className="flex-1">
                            <div className="font-mono text-sm">{cmd.name}</div>
                            <div className="text-sm text-muted-foreground">{cmd.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Feature Commands</h3>
                    <div className="grid gap-2">
                      {bot.tags.slice(0, 4).map((tag) => (
                        <div key={tag} className="flex items-start py-2 border-b last:border-0">
                          <div className="flex-1">
                            <div className="font-mono text-sm">
                              {bot.prefix}
                              {tag.toLowerCase().replace(/\s+/g, "")}
                            </div>
                            <div className="text-sm text-muted-foreground">Use the {tag} feature</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 pt-4">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-bold">User Reviews</h2>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      user: "ServerOwner123",
                      rating: 5,
                      comment: `Best ${bot.category.toLowerCase()} bot I've used. The features are incredible and have saved me so much time.`,
                    },
                    {
                      user: "DiscordAdmin",
                      rating: 4,
                      comment: "Great bot with lots of features. The only thing missing is more customization options.",
                    },
                    {
                      user: "GuildMaster",
                      rating: 5,
                      comment: "This bot has everything I need for my server. Highly recommended!",
                    },
                  ].map((review, i) => (
                    <div key={i} className="py-4 border-b last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{review.user}</div>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : ""}`}
                              />
                            ))}
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

