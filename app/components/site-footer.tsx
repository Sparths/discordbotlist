import Link from "next/link"
import { Bot } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden brand-gradient">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="brand-gradient-text">Discord</span>BotList
              </span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              The most comprehensive Discord bot listing platform. Find, compare, and add bots to enhance your Discord
              server.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-primary">Platform</h3>
            <Link href="/bots" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Browse Bots
            </Link>
            <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/tags" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Tags
            </Link>
            <Link href="/trending" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Trending
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-secondary">Developers</h3>
            <Link
              href="/developers/add-bot"
              className="text-sm text-muted-foreground hover:text-secondary transition-colors"
            >
              Add Your Bot
            </Link>
            <Link
              href="/developers/dashboard"
              className="text-sm text-muted-foreground hover:text-secondary transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
              API Documentation
            </Link>
            <Link
              href="/developers/guidelines"
              className="text-sm text-muted-foreground hover:text-secondary transition-colors"
            >
              Guidelines
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-purple-500">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
              Contact
            </Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-purple-500 transition-colors">
              Careers
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DiscordBotList. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

