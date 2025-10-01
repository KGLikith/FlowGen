import { User, Workflow } from '@/gql/graphql'
import React, { useEffect, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import { FlowValidationContextProvider } from '@/components/context/flowValidationContxt'
import { AppNode } from '@/schema/appNode'
import { useTrigger } from '@/components/context/TaskProvider'
import TopBar from "@/app/workflow/[workflowId]/_components/topBar/TopBar"
import TaskMenu from "@/app/workflow/[workflowId]/_components/Taskmenu/taskMenu"
import WorkflowSidebar from './sidebar'
import HistoryPanel from '../../_components/executions/HistoryPanel'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

type Props = {
    workflow: Workflow
    currentUser: User
}
type ActivePanel = "task" | "history" | null

export default function Editor({ workflow, currentUser }: Props) {
    const { setCurrentTriggerId } = useTrigger()
    const [activePanel, setActivePanel] = useState<ActivePanel>("task")

    const flow = workflow.definition ? JSON.parse(workflow.definition) : null;

    const node: AppNode | null = flow.nodes.find((node: AppNode) => {
        return node.data.trigger === true
    })

    useEffect(() => {
        if (node?.data?.triggerId) {
            setCurrentTriggerId(node.data.triggerId)
        }
    }, [workflow.id, setCurrentTriggerId])

    return (
        <FlowValidationContextProvider>
            <ReactFlowProvider>
                <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">

                    <TopBar title="Workflow editor" subtitle={`Workflow ${workflow.name}`} workflowId={workflow.id} />
                    <div className="flex h-full w-full overflow-hidden">
                        <WorkflowSidebar
                            active={activePanel}
                            onSelect={(panel) => setActivePanel((prev) => (prev === panel ? null : panel))}
                        />

                        {activePanel ? activePanel === "task" ? (
                            <>
                                {/* Task menu: small + resizable */}
                                <TaskMenu onClose={() => setActivePanel(null)} />
                                <FlowEditor workflow={workflow} currentUser={currentUser} />
                            </>
                        ) : (
                            <>
                                {/* History panel: fixed width, not resizable */}
                                <div className="w-[360px] max-w-sm border-r">
                                    <HistoryPanel workflowId={workflow.id} onClose={() => setActivePanel(null)} />
                                </div>
                                <div className="flex-1">
                                    <FlowEditor workflow={workflow} currentUser={currentUser} />
                                </div>
                            </>
                        )
                            : (
                                <div className="flex-1">
                                    <FlowEditor workflow={workflow} currentUser={currentUser} />
                                </div>
                            )}

                    </div>
                </div>
            </ReactFlowProvider>

        </FlowValidationContextProvider>
    )
}