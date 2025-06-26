"use client"

import type * as React from "react"
import { Users, CreditCard, BarChart3, UserCheck, Settings, Home, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["admin", "recepcionista"],
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
    roles: ["admin", "recepcionista"],
  },
  {
    title: "Check-in",
    url: "/checkin",
    icon: UserCheck,
    roles: ["admin", "recepcionista"],
  },
  {
    title: "Planes",
    url: "/planes",
    icon: CreditCard,
    roles: ["admin"],
  },
  {
    title: "Analíticas",
    url: "/analiticas",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
    roles: ["admin"],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth()

  // Mock role - en producción vendría de los metadatos del usuario
  const userRole = user?.user_metadata?.role || "admin"

  const filteredItems = navigationItems.filter((item) => item.roles.includes(userRole))

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Sesión cerrada exitosamente")
      window.location.href = "/login"
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-2 px-2 py-4">
          <h2 className="text-lg font-semibold">GymPro</h2>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{user?.email ? getUserInitials(user.email) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user?.email?.split("@")[0] || "Usuario"}</p>
              <p className="text-xs text-muted-foreground">
                {userRole === "admin" ? "Administrador" : "Recepcionista"}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
