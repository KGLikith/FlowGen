'use client'

import { useWorkflow } from '@/components/context/WorkflowProvider'
import { Button } from '@/components/ui/button'
import { WorkflowStatus } from '@/gql/graphql'
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react'
import React from 'react'

export default function DeletableEdge(props: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath(props)
    const { setEdges } = useReactFlow();
    const { workflow } = useWorkflow();
    return (
        <>
            <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: "all",
                    }}
                >
                    {workflow?.status === WorkflowStatus.Draft && <Button
                        variant={"outline"}
                        size={"icon"}
                        className='w-8 h-8 border cursor-pointer rounded-full text-base leading-none hover:shadow-lg'
                        onClick={() => {
                            setEdges((eds) => eds.filter(e => e.id !== props.id))
                        }}
                    >
                        x
                    </Button>}
                </div>
            </EdgeLabelRenderer >
        </>
    )
}