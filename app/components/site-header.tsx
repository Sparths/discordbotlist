// app/components/site-header.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  ChevronDown,
  Menu,
  Search,
  User,
  Sparkles,
  LogOut,
  Settings,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/supabase-auth-context";

export function SiteHeader() {
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    signInWithDiscord,
    signOut,
  } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav isAuthenticated={isAuthenticated} logout={signOut} />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden brand-gradient">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg">
              <span className="brand-gradient-text">Discord</span>BotList
            </span>
          </Link>

          <div className="hidden md:flex">
            <DesktopNav isAuthenticated={isAuthenticated} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex md:w-60 lg:w-80">
            <form action="/bots" method="get" className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search bots..."
                className="w-full pl-8 rounded-lg"
              />
            </form>
          </div>

          <ThemeToggle />

          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage
                      src={profile?.avatar_url || "/placeholder-user.jpg"}
                      alt={profile?.username || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile?.username
                        ? profile.username.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{profile?.username || "User"}</span>
                    {profile?.discriminator &&
                      profile.discriminator !== "0000" && (
                        <span className="text-xs text-muted-foreground">
                          #{profile?.discriminator}
                        </span>
                      )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Rest of the menu remains the same */}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={signInWithDiscord}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function DesktopNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/bots" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Browse Bots
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <div className="text-sm font-medium leading-none">
                    {category.title}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <div className="text-sm font-medium leading-none">
                    {resource.title}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {resource.description}
                  </p>
                </Link>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {isAuthenticated && (
          <NavigationMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem>
          <Link href="/developers/add-bot" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <Sparkles className="mr-2 h-4 w-4" />
              Add Your Bot
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({
  isAuthenticated,
  logout,
}: {
  isAuthenticated: boolean;
  logout: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Link href="/" className="flex items-center gap-2 px-2">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden brand-gradient">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg">
          <span className="brand-gradient-text">Discord</span>BotList
        </span>
      </Link>

      <div className="px-2 py-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bots..."
            className="w-full pl-8 rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <Link
          href="/bots"
          className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md"
        >
          Browse Bots
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md">
            <span>Categories</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="ml-4 border-l pl-2 py-1 border-primary/20">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="flex py-1 hover:text-primary"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md">
            <span>Resources</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="ml-4 border-l pl-2 py-1 border-primary/20">
            {resources.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="flex py-1 hover:text-primary"
              >
                {resource.title}
              </Link>
            ))}
          </div>
        </div>

        {isAuthenticated && (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md"
            >
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10 hover:text-primary rounded-md text-left"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </>
        )}

        <Link
          href="/developers/add-bot"
          className="flex items-center gap-2 px-2 py-2 mt-2 rounded-md bg-gradient-to-r from-primary to-secondary text-white"
        >
          <Sparkles className="h-4 w-4" />
          Add Your Bot
        </Link>
      </div>
    </div>
  );
}

const categories = [
  {
    title: "Moderation",
    description:
      "Bots that help maintain order and enforce rules in your server.",
    href: "/bots?category=Moderation",
  },
  {
    title: "Music",
    description: "Bots that play music and audio in voice channels.",
    href: "/bots?category=Music",
  },
  {
    title: "Utility",
    description: "Bots with useful tools and commands for server management.",
    href: "/bots?category=Utility",
  },
  {
    title: "Fun & Games",
    description: "Bots that provide entertainment and games for your members.",
    href: "/bots?category=Fun & Games",
  },
  {
    title: "Economy & Leveling",
    description: "Bots with currency systems, leveling, and rewards.",
    href: "/bots?category=Economy & Leveling",
  },
  {
    title: "Social & Community",
    description: "Bots that enhance community interaction and engagement.",
    href: "/bots?category=Social & Community",
  },
  {
    title: "Administration",
    description: "Bots for server administration and management.",
    href: "/bots?category=Administration",
  },
  {
    title: "AI & Advanced",
    description: "Bots with artificial intelligence and advanced features.",
    href: "/bots?category=AI & Advanced",
  },
];

const resources = [
  {
    title: "Documentation",
    description: "Learn how to use and integrate with our platform.",
    href: "/docs",
  },
  {
    title: "API Reference",
    description: "Detailed information about our API endpoints.",
    href: "/api-docs",
  },
  {
    title: "Blog",
    description: "Latest news, updates, and articles about Discord bots.",
    href: "/blog",
  },
  {
    title: "Support",
    description: "Get help with any issues or questions.",
    href: "/support",
  },
];
