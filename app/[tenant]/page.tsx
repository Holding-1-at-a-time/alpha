import { Button } from "@/components/ui/button"

export default function TenantHomePage({
  params,
}: {
  params: { tenant: string }
}) {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">Welcome to {params.tenant}</h1>
      <p className="mb-6 text-muted-foreground">
        This is the tenant-specific homepage. Content here will be customized based on the tenant.
      </p>
      <div className="flex gap-4">
        <Button>Get Started</Button>
        <Button variant="outline">Explore Features</Button>
      </div>
    </div>
  )
}
