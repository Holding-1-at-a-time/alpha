"use client"

import { useAuth } from "@/app/providers/AuthProvider"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProtectedPage() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <h1 className="mb-6 text-2xl font-bold">Protected Page</h1>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Successful</CardTitle>
            <CardDescription>This page is only visible to authenticated users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">User Information</h3>
                <p className="text-sm text-muted-foreground">Name: {user?.name}</p>
                <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
                <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
                <p className="text-sm text-muted-foreground">Tenant: {user?.tenantId}</p>
              </div>
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
