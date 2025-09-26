"use client"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Edit, MoreHorizontal, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Workflow } from "@/gql/graphql"
import { useGetWorkflows } from "@/hooks/workflows/queries"
import { formatDate, getStatusBadge, getStatusIcon } from "./helpers"
import DeleteWorkflowDialog from "./deleteWorkflowDialog"
import CreateWorkflowDialog from "./createWorkflowDialog"
import WorkflowSkeleton from "@/components/skeletons/Workflow"

export default function UserWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  const { workflowData, isLoading, error } = useGetWorkflows()
 
  useEffect(() => {
    if (workflowData) {
      setWorkflows(workflowData)
    }
  }, [workflowData])

  if (isLoading) {
    return <WorkflowSkeleton />
  }

  return (
    <>
      {workflows.map((workflow) => (
        <Card
          key={workflow.id}
          className="transition-all hover:shadow-lg hover:shadow-primary/5 border-border/50 hover:border-border cursor-pointer group"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                  <span className="text-primary font-semibold text-sm">{workflow.name.charAt(0).toUpperCase()}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {workflow.name}
                    </h3>
                    {getStatusIcon(workflow.status)}
                    {getStatusBadge(workflow.status)}
                  </div>

                  {workflow.description && (
                    <p className="text-sm text-muted-foreground mb-2 truncate">{workflow.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {workflow.lastRunAt && <span>Last run: {formatDate(workflow.lastRunAt)}</span>}
                    {workflow.nextRunAt && <span>Next run: {formatDate(workflow.nextRunAt)}</span>}
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {workflow.creditsCost} credits
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1 bg-transparent hover:bg-primary/5 cursor-pointer">
                  <Play className="h-3 w-3" />
                  Run
                </Button>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent hover:bg-primary/5 cursor-pointer"
                  onClick={()=>{
                    window.location.href = `/workflow/editor/${workflow.id}`
                  }}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="cursor-pointer hover:bg-muted/50">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                    <DeleteWorkflowDialog
                      workflowId={workflow.id}
                      workflowName={workflow.name}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {workflows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <Zap className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No workflows yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Workflows help you automate repetitive tasks. Create your first workflow to get started with automation.
          </p>
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        </div>
      )}
    </>
  )
}
