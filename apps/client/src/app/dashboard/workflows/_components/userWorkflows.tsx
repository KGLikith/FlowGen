"use client"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, MoreHorizontal, Zap, Loader2, PlayIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Workflow, WorkflowStatus } from "@/gql/graphql"
import { useGetWorkflows } from "@/hooks/workflows/queries"
import { formatDate, getStatusBadge, getStatusIcon } from "./helpers"
import DeleteWorkflowDialog from "./deleteWorkflowDialog"
import CreateWorkflowDialog from "./createWorkflowDialog"
import WorkflowSkeleton from "@/components/skeletons/Workflow"
import { useRouter } from "next/navigation"
import { useRunWorkflow } from "@/hooks/workflows/mutation"
import RunDialog from "./runDialog"

export default function UserWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const router = useRouter()
  const { mutateAsync, isPending } = useRunWorkflow()
  const { workflowData, isLoading } = useGetWorkflows()

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
          className="border-border/60 bg-card transition-colors hover:bg-muted/40 hover:shadow-sm cursor-pointer group"
          onClick={() => {
            // navigate to editor on card click
            router.push(`/workflow/${workflow.id}/editor`)
          }}
        >
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 h-9 w-9 rounded-full bg-muted/70 group-hover:bg-muted flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-foreground/80 font-medium text-sm">
                    {workflow.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{workflow.name}</h3>
                    {getStatusIcon(workflow.status)}
                    {getStatusBadge(workflow.status)}
                  </div>

                  {workflow.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{workflow.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {workflow.lastRunAt && <span>Last run: {formatDate(workflow.lastRunAt)}</span>}
                    {workflow.nextRunAt && <span>Next run: {formatDate(workflow.nextRunAt)}</span>}
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {workflow.creditsCost} credits
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {workflow.status === WorkflowStatus.Active && (
                  <RunDialog
                    workflow={workflow}
                    loadingGlobal={isPending}
                    onRun={async () => {
                      if (!workflow?.executionPlan) return
                      const data = await mutateAsync({
                        workflowId: workflow.id,
                        executionPlan: workflow.executionPlan,
                      })
                      if (!data) return
                      router.push(`/workflow/${workflow.id}/runs/${data.id}`)
                    }}
                  />
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 bg-transparent hover:bg-muted/60"
                  onClick={() => {
                    router.push(`/workflow/${workflow.id}/editor`)
                  }}
                >
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground/80">Edit</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="hover:bg-muted/60">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {/* <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem> */}
                    <DeleteWorkflowDialog workflowId={workflow.id} workflowName={workflow.name} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {workflows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center mb-5">
            <Zap className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">No workflows yet</h3>
          <p className="text-muted-foreground text-center text-sm max-w-md mb-6">
            Workflows help you automate repetitive tasks. Create your first workflow to get started with automation.
          </p>
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        </div>
      )}
    </>
  )
}
