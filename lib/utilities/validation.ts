// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (minimum 8 characters)
export function validatePassword(password: string): boolean {
  return password.length >= 8
}

// Username validation (alphanumeric, 3-20 characters)
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Tenant ID validation (lowercase alphanumeric with hyphens, 3-20 characters)
export function validateTenantId(tenantId: string): boolean {
  const tenantIdRegex = /^[a-z0-9-]{3,20}$/
  return tenantIdRegex.test(tenantId)
}

// Role validation (check if role is in allowed roles)
export function validateRole(role: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(role)
}
