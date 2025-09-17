import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb"
import { ThemeToggle } from "./theme-toggle"
import { SignedIn, UserButton } from "@clerk/nextjs"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar  />

      <div className="md:pl-52 transition-all duration-300">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-between">
            <div className="md:hidden w-10" />
            <BreadcrumbNav />
            <div className="gap-1 flex items-center">
              <ThemeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
