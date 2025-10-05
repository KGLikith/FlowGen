"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ActivePanel, sidebarItems } from "./helper"
import { ThemeToggle } from "@/components/theme-toggle"

type Props = {
  active: ActivePanel
  onSelect: (panel: ActivePanel) => void
}

export default function WorkflowSidebar({ active, onSelect }: Props) {
  return (
    <aside className="flex h-full w-[56px] min-w-[56px] max-w-[56px] flex-col  border-r bg-background p-2 justify-between">
      <TooltipProvider>
        <div className="flex flex-col items-center gap-2">
          {
            sidebarItems.map((item) => (
              <SidebarIcon
                key={item.id}
                active={active === item.id}
                onClick={() => onSelect(item.id as "task" | "history")}
                icon={item.icon}
                tooltip={item.tooltip}
              />
            ))
          }
        </div>
        <ThemeToggle />
      </TooltipProvider>

    </aside>
  )
}

function SidebarIcon({
  active,
  onClick,
  icon,
  tooltip,
}: {
  active?: boolean
  onClick?: () => void
  icon: React.ReactNode
  tooltip: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "flex size-10 items-center justify-center rounded-md border transition-colors cursor-pointer",
            active ? "bg-muted" : "hover:bg-muted/60",
          )}
          aria-label={tooltip}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent className="font-semibold text-background" side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
}
