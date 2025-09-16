
import { Home, Zap, Plug, Settings, User, FileText, Menu, DollarSign } from "lucide-react"

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Automations", href: "/dashboard/automations", icon: Zap },
  { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
]

export const profileNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Logs", href: "/dashboard/logs", icon: FileText },
]