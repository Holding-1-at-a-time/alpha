import { auth } from "@/app/auth"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { logger } from "@/lib/logger"

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient =
  typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexHttpClient(convexUrl) : null

// Email validation
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Server-side auth check
export async function requireAuth() {
  const session = await auth()

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

// Register a new user in Convex
export async function registerUser(userData: {
  email: string
  name: string
  tenantId: string
  authProviderId: string
  role?: string
}) {
  try {
    if (!convexClient) {
      throw new Error(
        "Convex client is not initialized. Please check your NEXT_PUBLIC_CONVEX_URL environment variable.",
      )
    }

    // Call Convex mutation to create user
    const result = await convexClient.mutation(api.auth.registerUser, userData)
    return result
  } catch (error) {
    logger.error("Failed to register user", error as Error)
    throw error
  }
}

// Get user profile from Convex
export async function getUserProfile(userId: string) {
  try {
    if (!convexClient) {
      throw new Error(
        "Convex client is not initialized. Please check your NEXT_PUBLIC_CONVEX_URL environment variable.",
      )
    }

    // Call Convex query to get user profile
    const result = await convexClient.query(api.auth.getUserProfile, { userId })
    return result
  } catch (error) {
    logger.error("Failed to get user profile", error as Error)
    throw error
  }
}
