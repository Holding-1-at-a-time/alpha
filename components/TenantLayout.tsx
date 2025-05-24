"use client"

import type React from "react"
import { useEffect } from "react"
import { TenantProvider } from "@/lib/tenantContext"
import { logger } from "@/lib/logger"

interface TenantLayoutProps {
  children: React.ReactNode
  tenantId: string
}

export default function TenantLayout({ children, tenantId }: TenantLayoutProps) {
  useEffect(() => {
    logger.info(`Tenant layout mounted for tenant: ${tenantId}`)
  }, [tenantId])

  return (
    <TenantProvider tenantId={tenantId}>
      <div className="tenant-layout">
        <div className="tenant-header border-b bg-muted/40 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20"></div>
              <span className="font-medium capitalize">{tenantId} Workspace</span>
            </div>
          </div>
        </div>
        <div className="tenant-content flex">
          <div className="tenant-sidebar hidden w-64 border-r p-4 md:block">
            {/* Sidebar placeholder - will be implemented in future */}
            <div className="space-y-2">
              <div className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted">Dashboard</div>
              <div className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                Projects
              </div>
              <div className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Team</div>
              <div className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                Settings
              </div>
            </div>
          </div>
          <div className="tenant-main flex-1">{children}</div>
        </div>
      </div>
    </TenantProvider>
  )
}
