import { afterAll, afterEach, beforeAll } from "vitest"
import { server } from "./mocks/server"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// Setup request mocking
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
