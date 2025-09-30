"use client"
import Unauthorized from "@/components/unauthorized"
import { useGetCurrentUser } from "@/hooks/user"
import { useGetWorkflowExecutionWithPhases } from "@/hooks/workflows/queries"
import { useState, useEffect } from "react"
import type { ExecutionPhase, WorkflowExecution } from "@/gql/graphql"
import PageNotExist from "@/components/page_not_exist"
import TopBar from "@/app/workflow/_components/topBar/TopBar"
import ExecutionDetails from "./ExecutionDetails"
import ExecutionPhases from "./ExecutionPhases"
import PhaseDetails from "./PhaseDetails"
import LoaderIc from "@/components/loader"
import { Loader2 } from "lucide-react"

type Props = {
    executionId: string
    workflowId: string
}

export default function ExecutionView({ executionId, workflowId }: Props) {
    const { user, isLoading } = useGetCurrentUser()
    const { workflowExecution, isLoading: isLoadingExecution } = useGetWorkflowExecutionWithPhases(executionId)
    const [selectedPhaseId, setSelectedPhaseId] = useState<string>()

    useEffect(() => {
        if (!workflowExecution?.phases) return

        const phases = workflowExecution.phases as ExecutionPhase[]

        const runningPhase = phases.find((phase) => phase.status === "RUNNING")
        if (runningPhase) {
            setSelectedPhaseId(runningPhase.id)
            return
        }

        const executedPhases = phases
            .filter((phase) => phase.status === "COMPLETED" || phase.status === "FAILED")
            .sort((a, b) => b.number - a.number)

        if (executedPhases.length > 0) {
            setSelectedPhaseId(executedPhases[0].id)
        }
    }, [workflowExecution?.phases])

    if (isLoading || isLoadingExecution) {
        return (
            <LoaderIc />
        )
    }

    if (!user) {
        return <Unauthorized />
    }

    if (!workflowExecution) {
        return <PageNotExist />
    }

    const isRunning = workflowExecution.status === "RUNNING" || workflowExecution.status === "PENDING"

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <TopBar title="Workflow run details" subtitle={`Run ID: ${executionId}`} workflowId={workflowId} hideButtons />
            <section className="flex h-full overflow-auto">
                <div className="w-80 min-w-80 border-r border-border bg-background p-3 overflow-y-auto">
                    <div className="space-y-3">
                        <ExecutionDetails execution={workflowExecution as WorkflowExecution} />
                        <ExecutionPhases
                            phases={(workflowExecution.phases as ExecutionPhase[]) || []}
                            selectedPhaseId={selectedPhaseId}
                            onPhaseSelect={setSelectedPhaseId}
                            isRunning={isRunning}
                        />
                    </div>
                </div>
                <div className="flex-1 bg-muted/20 overflow-y-auto">
                    {selectedPhaseId ? (
                        !isRunning ? (
                            <PhaseDetails
                                phase={workflowExecution.phases?.find((phase) => phase.id === selectedPhaseId) as ExecutionPhase}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full gap-3">
                                <p className="text-muted-foreground animate-pulse">The selected phase is currently running</p>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Select a phase to view details</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
