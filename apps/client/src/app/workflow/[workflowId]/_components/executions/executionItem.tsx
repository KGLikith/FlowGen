import { WorkflowExecution } from '@/gql/graphql'
import React from 'react'
import { formatDateTime, StatusDot } from './helper'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Props = {
  workflowId: string
  exec: WorkflowExecution
}

export default function ExecutionItem({ workflowId, exec }: Props) {
  const finished = exec.completedAt ? new Date(exec.completedAt) : null

  return (
    <Link
      href={`/workflow/${workflowId}/runs/${exec.id}`}
      className="group flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm hover:bg-muted/60 transition"
    >
      <div className="min-w-0 flex-1">
        {/* Top row: status + trigger + credits */}
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <StatusDot status={exec.status} />
          <span>{exec.status}</span>

          {exec.trigger && (
            <span className="text-muted-foreground text-xs px-2 py-0.5 rounded bg-muted">
              {exec.trigger}
            </span>
          )}

          {typeof exec.creditsConsumed === "number" && (
            <span className="text-muted-foreground text-xs">
              {exec.creditsConsumed} cr
            </span>
          )}
        </div>

        {/* Bottom row: completed time */}
        <div className="mt-1 text-xs text-muted-foreground truncate">
          {finished ? formatDateTime(finished) : "—"}
        </div>
      </div>

      <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-3" />
    </Link>
  )
}
