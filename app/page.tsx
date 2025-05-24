import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center space-y-12 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Welcome to Project Alpha</h1>
      <p className="max-w-[600px] text-muted-foreground md:text-xl">
        A powerful multi-tenant platform built with Next.js, Convex, and TypeScript
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="https://demo.example.com">Try Demo Tenant</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/docs">Documentation</Link>
        </Button>
      </div>
    </div>
  )
}
