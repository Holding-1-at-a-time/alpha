/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 17:13:28
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client";

import { createContext, useContext, type ReactNode } from "react"
import React from "react";
import { logger } from "./logger"

export interface TenantMeta {
  id: string
  name?: string
  logo?: string
  primaryColor?: string
  features?: string[]
}

interface TenantContextType {
  tenant: TenantMeta
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider(props: { children: ReactNode; tenantId: string }) {
  const tenant: TenantMeta = {
    id: props.tenantId,
    name: props.tenantId.charAt(0).toUpperCase() + props.tenantId.slice(1),
    primaryColor: "#3b82f6",
    features: ["dashboard", "projects", "team"],
  }

  logger.info(`TenantProvider initialized with tenant: ${props.tenantId}`)

  return <TenantContext.Provider value={{ tenant }}>{props.children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context.tenant
}
