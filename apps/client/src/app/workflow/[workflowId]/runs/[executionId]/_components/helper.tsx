import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { WorkflowExecutionStatus, WorkflowExecutionType } from "@/gql/graphql"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: WorkflowExecutionStatus }) {
  const variants: Record<WorkflowExecutionStatus, string> = {
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    RUNNING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  }

  return (
    <Badge
      variant="secondary"
      className={cn("px-2 py-0.5 text-xs font-medium rounded-md", variants[status])}
    >
      {status}
    </Badge>
  )
}

export function TypeBadge({ type }: { type: WorkflowExecutionType }) {
  const variants: Record<WorkflowExecutionType, string> = {
    MANUAL: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
    SCHEDULED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    TRIGGERED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  }

  return (
    <Badge
      variant="secondary"
      className={cn("px-2 py-0.5 text-xs font-medium rounded-md", variants[type])}
    >
      {type}
    </Badge>
  )
}

export const formatDuration = (startedAt?: string | null, completedAt?: string | null) => {
  if (!startedAt) return "Not started"
  if (!completedAt) return "Running..."

  const start = new Date(startedAt)
  const end = new Date(completedAt)
  const diffMs = end.getTime() - start.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const minutes = Math.floor(diffSec / 60)
  const seconds = diffSec % 60

  return `${minutes}m ${seconds}s`
}

export const formatPhaseName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}