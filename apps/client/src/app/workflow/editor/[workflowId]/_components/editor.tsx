import { User, Workflow } from '@/gql/graphql'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'

type Props = {
    workflow: Workflow
    currentUser: User
}

export default function Editor({ workflow, currentUser }: Props) {
    return (
        <ReactFlowProvider>
            <div className='flex flex-col h-full w-full overflow-hidden'>
                <section className='flex h-full overflow-auto'>
                    <FlowEditor workflow={workflow} currentUser={currentUser} />
                </section>
            </div>
        </ReactFlowProvider>
    )
}