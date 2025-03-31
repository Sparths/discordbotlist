import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Bot, ExternalLink, Heart, Shield, Star, Zap } from "lucide-react"

interface BotCardProps {
  bot: {
    id: number
    name: string
    description: string
    tags: string[]
    avatar?: string
    verified?: boolean
    premium?: boolean
    rating: number
    servers: number
    category?: string
  }
  compact?: boolean
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: number, selected: boolean) => void
}

export function BotCard({ bot, compact = false, selectable = false, selected = false, onSelect }: BotCardProps) {
  const { id, name, description, tags, avatar, verified, premium, rating, servers } = bot

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

  // Determine card style based on bot status
  const getCardClass = () => {
    if (premium && verified) return "brand-card-premium"
    if (premium) return "brand-card-premium"
    if (verified) return "brand-card-verified"
    return "brand-card"
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(id, checked)
    }
  }

  if (compact) {
    return (
      <Card
        className={`flex rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow ${getCardClass()}`}
      >
        <div className="flex h-full w-16 items-center justify-center bg-muted">
          {avatar ? (
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
              <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <Bot className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold">{name}</h3>
                {verified && <Shield className="h-3 w-3 text-blue-500" />}
                {premium && <Zap className="h-3 w-3 text-yellow-500" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
            {selectable && (
              <Checkbox
                id={`compare-${id}`}
                checked={selected}
                onCheckedChange={handleCheckboxChange}
                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={tag} variant="outline" className={getTagBadgeClass(index)}>
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="flex items-center mr-3">
                <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <span>{servers.toLocaleString()} servers</span>
            </div>
            <Link href={`/bots/${id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md overflow-hidden ${getCardClass()}`}
    >
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
          {premium && <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">Premium</Badge>}
          {verified && <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">Verified</Badge>}
          {selectable && (
            <Checkbox
              id={`compare-${id}`}
              checked={selected}
              onCheckedChange={handleCheckboxChange}
              className="absolute top-2 right-2 h-5 w-5 border-2 border-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          )}
        </div>
        <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border-4 border-background overflow-hidden">
            {avatar ? (
              <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Bot className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
      <CardContent className="flex-1 p-6 pt-12 space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {tags.slice(0, 5).map((tag, index) => (
            <Badge key={tag} variant="outline" className={getTagBadgeClass(index)}>
              {tag}
            </Badge>
          ))}
          {tags.length > 5 && (
            <Badge variant="outline" className="bg-muted/50 hover:bg-muted">
              +{tags.length - 5} more
            </Badge>
          )}
        </div>
        <div className="text-sm text-center text-muted-foreground">{servers.toLocaleString()} servers</div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link href={`/bots/${id}`} className="flex-1">
          <Button variant="default" className="w-full btn-primary-gradient">
            View Details
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

