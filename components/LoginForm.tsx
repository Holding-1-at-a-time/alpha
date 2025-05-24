"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthButtons } from "@/components/AuthButtons"
import { validateEmail, validatePassword } from "@/lib/utilities/validation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const { login, isLoading, error } = useAuth()
  const searchParams = useSearchParams()
  const tenant = searchParams.get("tenant") || ""
  const redirect = searchParams.get("redirect") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError(null)
    setPasswordError(null)

    // Validate inputs
    let isValid = true

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters")
      isValid = false
    }

    if (isValid) {
      await login(email, password)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
          {tenant && ` on ${tenant}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={emailError ? "true" : "false"}
            />
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={passwordError ? "true" : "false"}
            />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <AuthButtons />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
