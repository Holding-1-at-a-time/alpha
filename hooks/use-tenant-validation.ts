"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTenant } from "@/lib/tenantContext"
import { getTenantConfig, validateTenantAccess } from "@/lib/tenant-utils"
import { logger } from "@/lib/logger"

export function useTenantValidation() {
  const tenant = useTenant()
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    async function validate() {
      try {
        setIsValidating(true)

        // Check if tenant exists
        const tenantConfig = await getTenantConfig(tenant.id)
        if (!tenantConfig) {
          logger.warn(`Invalid tenant: ${tenant.id}`)
          router.push("/")
          return
        }

        // Validate access (in production, this would check user permissions)
        const hasAccess = await validateTenantAccess(tenant.id)
        if (!hasAccess) {
          logger.warn(`Access denied for tenant: ${tenant.id}`)
          router.push("/")
          return
        }

        setIsValid(true)
      } catch (error) {
        logger.error("Error validating tenant", error as Error)
        router.push("/")
      } finally {
        setIsValidating(false)
      }
    }

    validate()
  }, [tenant.id, router])

  return { isValidating, isValid }
}
