export default function DashboardPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">Metric {i + 1}</h3>
            <p className="text-2xl font-bold">{Math.floor(Math.random() * 1000)}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Activity Overview</h2>
        <div className="h-[300px] w-full rounded-md bg-muted/50"></div>
      </div>
    </div>
  )
}
