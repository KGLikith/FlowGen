"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const dashboardRoot = "/dashboard"

const routeNames: Record<string, string> = {
  [dashboardRoot]: "Home",
  [dashboardRoot+"/automations"]: "Automations",
  [dashboardRoot+"/integrations"]: "Integrations",
  [dashboardRoot+"/billing"]: "Billing",
  [dashboardRoot+"/profile"]: "Profile",
  [dashboardRoot+"/workflows"]: "Workflows",
}

export function BreadcrumbNav() {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const name = routeNames[href] || segment.charAt(0).toUpperCase() + segment.slice(1)
      return { name, href }
    }),
  ]

  // Remove duplicate home if we're on the home page
  const filteredBreadcrumbs =
    pathname === "/dashboard"
      ? [{ name: "Home", href: "/" }]
      : breadcrumbs.filter((crumb, index) => !(index === 0 && index === breadcrumbs.length - 1))

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {filteredBreadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Link
            href={crumb.href}
            className={cn(
              "hover:text-foreground transition-colors",
              index === filteredBreadcrumbs.length - 1 && "text-foreground font-medium",
            )}
          >
            {crumb.name}
          </Link>
        </div>
      ))}
    </nav>
  )
}
