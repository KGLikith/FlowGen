import { User, Workflow } from '@/gql/graphql'
import React, { useEffect, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import { FlowValidationContextProvider } from '@/components/context/flowValidationContxt'
import { AppNode } from '@/schema/appNode'
import { useWorkflow } from '@/components/context/WorkflowProvider'
import TopBar from "@/app/workflow/[workflowId]/_components/topBar/TopBar"
import WorkflowSidebar from './sidebar'
import EditorLayout, { ActivePanel } from './helper'
import Loader from '@/components/loader'

type Props = {
    currentUser: User
}

export default function Editor({ currentUser }: Props) {
    const { setCurrentTriggerId, workflow } = useWorkflow()
    const [activePanel, setActivePanel] = useState<ActivePanel>("task")

    const flow = workflow?.definition ? JSON.parse(workflow.definition) : null;

    const node: AppNode | null = flow.nodes.find((node: AppNode) => {
        return node.data.trigger === true
    })

    useEffect(() => {
        if (node?.data?.triggerId) {
            setCurrentTriggerId(node.data.triggerId)
        }
    }, [workflow?.id, setCurrentTriggerId])

    if(!workflow){
        return <Loader />;
    }

    return (
        <FlowValidationContextProvider>
            <ReactFlowProvider>
                <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">

                    <TopBar title="Workflow editor" subtitle={`Workflow ${workflow.name}`} workflowId={workflow.id} workflowStaus={workflow.status} />
                    <div className="flex h-full w-full overflow-hidden">
                        <WorkflowSidebar
                            active={activePanel}
                            onSelect={(panel) => setActivePanel((prev) => (prev === panel ? null : panel))}
                        />
                        <div className='w-full'>
                            <EditorLayout
                                activePanel={activePanel}
                                setActivePanel={setActivePanel}
                                currentUser={currentUser}
                            />
                        </div>

                    </div>
                </div>
            </ReactFlowProvider>

        </FlowValidationContextProvider>
    )
}