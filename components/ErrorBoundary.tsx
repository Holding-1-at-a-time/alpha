"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("Error boundary caught an error", error, { errorInfo })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="container flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-muted-foreground">
            An unexpected error occurred. We've been notified and are working on a fix.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => this.setState({ hasError: false, error: null })}>Try Again</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="mt-4 max-w-md rounded-md bg-muted p-4 text-left">
              <p className="font-mono text-sm">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
