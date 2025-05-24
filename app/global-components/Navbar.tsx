"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const isTenantRoute = pathname.split("/").length > 1 && pathname.split("/")[1] !== ""

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Project Alpha</span>
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="flex-1 md:flex-none">
            {isTenantRoute && (
              <div className="text-sm text-muted-foreground">
                {/* This would show the tenant name in a real app */}
                Tenant Dashboard
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs">Docs</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
