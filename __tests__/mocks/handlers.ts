import { http, HttpResponse } from "msw"

export const handlers = [
  // Mock Auth.js session endpoint
  http.get("/api/auth/session", () => {
    return HttpResponse.json({
      user: {
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        tenantId: "demo",
        image: null,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }),

  // Mock Auth.js signin endpoint
  http.post("/api/auth/signin/credentials", async ({ request }) => {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const tenantId = formData.get("tenantId") || "demo"

    if (email === "test@example.com" && password === "password123") {
      return HttpResponse.json({
        url: `/${tenantId}/dashboard`,
      })
    }

    return HttpResponse.json(
      {
        error: "Invalid credentials",
      },
      { status: 401 },
    )
  }),

  // Mock Auth.js signout endpoint
  http.post("/api/auth/signout", () => {
    return HttpResponse.json({
      url: "/",
    })
  }),

  // Mock Convex API
  http.post("https://example-convex-url.com", async ({ request }) => {
    const body = await request.json()

    // Handle different Convex operations
    if (body.path === "auth:registerUser") {
      return HttpResponse.json({
        userId: "user_123",
      })
    }

    if (body.path === "auth:getUserProfile") {
      return HttpResponse.json({
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        tenantId: "demo",
        createdAt: new Date().toISOString(),
      })
    }

    return HttpResponse.json({})
  }),
]
