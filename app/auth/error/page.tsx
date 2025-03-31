"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "unknown_error"

  const errorMessages: Record<string, string> = {
    invalid_state: "Invalid authentication state. Please try again.",
    server_error: "An error occurred during authentication. Please try again later.",
    unknown_error: "An unknown error occurred. Please try again.",
  }

  const errorMessage = errorMessages[error] || errorMessages.unknown_error

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/auth/login">
            <Button>Try Again</Button>
          </Link>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          If the problem persists, please contact support.
        </CardFooter>
      </Card>
    </div>
  )
}

