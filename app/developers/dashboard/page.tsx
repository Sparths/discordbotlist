import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bot, Edit, Plus, Trash } from "lucide-react"

export default function DeveloperDashboard() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
          <p className="text-muted-foreground">Manage your Discord bots and track their performance.</p>
        </div>

        <Tabs defaultValue="my-bots">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-bots">My Bots</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tag-requests">Tag Requests</TabsTrigger>
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
              {[1, 2, 3].map((bot) => (
                <Card key={bot}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>ModeratorBot #{bot}</CardTitle>
                      <Badge variant={bot === 1 ? "default" : "secondary"}>{bot === 1 ? "Active" : "Draft"}</Badge>
                    </div>
                    <CardDescription>Added on Jan 15, 2023</CardDescription>
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
                            <span className="font-medium">1,245</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Servers:</span>
                            <span className="font-medium">532</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Rating:</span>
                            <span className="font-medium">4.8/5</span>
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

          <TabsContent value="tag-requests" className="space-y-6 pt-4">
            <h2 className="text-xl font-bold">Tag Requests</h2>
            <Card>
              <CardHeader>
                <CardTitle>Your Requested Tags</CardTitle>
                <CardDescription>Tags you've requested that are pending approval.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Custom Embeds", description: "Create and send custom rich embeds", status: "Pending" },
                    { name: "Reaction Roles", description: "Assign roles based on reactions", status: "Approved" },
                    { name: "Ticket System", description: "Support ticket management system", status: "Rejected" },
                  ].map((tag, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="font-medium">{tag.name}</div>
                        <div className="text-sm text-muted-foreground">{tag.description}</div>
                      </div>
                      <Badge
                        variant={
                          tag.status === "Approved" ? "default" : tag.status === "Rejected" ? "destructive" : "outline"
                        }
                      >
                        {tag.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Request New Tag
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

