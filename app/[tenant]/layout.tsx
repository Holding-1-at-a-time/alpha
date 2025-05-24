import type React from "react"
// Import the necessary components
import { cookies } from "next/headers"
import TenantLayout from "@/components/TenantLayout"
import Loading from "@/app/global-components/Loading"
import { Suspense } from "react"
import { notFound } from "next/navigation"

export default function TenantRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  // Get tenant from cookies (set by middleware)
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenantId")?.value || params.tenant

  // Validate tenant exists (in a real app, you'd check against a database)
  // For now, we'll just check if it's not empty
  if (!tenantId) {
    notFound()
  }

  return (
    <TenantLayout tenantId={tenantId}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </TenantLayout>
  )
}
