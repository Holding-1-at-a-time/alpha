import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getTenantFromRequest } from "@/lib/tenantContext"

export async function middleware(request: NextRequest) {
  // Extract tenant from request (subdomain or path)
  const tenant = getTenantFromRequest(request)

  // If no tenant or www, redirect to landing page
  if (!tenant || tenant === "www") {
    // Only redirect if not already on the landing page
    if (request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Clone the response to modify it
  const response = NextResponse.next()

  // Set tenant ID in cookies for server components
  response.cookies.set("tenantId", tenant, {
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  })

  // Also set in headers for client components
  response.headers.set("x-tenant-id", tenant)

  return response
}

export const config = {
  // Match all paths except static files, api routes, and _next
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
}
