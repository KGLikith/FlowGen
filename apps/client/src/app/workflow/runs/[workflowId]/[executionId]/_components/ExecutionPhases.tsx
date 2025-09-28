"use client"

import { cn } from "@/lib/utils"
import type { ExecutionPhase } from "@/gql/graphql"
import { formatPhaseName } from "./helper"
import { Workflow, Check, X, Loader, Loader2, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExecutionPhasesProps {
  phases: ExecutionPhase[]
  selectedPhaseId?: string
  onPhaseSelect?: (phaseId: string) => void
  isRunning: boolean
}

export default function ExecutionPhases({ phases, selectedPhaseId, onPhaseSelect, isRunning }: ExecutionPhasesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 pb-2 border-b-2 border-border">
        <Workflow className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground tracking-wide">Phases</span>
      </div>

      <div className="space-y-2">
        {phases.map((phase) => {
          const isSelected = selectedPhaseId === phase.id
          return (
            <Button
              key={phase.id}
              disabled={isRunning}
              variant="ghost"
              onClick={() => onPhaseSelect?.(phase.id)}
              className={cn(
                "py-4 px-3 flex w-full items-center justify-between rounded-lg text-left",
                isSelected ? "bg-primary/10" : "hover:bg-muted/60",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors flex-shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground",
                  )}
                >
                  {phase.number}
                </span>
                <span
                  className={cn(
                    "text-sm truncate transition-colors",
                    isSelected ? "text-foreground font-medium" : "text-foreground/60",
                  )}
                >
                  {formatPhaseName(phase.name)}
                </span>
              </div>
              <div className="flex-shrink-0">
                {phase.status === "RUNNING" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                {phase.status === "COMPLETED" && <Check className="h-4 w-4 text-green-500" />}
                {phase.status === "FAILED" && <X className="h-4 w-4 text-red-500" />}
                {phase.status === "CREATED" && (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                )}
                {phase.status === "CANCELLED" && (
                  <Ban className="h-4 w-4 text-red-500" />
                )}
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
