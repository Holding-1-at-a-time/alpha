import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="grid grid-cols-1 divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div>
                  <p className="font-medium">Team Member {i + 1}</p>
                  <p className="text-sm text-muted-foreground">member{i + 1}@example.com</p>
                </div>
              </div>
              <div>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
