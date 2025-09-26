import { AvailableTrigger, User, Workflow } from '@/gql/graphql'
import React, { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import TopBar from '@/app/workflow/_components/topBar/TopBar'
import TaskMenu from '@/app/workflow/_components/Taskmenu/taskMenu'
import { FlowValidationContextProvider } from '@/components/context/flowValidationContxt'
import { AppNode } from '@/schema/appNode'
import { useTrigger } from '@/components/context/TaskProvider'

type Props = {
    workflow: Workflow
    currentUser: User
}

export default function Editor({ workflow, currentUser }: Props) {
    const { setCurrentTriggerId } = useTrigger()

    const flow = workflow.definition ? JSON.parse(workflow.definition) : null;

    const node: AppNode | null = flow.nodes.find((node: AppNode) => {
        return node.data.trigger === true
    })

    useEffect(() => { 
        console.log("node changed", node)
        if (node?.data?.triggerId) {
            console.log("hello trigger changed", node.data.triggerId)
            setCurrentTriggerId(node.data.triggerId)
        }
    }, [workflow.id,setCurrentTriggerId])


    return (
            <FlowValidationContextProvider>
                <ReactFlowProvider>
                    <div className='flex flex-col h-full w-full overflow-hidden'>
                        <TopBar title="Workflow editor" subtitle={workflow.name} workflowId={workflow.id} />
                        <section className='flex h-full overflow-auto'>
                            <TaskMenu />
                            <FlowEditor workflow={workflow} currentUser={currentUser} />
                        </section>
                    </div>
                </ReactFlowProvider>

            </FlowValidationContextProvider>
    )
}