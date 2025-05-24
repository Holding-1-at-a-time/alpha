"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Users, Settings, FolderKanban, Search, Home } from "lucide-react"

import { useTenant } from "@/lib/tenantContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function TenantSidebar() {
  const tenant = useTenant()
  const pathname = usePathname()
  const tenantPath = `/${tenant.id}`

  // Navigation items for the tenant
  const navItems = [
    {
      title: "Dashboard",
      href: `${tenantPath}/dashboard`,
      icon: Home,
    },
    {
      title: "Analytics",
      href: `${tenantPath}/analytics`,
      icon: BarChart3,
    },
    {
      title: "Projects",
      href: `${tenantPath}/projects`,
      icon: FolderKanban,
    },
    {
      title: "Team",
      href: `${tenantPath}/team`,
      icon: Users,
    },
    {
      title: "Settings",
      href: `${tenantPath}/settings`,
      icon: Settings,
    },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <form className="px-2">
          <div className="relative">
            <SidebarInput placeholder="Search..." className="pl-8" />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-sidebar-accent p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {tenant.name?.[0] || tenant.id[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{tenant.name}</span>
              <span className="text-xs text-muted-foreground">Workspace</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
