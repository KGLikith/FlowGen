import { Badge } from "@/components/ui/badge"
import { WorkflowExecutionStatus } from "@/gql/graphql"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: WorkflowExecutionStatus }) {
  const styles =
    status === "COMPLETED"
      ? "bg-green-100 text-green-700 border-green-200"
      : status === "FAILED"
        ? "bg-red-100 text-red-700 border-red-200"
        : status === "RUNNING"
          ? "bg-blue-100 text-blue-700 border-blue-200"
          : "bg-amber-100 text-amber-700 border-amber-200"

  return (
    <Badge variant="outline" className={cn("border", styles)}>
      {status}
    </Badge>
  )
}

export function formatDateTime(d: Date) {
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export function formatDuration(ms: number) {
  const sec = Math.floor(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function StatusDot({ status }: { status: WorkflowExecutionStatus }) {
  const colors: Record<WorkflowExecutionStatus, string> = {
    COMPLETED: "bg-green-500",
    FAILED: "bg-red-500",
    RUNNING: "bg-blue-500 animate-pulse",
    PENDING: "bg-amber-500",
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 rounded-full shadow-sm",
        colors[status] || "bg-gray-400"
      )}
    />
  )
}