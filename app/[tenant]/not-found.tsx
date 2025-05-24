import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TenantNotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Tenant Page Not Found</h2>
      <p className="max-w-md text-muted-foreground">This page doesn't exist in the current workspace.</p>
      <Button asChild>
        <Link href="/">Return to Main Site</Link>
      </Button>
    </div>
  )
}
