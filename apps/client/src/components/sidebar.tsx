"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Home, Zap, Plug, Settings, User, FileText, Menu, DollarSign } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
]

const profileNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Logs", href: "/dashboard/logs", icon: FileText },
]

interface SidebarProps {
  credits?: { current: number; total: number }
  appName?: string
}

export function Sidebar({ credits = { current: 649, total: 1000 }, appName = "FlowGen" }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // 👇 Auto handle sidebar open/close on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false) // Desktop -> close sheet, rely on fixed sidebar
      } else {
        setIsOpen(false) // Mobile -> sheet closed by default
      }
    }

    handleResize() // run on mount
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-3 h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="h-9 w-9 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
          <span className="text-white dark:text-neutral-900 font-bold text-lg">F</span>
        </div>
        <span className="font-semibold text-lg text-neutral-900 dark:text-white">{appName}</span>
      </div>

      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
          <span>Credits</span>
          <span>{credits.current}/{credits.total}</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
            style={{ width: `${(credits.current / credits.total) * 100}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
            </Link>
          )
        })}

        <div className="border-t border-neutral-200 dark:border-neutral-800 my-4" />

        {profileNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-600 text-white dark:bg-green-400 dark:text-neutral-900"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-56 md:flex-col">
        <SidebarContent />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 h-10 w-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-300 dark:border-neutral-700"
          >
            <Menu className="h-5 w-5 text-neutral-900 dark:text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-56">
          <SheetTitle className="sr-only">Sidebar</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
