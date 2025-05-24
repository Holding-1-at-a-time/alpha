import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-medium">Project {i + 1}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              This is a description for Project {i + 1}. It contains some details about the project.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Updated 2d ago</span>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
