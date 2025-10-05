"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { navigation, profileNavigation } from "@/constants/sidebar"
import { Menu, LogOut } from "lucide-react"
import Logo from "./logo"
import { SignOutButton } from "@clerk/nextjs"

interface SidebarProps {
  credits?: { current: number; total: number }
}

export function Sidebar({ credits = { current: 649, total: 1000 } }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      } else {
        setIsOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
      <Logo />

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
                  ? "bg-neutral-900 text-white dark:bg-blue-400 dark:text-black"
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
                  ? "bg-neutral-900 text-white dark:bg-blue-400 dark:text-black"
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

      <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 ">
        <SignOutButton redirectUrl="/dashboard">
          <Button
            variant="ghost"
            className="w-full flex cursor-pointer items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </SignOutButton>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
        <SidebarContent />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer fixed top-4 left-4 z-50 h-10 w-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-300 dark:border-neutral-700"
          >
            <Menu className="h-5 w-5 text-neutral-900 dark:text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Sidebar</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
