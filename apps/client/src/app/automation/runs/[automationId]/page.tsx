import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, Edit, MoreHorizontal, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const workflows = [
  {
    id: 1,
    name: "Demo workflow",
    status: "completed",
    schedule: "Every minute",
    lastRun: "2024-11-01 09:01",
    nextRun: "2024-11-01 09:02",
    icon: "🟢",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Amazon prices",
    status: "completed",
    schedule: "At 10:00 AM, only on Monday",
    lastRun: "2024-11-04 10:00",
    nextRun: "2024-11-11 10:00",
    icon: "🟢",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Demo youtube",
    status: "draft",
    schedule: null,
    lastRun: null,
    nextRun: null,
    icon: "🟡",
    color: "bg-yellow-500",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-blue-500" />
    case "running":
      return <Clock className="h-4 w-4 text-blue-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Completed
        </Badge>
      )
    case "running":
      return (
        <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Running
        </Badge>
      )
    case "error":
      return <Badge variant="destructive">Error</Badge>
    case "draft":
      return <Badge variant="secondary">Draft</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function AutomationsPage() {
  return (
    <DashboardLayout credits={{ current: 649, total: 1000 }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workflows</h1>
            <p className="text-muted-foreground">Manage your workflows</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Create workflow</Button>
        </div>

        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", workflow.color)}>
                      <span className="text-white font-semibold text-sm">{workflow.name.charAt(0).toUpperCase()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{workflow.name}</h3>
                        {getStatusIcon(workflow.status)}
                        {getStatusBadge(workflow.status)}
                      </div>

                      {workflow.schedule && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" />
                          {workflow.schedule}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {workflow.lastRun && <span>Last run: {workflow.lastRun}</span>}
                        {workflow.nextRun && <span>Next run: {workflow.nextRun}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                      <Play className="h-3 w-3" />
                      Run
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {workflows.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No workflows yet</h3>
            <p className="text-muted-foreground mb-4">Create your first workflow to get started with automation.</p>
            <Button>Create your first workflow</Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
