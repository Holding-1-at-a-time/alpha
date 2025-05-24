import ProtectedRoute from "@/components/ProtectedRoute"

function ProtectedPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Protected Page</h1>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="mb-4">This page is only accessible to authenticated users.</p>
        <p className="text-muted-foreground">
          You are seeing this content because you are logged in and have the appropriate permissions.
        </p>
      </div>
    </div>
  )
}

export default function ProtectedPageWrapper() {
  return (
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  )
}
