import { User, Workflow } from '@/gql/graphql'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import TopBar from '@/app/workflow/_components/topBar/TopBar'
import TaskMenu from '@/app/workflow/_components/Taskmenu/taskMenu'

type Props = {
    workflow: Workflow
    currentUser: User
}

export default function Editor({ workflow, currentUser }: Props) {
    return (
        <ReactFlowProvider>
            <div className='flex flex-col h-full w-full overflow-hidden'>
                <TopBar title="Workflow editor" subtitle={workflow.name} workflowId={workflow.id} />
                <section className='flex h-full overflow-auto'>
                    <TaskMenu />
                    <FlowEditor workflow={workflow} currentUser={currentUser} />
                </section>
            </div>
        </ReactFlowProvider>
    )
}