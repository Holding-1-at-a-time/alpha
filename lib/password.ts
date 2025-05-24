import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

/**
 * Hashes a password using scrypt with a random salt
 * @param password The plaintext password to hash
 * @returns A string in the format 'salt:hash'
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = randomBytes(16).toString("hex")
  // Hash the password with the salt
  const hash = scryptSync(password, salt, 64).toString("hex")
  // Return the salt and hash together
  return `${salt}:${hash}`
}

/**
 * Verifies a password against a hash
 * @param password The plaintext password to verify
 * @param hashedPassword The hashed password to compare against (in the format 'salt:hash')
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    // Split the stored hash into salt and hash
    const [salt, storedHash] = hashedPassword.split(":")

    // If the format is invalid, return false
    if (!salt || !storedHash) return false

    // Hash the provided password with the same salt
    const hashBuffer = scryptSync(password, salt, 64)

    // Convert the stored hash to a buffer for comparison
    const storedHashBuffer = Buffer.from(storedHash, "hex")

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(hashBuffer, storedHashBuffer)
  } catch (error) {
    // If any error occurs during verification, return false
    console.error("Password verification error:", error)
    return false
  }
}

/**
 * Generates a secure random token
 * @param length The length of the token in bytes (default: 32)
 * @returns A hex string representation of the token
 */
export function generateSecureToken(length = 32): string {
  return randomBytes(length).toString("hex")
}
