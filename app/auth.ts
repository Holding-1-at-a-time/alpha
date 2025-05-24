/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 16:17:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { ConvexHttpClient } from "convex/browser"
import { logger } from "@/lib/logger"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set. Please set it in your environment variables.")
}

// Get Convex client for server-side operations
function getConvexClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  return typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexHttpClient(convexUrl) : null
}

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
        // ⚠️ WARNING: DEMO IMPLEMENTATION - DO NOT USE IN PRODUCTION ⚠️
        // This is a placeholder implementation that accepts any credentials.
        // In production, you MUST implement proper credential verification:
        //
        // Example production implementation:
        // const convexClient = getConvexClient();
        // const user = await convexClient?.query(api.auth.verifyCredentials, {
        //   email: credentials.email,
        //   password: hashPassword(credentials.password), // Hash the password
        //   tenantId: credentials.tenantId,
        // })
        //
        // if (!user) {
        //   return null
        // }
        //
        // return {
        //   id: user.id,
        //   name: user.name,
        //   email: user.email,
        //   role: user.role,
        //   tenantId: user.tenantId,
        // }

        if (process.env.NODE_ENV === "production") {
          logger.error("SECURITY WARNING: Using demo authentication in production!")
          throw new Error("Demo authentication cannot be used in production")
        }

        // DEMO ONLY - accepts any credentials
        const user = {
          id: `user_${Date.now()}`,
          name: credentials.email.split("@")[0],
          email: credentials.email,
          // Use a lower-privilege role by default
          role: "user",
          tenantId: credentials.tenantId,
        }

        logger.warn("DEMO AUTH: User authenticated with demo credentials", { email: credentials.email })
        return user
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
            // const convexClient = getConvexClient();
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
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      } else if (new URL(url).origin === baseUrl) {
               return url
             }

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
