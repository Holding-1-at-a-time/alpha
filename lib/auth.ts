/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Registers a new user with the given details
 * @param userData The user data to register
 * @returns A promise that resolves when the user is registered
 */
export async function registerUser(userData: {
  email: string
  name: string
  tenantId: string
  authProviderId: string
  password?: string
  role?: string
}): Promise<{ userId: string }> {
  // This is a client-side wrapper around the Convex mutation
  // In a real implementation, you would use the useMutation hook directly
  // This function is provided for backward compatibility

  // Import the mutation dynamically to avoid SSR issues
  const { useMutation } = await import("convex/react")
  const { api } = await import("@/convex/_generated/api")

  // Create a temporary function to execute the mutation
  const registerUserMutation = useMutation(api.auth.registerUser)

  // Execute the mutation
  return registerUserMutation(userData)
}

/**
 * Validates a password strength
 * @param password The password to validate
 * @returns An object with validation results
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  message?: string
} {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters" }
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" }
  }

  // Check for at least one special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character" }
  }

  return { isValid: true }
}
