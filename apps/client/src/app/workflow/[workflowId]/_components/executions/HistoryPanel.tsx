'use client'
import LoaderIc from '@/components/loader'
import { WorkflowExecution, WorkflowExecutionStatus } from '@/gql/graphql'
import { useGetWorkflowExecutions } from '@/hooks/workflows/queries'
import React, { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { X, Filter, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import ExecutionItem from './executionItem'

type Props = {
  workflowId: string
  onClose: () => void
}

type TimeRange = "7d" | "30d" | "90d" | "all"

export default function HistoryPanel({ workflowId, onClose }: Props) {
  const { data, isLoading } = useGetWorkflowExecutions(workflowId);
  const [status, setStatus] = useState<WorkflowExecutionStatus | "ALL">("ALL")
  const [range, setRange] = useState<TimeRange>("30d")


  const filtered = useMemo(() => {
    const now = Date.now()
    const rangeMs =
      range === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : range === "30d"
          ? 30 * 24 * 60 * 60 * 1000
          : range === "90d"
            ? 90 * 24 * 60 * 60 * 1000
            : Number.POSITIVE_INFINITY

    return data?.getWorkflowExecutions?.filter((e) => {
      if (status !== "ALL" && e.status !== status) return false
      const started = new Date(e.startedAt).getTime()
      return now - started <= rangeMs
    })
  }, [data?.getWorkflowExecutions, range, status])

  if (isLoading) {
    return <div className='flex h-full w-full justify-center items-center text-foreground '>
      <Loader2 className='w-5 h-5 animate-spin' />
    </div>
      
  }

  if (!data) {
    return <div>No execution history found</div>
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-medium">Execution History</h2>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close history">
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Filter className="size-4 text-muted-foreground" />
        <Select value={status} onValueChange={(v: any) => setStatus(v)}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="RUNNING">Running</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={range} onValueChange={(v: TimeRange) => setRange(v)}>
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-full rounded-md border pb-28 pr-2">
        <div className="flex flex-col gap-2 p-2 sm:p-3">
          {filtered?.length === 0 ? (
            <p className="text-sm text-muted-foreground px-1">
              No executions found for selected filters.
            </p>
          ) : (
            filtered?.map((exec) => (
              <ExecutionItem
                key={exec.id}
                workflowId={workflowId}
                exec={exec as WorkflowExecution}
              />
            ))
          )}
        </div>
      </ScrollArea>


    </div>
  )
}