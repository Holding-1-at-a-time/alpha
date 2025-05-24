"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error("Application error", error)
  }, [error])

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. We've been notified and are working on a fix.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    </div>
  )
}
