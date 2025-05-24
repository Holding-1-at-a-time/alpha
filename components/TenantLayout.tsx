"use client"

import type React from "react"
import { useEffect } from "react"
import { TenantProvider } from "@/lib/tenantContext"
import { logger } from "@/lib/logger"
import { useAuth } from "@/app/providers/AuthProvider"
import { TenantSidebar } from "@/components/tenant-sidebar"

interface TenantLayoutProps {
  children: React.ReactNode
  tenantId: string
}

export default function TenantLayout({ children, tenantId }: TenantLayoutProps) {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    logger.info(`Tenant layout mounted for tenant: ${tenantId}`, {
      authenticated: isAuthenticated,
      userId: user?.id,
    })
  }, [tenantId, isAuthenticated, user])

  return (
    <TenantProvider tenantId={tenantId}>
      <div className="tenant-layout">
        <div className="tenant-header border-b bg-muted/40 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20"></div>
              <span className="font-medium capitalize">{tenantId} Workspace</span>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="tenant-content flex">
          <TenantSidebar />
          <div className="tenant-main flex-1">{children}</div>
        </div>
      </div>
    </TenantProvider>
  )
}
