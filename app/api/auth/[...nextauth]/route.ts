import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { ConvexHttpClient } from "convex/browser"
import { logger } from "@/lib/logger"

// Initialize Convex client for server-side operations
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient =
  typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexHttpClient(convexUrl) : null

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
          // In a real implementation, you would verify credentials against your database
          // For now, we'll simulate a successful login with mock data
          // In production, replace this with a call to your Convex function to verify credentials

          // This is a placeholder for credential verification
          // const user = await convexClient?.query(api.auth.verifyCredentials, {
          //   email: credentials.email,
          //   password: credentials.password,
          //   tenantId: credentials.tenantId,
          // })

          // For demo purposes, we'll accept any credentials
          const user = {
            id: `user_${Date.now()}`,
            name: credentials.email.split("@")[0],
            email: credentials.email,
            role: "admin",
            tenantId: credentials.tenantId,
          }

          return user
        } catch (error) {
          logger.error("NextAuth authorize error", error as Error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers, we need to create or update the user in Convex
        if (account.provider !== "credentials") {
          try {
            // Check if user exists in Convex
            // In production, replace this with a call to your Convex function
            // const existingUser = await convexClient?.query(api.auth.getUserByEmail, {
            //   email: user.email,
            // })
            // If not, create the user
            // if (!existingUser) {
            //   await convexClient?.mutation(api.auth.registerUser, {
            //     email: user.email,
            //     name: user.name,
            //     tenantId: "demo", // Default tenant for OAuth users
            //     authProviderId: `${account.provider}|${account.providerAccountId}`,
            //     role: "user",
            //   })
            // }
          } catch (error) {
            logger.error("NextAuth JWT callback error", error as Error)
          }
        }

        return {
          ...token,
          id: user.id,
          role: user.role,
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
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
