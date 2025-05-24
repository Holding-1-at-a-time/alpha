import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { ConvexHttpClient } from "convex/browser"
import { logger } from "@/lib/logger"
import { api } from "@/convex/_generated/api"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set. Please set it in your environment variables.")
}

// Initialize Convex client for server-side operations
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient =
  typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexHttpClient(convexUrl) : null

// Validate OAuth providers configuration
const providers = []

// Always include credentials provider
providers.push(
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      tenantId: { label: "Tenant ID", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password || !credentials?.tenantId) {
        return null
      }

      try {
        // Check if Convex client is available
        if (!convexClient) {
          logger.error("Convex client not initialized - check NEXT_PUBLIC_CONVEX_URL")
          throw new Error("Authentication service unavailable")
        }

        // Verify credentials using Convex
        const user = await convexClient.query(api.auth.verifyCredentials, {
          email: credentials.email,
          password: credentials.password,
          tenantId: credentials.tenantId,
        })

        if (!user) {
          logger.warn("Failed authentication attempt", {
            email: credentials.email,
            tenantId: credentials.tenantId,
          })
          return null
        }

        logger.info("User authenticated successfully", {
          email: credentials.email,
          tenantId: credentials.tenantId,
        })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        }
      } catch (error) {
        logger.error("Auth.js authorize error", error as Error)
        return null
      }
    },
  }),
)

// Add Google provider if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
} else if (process.env.NODE_ENV === "production") {
  logger.warn("Google OAuth provider not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
}

// Add GitHub provider if configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  )
} else if (process.env.NODE_ENV === "production") {
  logger.warn("GitHub OAuth provider not configured - missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET")
}

// Define the Auth.js configuration
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers, create or update user in Convex
        if (account.provider !== "credentials") {
          try {
            // TODO: Implement user creation/update in Convex for OAuth providers
            // Example:
            // const convexUser = await convexClient?.query(api.auth.getUserByEmail, {
            //   email: user.email,
            // })
            // if (!convexUser) {
            //   await convexClient?.mutation(api.auth.registerUser, {
            //     email: user.email,
            //     name: user.name,
            //     tenantId: "demo", // Default tenant for OAuth users
            //     authProviderId: `${account.provider}|${account.providerAccountId}`,
            //     role: "user",
            //   })
            // }
            logger.info("OAuth user signed in", { provider: account.provider, email: user.email })
          } catch (error) {
            logger.error("Failed to sync OAuth user with Convex", error as Error)
          }
        }

        return {
          ...token,
          id: user.id,
          role: user.role || "user",
          tenantId: user.tenantId || "demo",
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})
