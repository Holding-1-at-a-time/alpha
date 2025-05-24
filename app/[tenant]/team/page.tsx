"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InviteUserForm } from "@/components/InviteUserForm"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/app/providers/AuthProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

// Mock team members data
const mockTeamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    image: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    status: "active",
    lastActive: "1 day ago",
    image: null,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    status: "active",
    lastActive: "3 days ago",
    image: null,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    status: "invited",
    lastActive: "Never",
    image: null,
  },
]

export default function TeamPage() {
  const { user } = useAuth()
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers)
  const [isLoading, setIsLoading] = useState(false)

  const handleInviteSuccess = () => {
    // In a real implementation, you would fetch the updated team members
    // For now, we'll just add a mock invited user
    const newMember = {
      id: `${teamMembers.length + 1}`,
      name: "New User",
      email: "newuser@example.com",
      role: "user",
      status: "invited",
      lastActive: "Never",
      image: null,
    }
    setTeamMembers([...teamMembers, newMember])
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  const handleChangeRole = (id: string, newRole: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, role: newRole } : member)))
  }

  const isAdmin = user?.role === "admin"

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Members</h1>
          {isAdmin && <InviteUserForm onInviteSuccess={handleInviteSuccess} />}
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="grid grid-cols-1 divide-y">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.image || ""} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {member.status === "invited" && (
                        <Badge variant="outline" className="text-yellow-500">
                          Invited
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {member.role}
                      </Badge>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {member.status === "active" ? `Active ${member.lastActive}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
                {isAdmin && member.id !== user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangeRole(member.id, "admin")}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeRole(member.id, "manager")}>
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeRole(member.id, "user")}>Make User</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
