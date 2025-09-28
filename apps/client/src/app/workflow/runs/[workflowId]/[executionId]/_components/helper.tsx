import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

export const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          PENDING
        </Badge>
      )
    case "running":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          RUNNING
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          COMPLETED
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
          FAILED
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
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


export const getPhaseStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "created":
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20 text-xs">
          CREATED
        </Badge>
      )
    case "running":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
          RUNNING
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
          COMPLETED
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">
          FAILED
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      )
  }
}

export const formatPhaseName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}