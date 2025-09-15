"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Zap, Plug, Settings, User, FileText, Menu, X } from "lucide-react"

const navigation = [
  { name: "Home", href: "", icon: Home },
  { name: "Automations", href: "/automations", icon: Zap },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Settings", href: "/settings", icon: Settings },
]

const profileNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Logs", href: "/logs", icon: FileText },
]

interface SidebarProps {
  credits?: { current: number; total: number }
  appName?: string
}

export function Sidebar({ credits = { current: 649, total: 1000 }, appName = "" }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">S</span>
            </div>
            {!collapsed && <span className="font-bold text-lg text-sidebar-foreground">{appName || "Stude"}</span>}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!collapsed && (
          <div className="px-4 py-4">
            <div className="text-xs text-sidebar-foreground/60 mb-2">Credits</div>
            <div className="text-lg font-semibold text-sidebar-foreground">
              {credits.current.toLocaleString()}/{credits.total.toLocaleString()}
            </div>
            <div className="w-full bg-sidebar-accent rounded-full h-2 mt-2">
              <div
                className="bg-sidebar-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(credits.current / credits.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === "/dashboard" + item.href
              return (
                <li key={item.name}>
                  <Link
                    href={"/dashboard" + item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-2",
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="border-t border-sidebar-border my-4" />

          <ul className="space-y-1">
            {profileNavigation.map((item) => {
              const isActive = pathname === "/dashboard" + item.href
              return (
                <li key={item.name}>
                  <Link
                    href={"/dashboard"+item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-2",
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:fixed md:inset-y-0 md:z-50 md:flex md:flex-col transition-all duration-300",
          isCollapsed ? "md:w-16" : "md:w-72",
        )}
      >
        <SidebarContent collapsed={isCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-3 w-3" /> : <X className="h-3 w-3" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 h-10 w-10 bg-background/80 backdrop-blur-sm border border-border hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
