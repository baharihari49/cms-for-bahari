// components/app-sidebar.tsx
import { 
  Building, 
  Briefcase, 
  Code, 
  MessageSquare, 
  Users, 
  LogOut,
  LayoutDashboard
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Main navigation items
const mainItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Experience",
    path: "/experiences",
    icon: Building,
  },
  {
    title: "Portfolio",
    path: "/portfolio",
    icon: Briefcase,
  },
  {
    title: "Tech Stack",
    path: "/techstack", 
    icon: Code,
  }
]

// Additional content items
const contentItems = [
  {
    title: "FAQ",
    path: "/faq",
    icon: MessageSquare,
  },
  {
    title: "Testimonials",
    path: "/testimonials",
    icon: Users,
  }
]

// System items
// const systemItems = [
//   {
//     title: "Settings",
//     path: "/dashboard/settings",
//     icon: Settings,
//   }
// ]

export function AppSidebar() {
  const pathname = usePathname()

  // Function to check if a menu item should be active
  const isActiveItem = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true
    }
    return pathname !== '/dashboard' && pathname.startsWith(path)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Sidebar className="h-screen">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="py-6 px-3 flex items-center justify-center mb-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-semibold text-white">B</span>
            </div>
            <h1 className="font-bold text-xl">Bahari CMS</h1>
          </Link>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActiveItem(item.path)}
                  >
                    <Link href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActiveItem(item.path)}
                  >
                    <Link href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActiveItem(item.path)}
                  >
                    <Link href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow"></div>

        {/* User Profile Footer */}
        <SidebarFooter className="border-t pt-4">
          <div className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/images/avatar.png" alt="Profile" />
                <AvatarFallback>BH</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Bahari</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}