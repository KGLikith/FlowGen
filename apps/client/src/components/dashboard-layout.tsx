import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb"
import { ThemeToggle } from "./theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
  credits?: { current: number; total: number }
  appName?: string
}

export function DashboardLayout({ children, credits, appName }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar credits={credits} appName={appName} />

      <div className="md:pl-52 transition-all duration-300">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-between">
            <div className="md:hidden w-10" />
            <BreadcrumbNav />
            <ThemeToggle />
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
