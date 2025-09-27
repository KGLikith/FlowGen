
import { Home, Zap, Plug,  User, FileText,  DollarSign } from "lucide-react"

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Workflows", href: "/dashboard/workflows", icon: Zap },
  { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
]

export const profileNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Logs", href: "/dashboard/logs", icon: FileText },
]