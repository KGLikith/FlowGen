'use client'
import TopBar from '@/app/workflow/_components/topBar/TopBar'
import Loader from '@/components/loader'
import PageNotExist from '@/components/page_not_exist'
import Unauthorized from '@/components/unauthorized'
import { useGetCurrentUser } from '@/hooks/user'
import { useGetWorkflowExecutionWithPhases } from '@/hooks/workflows/queries'
import React, { useState } from 'react'
import ExecutionDetails from './ExecutionDetails'
import ExecutionPhases from './ExecutionPhases'
import { ExecutionPhase, WorkflowExecution } from '@/gql/graphql'

type Props = {
    executionId: string
    workflowId: string
}

export default function ExecutionView({ executionId, workflowId }: Props) {
    const { user, isLoading } = useGetCurrentUser();
    const { workflowExecution, isLoading: isLoadingExecution } = useGetWorkflowExecutionWithPhases(executionId);
    const [selectedPhaseId, setSelectedPhaseId] = useState<string>()

    if (isLoading || isLoadingExecution) {
        return <div className='flex h-full w-full justify-center items-center bg-background'>
            <Loader state color='bg-foreground' />
        </div>
    }

    if (!user) {
        return <Unauthorized />
    }

    if (!workflowExecution) {
        return <PageNotExist />
    }

    const isRunning = workflowExecution.status === "RUNNING"

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <TopBar title="Workflow Runs" subtitle={`Run ID: ${executionId}`} workflowId={workflowId} hideButtons />
            <section className='flex h-full overflow-auto'>
                <div className="w-80 min-w-80 border-r border-border bg-background p-3 overflow-y-auto">
                    <div className="space-y-3">
                        <ExecutionDetails execution={workflowExecution as WorkflowExecution} />
                        <ExecutionPhases
                            phases={workflowExecution.phases as ExecutionPhase[] || []}
                            selectedPhaseId={selectedPhaseId}
                            onPhaseSelect={setSelectedPhaseId}
                            isRunning={isRunning}
                        />
                    </div>
                </div>
                <div className="flex-1 bg-muted/20 flex items-center justify-center">
                    <div className=" space-y-2">
                        {/* <p className="text-muted-foreground"> */}
                            {selectedPhaseId ? <pre>
                                {JSON.stringify(workflowExecution.phases?.find(phase => phase.id === selectedPhaseId), null, 2)}

                            </pre> : "Select a phase to view details"}
                        {/* </p> */}
                    </div>
                </div>
            </section>
        </div>
    )
}