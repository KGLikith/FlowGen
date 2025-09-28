import { Clock, Zap, Timer, LucideIcon, Loader } from "lucide-react"
import type { WorkflowExecution } from "@/gql/graphql"
import { formatDuration } from "./helper"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"

interface ExecutionDetailsProps {
    execution: WorkflowExecution
}

export default function ExecutionDetails({ execution }: ExecutionDetailsProps) {
    const [liveDuration, setLiveDuration] = useState(
        formatDuration(execution.startedAt, execution.completedAt)
    )

    useEffect(() => {
        if (!execution.startedAt || execution.completedAt) return

        if(execution.completedAt) {
            setLiveDuration(formatDuration(execution.startedAt, execution.completedAt))
            return
        }

        const interval = setInterval(() => {
            setLiveDuration(formatDuration(execution.startedAt, (new Date()).toISOString()))
        }, 1000)

        return () => clearInterval(interval)
    }, [execution.startedAt, execution.completedAt])

    return (
        <div className="space-y-2 pb-3 border-b-2 border-foreground/40 ">
            <ExecutionDetailCard
                title="Status"
                value={execution.status}
                icon={Loader}
                highlight
            />
            <ExecutionDetailCard
                title="Started At"
                value={
                    execution.startedAt
                        ? formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })
                        : "Not started"
                }
                icon={Clock}
            />
            <ExecutionDetailCard
                title="Duration"
                value={liveDuration}
                icon={Timer}
            />
            <ExecutionDetailCard
                title="Credits"
                value={String(execution.creditsConsumed)}
                icon={Zap}
                highlight
            />
        </div>
    )
}

export function ExecutionDetailCard({
    title,
    value,
    icon: Icon,
    highlight = false,
}: {
    title: string
    value: string
    icon: LucideIcon
    highlight?: boolean
}) {
    return (
        <div className="flex items-center justify-between rounded-lg px-2 py-1  transition-colors">
            <div className="flex gap-2 items-center">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{title}</span>
            </div>
            <span
                className={`text-sm font-medium ${highlight ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
            >
                {value}
            </span>
        </div>
    )
}
