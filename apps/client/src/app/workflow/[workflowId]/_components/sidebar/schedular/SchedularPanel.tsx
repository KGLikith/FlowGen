"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import CloseButton from "../CloseButton"
import { useWorkflow } from "@/components/context/WorkflowProvider"
import { useUpdateWorkflowCron, useDeleteWorkflowCron } from "@/hooks/workflows/mutation"
import cronstrue from "cronstrue"
import BuildSchedular from "./BuildSchedular"
import { ScrollArea } from "@/components/ui/scroll-area"
import CronExpression from "./cronExpression"

type Props = {
  onClose: () => void
}

export default function SchedularPanel({ onClose }: Props) {
  const { workflow } = useWorkflow()
  const { mutateAsync: updateCron } = useUpdateWorkflowCron(workflow?.id ?? "")
  const { mutateAsync: deleteCron } = useDeleteWorkflowCron(workflow?.id ?? "")
  const [expressionDraft, setExpressionDraft] = useState<string>("")
  const [builderDraft, setBuilderDraft] = useState<string>("")

  const currentReadable = useMemo(() => {
    if (!workflow?.cron) return ""
    try {
      return cronstrue.toString(workflow.cron, { use24HourTimeFormat: true })
    } catch {
      return ""
    }
  }, [workflow?.cron])

  const handleSave = async (draft: string, isValid: boolean) => {
    if (!workflow?.id) return
    if (!isValid) return
    if (draft === (workflow?.cron ?? "")) return
    await updateCron({ cron: draft, workflowId: workflow.id })
    setExpressionDraft("")
    setBuilderDraft("")
  }

  const handleDelete = async () => {
    if (!workflow?.id) return
    await deleteCron({ workflowId: workflow.id })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Schedule Workflows</h2>
        <CloseButton onClose={onClose} />
      </header>

      <ScrollArea className="h-full rounded-md border pb-14  pr-2">

        <div className="flex-1 overflow-auto px-2 py-4 space-y-2">
          <h3 className="text-sm font-medium text-foreground">Current schedule</h3>
          <section className="rounded-lg border bg-muted/40 p-4 space-y-3">
            {workflow?.cron && currentReadable ? (
              <div className="text-sm">{currentReadable}</div>
            ) : (
              <div className="text-sm text-muted-foreground">No schedule set</div>
            )}
            <div className="pt-1">
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={!workflow?.cron}>
                Remove schedule
              </Button>
            </div>
          </section>

          <h3 className="text-sm font-medium text-foreground">Schedule:</h3>

          <CronExpression handleSave={handleSave} workflowCron={workflow?.cron ?? ""} draft={expressionDraft} setDraft={setExpressionDraft} />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <BuildSchedular handleSave={handleSave} workflowCron={workflow?.cron ?? ""} draft={builderDraft} setDraft={setBuilderDraft} />

        </div>
      </ScrollArea>

    </div>
  )
}
