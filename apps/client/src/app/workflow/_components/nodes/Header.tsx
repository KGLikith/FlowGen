'use client'
import { useTrigger } from '@/components/context/TaskProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { AppNode } from '@/schema/appNode'
import { TaskType } from '@/schema/task'
import { useReactFlow } from '@xyflow/react'
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import React from 'react'

type Props = {
    taskType: TaskType
    nodeId: string
    trigger: boolean
}

export default function NodeHeader({ taskType, nodeId, trigger }: Props) {
    const task = TaskRegistry[taskType]
    const { setCurrentTriggerId } = useTrigger();

    const { deleteElements, getNode, addNodes } = useReactFlow()
    return (
        <div className="flex items-center gap-2 p-2">
            <task.icon size={16} />
            <div className="flex justify-between items-center w-full">
                <p className='text-xs font-bold uppercase text-muted-foreground'>{task.label}</p>
                <div className="flex gap-1 items-center">
                    {task.isEntryPoint && <Badge>Entry Point</Badge>}
                    <Badge className='gap-2 flex items-center text-xs'>
                        <CoinsIcon size={16} /> {task.credits}
                    </Badge>

                    <Button variant={"ghost"} size="icon" className='cursor-pointer text-destructive'
                        onClick={() => {
                            if (trigger) setCurrentTriggerId(undefined);
                            deleteElements({
                                nodes: [{ id: nodeId }]
                            })
                        }}>
                        <TrashIcon size={12} />
                    </Button>
                    {
                        !task.isEntryPoint && (
                            <>
                                <Button variant={"ghost"} size="icon" className='cursor-pointer'
                                    onClick={() => {
                                        const node = getNode(nodeId) as AppNode
                                        const newX = node.position.x + 100
                                        const newY = node.position.y + 100

                                        const newNode = CreateFlowNode(node.data.type, { x: newX, y: newY })

                                        addNodes([newNode])
                                    }}
                                >
                                    <CopyIcon size={12} />
                                </Button>
                            </>
                        )
                    }
                    <Button variant={"ghost"} size="icon" className='drag-handle cursor-grab'>
                        <GripVerticalIcon size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}