import ProtectedRoute from "@/components/ProtectedRoute"

function AdminPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="mb-4">This page is only accessible to administrators.</p>
        <p className="text-muted-foreground">
          You are seeing this content because you are logged in with admin privileges.
        </p>
      </div>
    </div>
  )
}

export default function AdminPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPage />
    </ProtectedRoute>
  )
}
