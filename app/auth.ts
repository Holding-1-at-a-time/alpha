import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { ConvexHttpClient } from "convex/browser"
import { logger } from "@/lib/logger"

// Initialize Convex client for server-side operations
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient =
  typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexHttpClient(convexUrl) : null

// Define the Auth.js configuration
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
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
          logger.error("Auth.js authorize error", error as Error)
          return null
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId || "demo"
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
})
