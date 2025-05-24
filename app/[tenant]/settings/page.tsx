import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Workspace Settings</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input id="workspace-name" placeholder="Enter workspace name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workspace-url">Workspace URL</Label>
                <div className="flex">
                  <div className="flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                    {process.env.NEXT_PUBLIC_APP_URL}/
                  </div>
                  <Input id="workspace-url" className="rounded-l-none" placeholder="workspace-name" />
                </div>
              </div>
              <Button className="mt-2">Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Appearance Settings</h2>
            <p className="text-muted-foreground">Customize the appearance of your workspace.</p>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Billing Settings</h2>
            <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">API Settings</h2>
            <p className="text-muted-foreground">Manage your API keys and webhooks.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
