import { Badge } from "@/components/ui/badge"
import { WorkflowStatus } from "@/gql/graphql"
import { Clock, CheckCircle } from "lucide-react"

export const getStatusIcon = (status: string) => {
  switch (status) {
    case WorkflowStatus.Active:
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case WorkflowStatus.Draft:
    case "draft":
      return <Clock className="h-4 w-4 text-orange-500" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case WorkflowStatus.Active:
    case "active":
      return (
        <Badge
          variant="default"
          className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 cursor-pointer"
        >
          Active
        </Badge>
      )
    case WorkflowStatus.Draft:
    case "draft":
      return (
        <Badge
          variant="default"
          className="bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20 cursor-pointer"
        >
          Draft
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="cursor-pointer">
          Unknown
        </Badge>
      )
  }
}

export const formatDate = (date: Date) => {
  if (!date) return null
  return new Date(date).toLocaleString()
}
