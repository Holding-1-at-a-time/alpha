import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { logger } from "@/lib/logger"

// Initialize Convex client
const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

// Email validation
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Initialize auth with the identity provider
export async function initializeAuth() {
  try {
    // This would be replaced with actual auth provider initialization
    logger.info("Auth initialized")
    return true
  } catch (error) {
    logger.error("Failed to initialize auth", error as Error)
    return false
  }
}

// Get auth token for Convex
export async function getConvexAuthToken(): Promise<string | null> {
  try {
    // In a real implementation, this would get the token from your auth provider
    // For now, we'll return a mock token from localStorage
    return localStorage.getItem("auth_token")
  } catch (error) {
    logger.error("Failed to get auth token", error as Error)
    return null
  }
}

// Server-side auth check
export async function requireAuth(context: any) {
  // This would be used in getServerSideProps or similar server functions
  // to verify the user is authenticated before rendering protected pages

  const { req, res } = context

  // Check for auth cookie/header
  const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  try {
    // Verify token with your auth provider
    // For now, we'll assume it's valid
    return {
      props: {
        // Any props you want to pass to the page
      },
    }
  } catch (error) {
    logger.error("Auth verification failed", error as Error)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
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
    // Call Convex query to get user profile
    const result = await convexClient.query(api.auth.getUserProfile, { userId })
    return result
  } catch (error) {
    logger.error("Failed to get user profile", error as Error)
    throw error
  }
}
