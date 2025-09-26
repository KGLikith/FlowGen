import { cn } from '@/lib/utils'
import { Handle, Position, useEdges } from '@xyflow/react'
import React from 'react'
import NodeParamField from './ParamField'
import { ColorForHandle } from './common'
import useFlowValidation from '@/hooks/useFlowValidation'
import { TaskParam } from '@/gql/graphql'

type Props = {
    children: React.ReactNode
}

export function NodeInputs({ children }: Props) {
    return (
        <div className='flex flex-col gap-2 divide-y'>{children}</div>
    )
}

export function NodeInput({ input, nodeId }: { input: TaskParam, nodeId: string }) {
    const { invalidInputs } = useFlowValidation();
    const edges = useEdges();
    const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);  

    const hasErrors = invalidInputs.some(invalid => invalid.nodeId === nodeId && invalid.inputs.includes(input.name));

    return (
        <div className={cn("flex justify-start relative p-3 bg-secondary w-full",
            { "bg-red-500/10": hasErrors },
        )}>
            <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
            <Handle
                id={input.name}
                isConnectable={!isConnected}
                type="target"
                position={Position.Left}
                className={cn('!bg-muted-foreground/50 !border-2 !border-background !-left-2 !w-4 !h-4',
                    input.hideHandle && 'hidden',
                    ColorForHandle[input.type]
                )}
            />
        </div>
    )
}