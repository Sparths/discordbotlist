"use client"

import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFormProps {
  placeholder?: string
  buttonText?: string
  className?: string
}

export function SearchForm({
  placeholder = "Search for bot features or names...",
  buttonText = "Search Bots",
  className = "",
}: SearchFormProps) {
  const router = useRouter()

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get("search") as string

    if (searchQuery.trim()) {
      router.push(`/bots?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder={placeholder}
          className="w-full bg-background pl-8 rounded-lg border border-input"
        />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <Button type="submit" className="w-full btn-primary-gradient">
          {buttonText}
        </Button>
      </div>
    </form>
  )
}

