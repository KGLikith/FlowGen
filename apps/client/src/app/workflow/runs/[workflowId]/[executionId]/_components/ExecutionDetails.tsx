"use client"

import { Clock, Zap, Timer, type LucideIcon, Loader } from "lucide-react"
import type { WorkflowExecution } from "@/gql/graphql"
import { formatDuration } from "./helper"
import { formatDistanceToNow } from "date-fns"

interface ExecutionDetailsProps {
  execution: WorkflowExecution
}

export default function ExecutionDetails({ execution }: ExecutionDetailsProps) {
  const duration =
    execution.startedAt && execution.completedAt
      ? formatDuration(execution.startedAt, execution.completedAt)
      : null

  return (
    <div className="space-y-2 pb-3 border-b-2 border-foreground/40">
      <ExecutionDetailCard title="Status" value={execution.status} icon={Loader} highlight />
      <ExecutionDetailCard
        title="Started At"
        value={
          execution.startedAt
            ? formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })
            : "Not started"
        }
        icon={Clock}
      />
      <ExecutionDetailCard
        title="Duration"
        value={duration ?? ""}
        icon={Timer}
        isLoading={!execution.completedAt}
      />
      <ExecutionDetailCard title="Credits" value={String(execution.creditsConsumed)} icon={Zap} highlight />
    </div>
  )
}

export function ExecutionDetailCard({
  title,
  value,
  icon: Icon,
  highlight = false,
  isLoading = false,
}: {
  title: string
  value: string
  icon: LucideIcon
  highlight?: boolean
  isLoading?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors">
      <div className="flex gap-2 items-center">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <span className={`text-sm font-medium ${highlight ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
        {isLoading ? (
          <div className="flex items-center gap-1">
            <Loader className="h-5 w-5 animate-spin" />
            {/* <span>Loading...</span> */}
          </div>
        ) : (
          value
        )}
      </span>
    </div>
  )
}
