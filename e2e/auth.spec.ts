import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should redirect to login when accessing protected page", async ({ page }) => {
    // Go to a protected page
    await page.goto("/demo/dashboard")

    // Check that we're redirected to the login page
    await expect(page).toHaveURL(/\/login/)
  })

  test("should show validation errors on login form", async ({ page }) => {
    // Go to the login page
    await page.goto("/login?tenant=demo")

    // Try to submit with empty form
    await page.click('button:has-text("Sign In")')

    // Check for validation errors
    await expect(page.locator('text="Please enter a valid email address"')).toBeVisible()
  })

  test("should login with valid credentials", async ({ page }) => {
    // Go to the login page
    await page.goto("/login?tenant=demo")

    // Fill in valid credentials
    await page.fill('input[type="email"]', "test@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button:has-text("Sign In")')

    // Check that we're redirected to the dashboard
    await expect(page).toHaveURL(/\/demo\/dashboard/)

    // Check that we're authenticated
    await expect(page.locator('text="Test User"')).toBeVisible()
  })

  test("should logout", async ({ page }) => {
    // Login first
    await page.goto("/login?tenant=demo")
    await page.fill('input[type="email"]', "test@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button:has-text("Sign In")')
    await expect(page).toHaveURL(/\/demo\/dashboard/)

    // Click logout button
    await page.click('button:has-text("Logout")')

    // Check that we're redirected to the home page
    await expect(page).toHaveURL("/")
  })

  test("should register a new account", async ({ page }) => {
    // Go to the register page
    await page.goto("/register?tenant=demo")

    // Fill in registration form
    await page.fill('input[placeholder="John Doe"]', "New User")
    await page.fill('input[type="email"]', "newuser@example.com")
    await page.fill('input[id="password"]', "password123")
    await page.fill('input[id="confirm-password"]', "password123")
    await page.click('button:has-text("Create account")')

    // Check that we're redirected to the dashboard
    await expect(page).toHaveURL(/\/demo\/dashboard/)
  })

  test("should enforce role-based access control", async ({ page }) => {
    // Login as a user with limited permissions
    await page.goto("/login?tenant=demo")
    await page.fill('input[type="email"]', "user@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button:has-text("Sign In")')

    // Try to access an admin-only page
    await page.goto("/demo/settings")

    // Check that we're redirected to the dashboard
    await expect(page).toHaveURL(/\/demo\/dashboard/)
  })
})
