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
        <div className='flex flex-col '>{children}</div>
    )
}

export function NodeInput({ input, nodeId, disabled }: { input: TaskParam, nodeId: string, disabled: boolean }) {
    const { invalidInputs } = useFlowValidation();
    const edges = useEdges();
    const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);

    const hasErrors = invalidInputs.some(invalid => invalid.nodeId === nodeId && invalid.inputs.includes(input.name));

    return (
        <div className={cn("flex justify-start relative p-3 bg-secondary w-full",
            { "bg-destructive/50": hasErrors },
        )}>
            <span
        className={cn('ml-2 text-muted-foreground truncate', {
          'text-white': hasErrors,
        })}
      >
        {input.name}
      </span>
            {/* <NodeParamField param={input} nodeId={nodeId} disabled={isConnected || disabled} /> */}
            <Handle
                id={input.name}
                isConnectable={!isConnected && !disabled}
                type="target"
                position={Position.Left}
                className={cn('!bg-muted-foreground/50 !border-2 !border-background !-left-2 !w-3 !h-3',
                    input.hideHandle && 'hidden',
                    ColorForHandle[input.type]
                )}
            />
        </div>
    )
}