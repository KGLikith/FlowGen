"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { WorkflowIcon, History } from "lucide-react"

type Props = {
  active: "task" | "history" | null
  onSelect: (panel: "task" | "history") => void
}

export default function WorkflowSidebar({ active, onSelect }: Props) {
  return (
    <TooltipProvider>
      <aside className="flex h-full w-[56px] min-w-[56px] max-w-[56px] flex-col items-center gap-2 border-r bg-background p-2">
        <SidebarIcon
        
          active={active === "task"}
          onClick={() => onSelect("task")}
          icon={<WorkflowIcon className="size-5" />}
          tooltip="Actions / Trigger"
        />
        <SidebarIcon
          active={active === "history"}
          onClick={() => onSelect("history")}
          icon={<History className="size-5" />}
          tooltip="Execution History"
        />
      </aside>
    </TooltipProvider>
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
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
}
