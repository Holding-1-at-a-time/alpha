export default function AnalyticsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">User Growth</h2>
          <div className="h-[250px] w-full rounded-md bg-muted/50"></div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Engagement</h2>
          <div className="h-[250px] w-full rounded-md bg-muted/50"></div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Conversion Rate</h2>
          <div className="h-[250px] w-full rounded-md bg-muted/50"></div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Revenue</h2>
          <div className="h-[250px] w-full rounded-md bg-muted/50"></div>
        </div>
      </div>
    </div>
  )
}
