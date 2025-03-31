"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, Plus, Upload, Image, Link2, Save, Check } from "lucide-react"
import { TagSelector } from "../../components/tag-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AddBotPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedTags, setSelectedTags] = useState(["Ban Command", "Kick Command", "Mute Command"])

  // Form state
  const [botName, setBotName] = useState("")
  const [botPrefix, setBotPrefix] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [category, setCategory] = useState("")
  const [inviteUrl, setInviteUrl] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [website, setWebsite] = useState("")
  const [supportServer, setSupportServer] = useState("")

  // Commands state
  const [commands, setCommands] = useState([
    { name: "", description: "", usage: "", category: "" },
    { name: "", description: "", usage: "", category: "" },
    { name: "", description: "", usage: "", category: "" },
    { name: "", description: "", usage: "", category: "" },
    { name: "", description: "", usage: "", category: "" },
  ])

  // Handle command changes
  const updateCommand = (index, field, value) => {
    const newCommands = [...commands]
    newCommands[index] = { ...newCommands[index], [field]: value }
    setCommands(newCommands)
  }

  // Add more command fields
  const addMoreCommands = () => {
    setCommands([...commands, { name: "", description: "", usage: "", category: "" }])
  }

  // Save as draft
  const saveAsDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your bot has been saved as a draft.",
      duration: 3000,
    })
  }

  // Submit for review
  const submitForReview = () => {
    // Validate form
    if (!botName) {
      toast({
        title: "Error",
        description: "Bot name is required.",
        variant: "destructive",
        duration: 3000,
      })
      setActiveTab("basic")
      return
    }

    if (!shortDescription) {
      toast({
        title: "Error",
        description: "Short description is required.",
        variant: "destructive",
        duration: 3000,
      })
      setActiveTab("basic")
      return
    }

    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category.",
        variant: "destructive",
        duration: 3000,
      })
      setActiveTab("basic")
      return
    }

    if (!inviteUrl) {
      toast({
        title: "Error",
        description: "Bot invite URL is required.",
        variant: "destructive",
        duration: 3000,
      })
      setActiveTab("basic")
      return
    }

    if (selectedTags.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one feature tag.",
        variant: "destructive",
        duration: 3000,
      })
      setActiveTab("features")
      return
    }

    // Submit form
    toast({
      title: "Submission Successful",
      description: "Your bot has been submitted for review. You'll be notified once it's approved.",
      duration: 5000,
    })
  }

  // Preview bot
  const previewBot = () => {
    toast({
      title: "Preview Mode",
      description: "This feature will be available soon.",
      duration: 3000,
    })
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/developers/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Bot</h1>
        </div>

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Information</CardTitle>
                <CardDescription>Provide basic information about your Discord bot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bot-name">
                      Bot Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bot-name"
                      placeholder="Enter bot name"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bot-prefix">
                      Bot Prefix <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bot-prefix"
                      placeholder="e.g., !"
                      value={botPrefix}
                      onChange={(e) => setBotPrefix(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bot-description">
                    Short Description <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground ml-2">(max 100 characters)</span>
                  </Label>
                  <Input
                    id="bot-description"
                    placeholder="A brief description of your bot"
                    maxLength={100}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    required
                  />
                  <div className="text-xs text-right text-muted-foreground">{shortDescription.length}/100</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bot-long-description">Detailed Description</Label>
                  <Textarea
                    id="bot-long-description"
                    placeholder="Provide a detailed description of your bot, its features, and what makes it unique."
                    className="min-h-[150px]"
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bot-category">
                      Primary Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="bot-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moderation">Moderation</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="fun">Fun</SelectItem>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="administration">Administration</SelectItem>
                        <SelectItem value="ai">AI & Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bot-invite">
                      Bot Invite URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bot-invite"
                      placeholder="https://discord.com/api/oauth2/..."
                      value={inviteUrl}
                      onChange={(e) => setInviteUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bot-avatar">Bot Avatar</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image</span>
                    </div>
                    <Button variant="outline">Upload Image</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Links</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Website</span>
                      </div>
                      <Input
                        placeholder="https://yourbot.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Support Server</span>
                      </div>
                      <Input
                        placeholder="https://discord.gg/..."
                        value={supportServer}
                        onChange={(e) => setSupportServer(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bot Status</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="premium-bot" checked={isPremium} onCheckedChange={setIsPremium} />
                    <label
                      htmlFor="premium-bot"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      This is a premium bot with paid features
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={saveAsDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button onClick={() => setActiveTab("features")}>
                  Continue to Features
                  <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Features</CardTitle>
                <CardDescription>Select the features and functionality your bot provides.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Basic Info
                </Button>
                <Button onClick={() => setActiveTab("commands")}>
                  Continue to Commands
                  <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="commands" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Commands</CardTitle>
                <CardDescription>Add the most important commands your bot supports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {commands.map((command, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 items-start">
                      <div className="space-y-2">
                        <Label htmlFor={`command-${i}`}>Command</Label>
                        <Input
                          id={`command-${i}`}
                          placeholder="e.g., !ban"
                          value={command.name}
                          onChange={(e) => updateCommand(i, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor={`command-desc-${i}`}>Description</Label>
                        <Input
                          id={`command-desc-${i}`}
                          placeholder="What does this command do?"
                          value={command.description}
                          onChange={(e) => updateCommand(i, "description", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`command-usage-${i}`}>Usage</Label>
                        <Input
                          id={`command-usage-${i}`}
                          placeholder="e.g., !ban @user [reason]"
                          value={command.usage}
                          onChange={(e) => updateCommand(i, "usage", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`command-category-${i}`}>Category</Label>
                        <Select value={command.category} onValueChange={(value) => updateCommand(i, "category", value)}>
                          <SelectTrigger id={`command-category-${i}`}>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moderation">Moderation</SelectItem>
                            <SelectItem value="utility">Utility</SelectItem>
                            <SelectItem value="fun">Fun</SelectItem>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full" onClick={addMoreCommands}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add More Commands
                </Button>

                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bulk-upload" />
                    <label
                      htmlFor="bulk-upload"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I want to bulk upload commands
                    </label>
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload JSON File
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("features")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Features
                </Button>
                <Button onClick={() => setActiveTab("media")}>
                  Continue to Media
                  <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Media & Screenshots</CardTitle>
                <CardDescription>Add screenshots and media to showcase your bot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bot Banner Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center mb-2">
                      Drag and drop your banner image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground text-center mb-4">
                      Recommended size: 1200 x 300px, max 2MB
                    </p>
                    <Button variant="outline" size="sm">
                      Upload Banner
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bot Screenshots</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add up to 6 screenshots to showcase your bot's features
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="border rounded-lg p-2 aspect-video flex flex-col items-center justify-center"
                      >
                        <Image className="h-8 w-8 text-muted-foreground mb-2" />
                        <Button variant="ghost" size="sm">
                          Add Screenshot
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Demo Video (Optional)</Label>
                  <Input placeholder="YouTube or Vimeo URL" />
                  <p className="text-xs text-muted-foreground">Add a video demonstration of your bot in action</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("commands")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Commands
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={saveAsDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button onClick={submitForReview}>
                    <Check className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={saveAsDraft}>
            Save as Draft
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={previewBot}>
              Preview
            </Button>
            <Button onClick={submitForReview}>Submit for Review</Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

