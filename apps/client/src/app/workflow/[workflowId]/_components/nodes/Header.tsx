'use client'
import { useWorkflow } from '@/components/context/WorkflowProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ActionKey, TaskParamType, TriggerKey, WorkflowStatus } from '@/gql/graphql'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { AppNode } from '@/schema/appNode'
import { useReactFlow } from '@xyflow/react'
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import React from 'react'

type Props = {
    taskType: ActionKey | TriggerKey
    nodeId: string
    isTrigger: boolean
}

export default function NodeHeader({ taskType, nodeId, isTrigger }: Props) {
    const { allActions, trigger, setCurrentTriggerId, workflow } = useWorkflow();
    const combined = [...(allActions || []), trigger];
    const task = combined.find(item => item?.key === taskType);

    const { deleteElements, getNode, addNodes } = useReactFlow()

    if (!task) return <div>Unknown task: {taskType}</div>

    return (
        <div className="flex items-center gap-2 p-2">

            {/* <task.icon size={16} />  task icon is missing TODO */}
            <div className="flex justify-between items-center w-full">
                <p className='text-xs font-bold uppercase text-muted-foreground'>{task.taskInfo.label}</p>
                <div className="flex gap-1 items-center">
                    {task.taskInfo.isEntryPoint && <Badge>Entry Point</Badge>}
                    <Badge className='gap-2 flex items-center text-xs'>
                        <CoinsIcon size={16} /> {task.taskInfo.credits}
                    </Badge>

                    {workflow?.status === WorkflowStatus.Draft &&
                        <>
                            <Button variant={"ghost"} size="icon" className='cursor-pointer text-destructive'
                                onClick={() => {
                                    if (isTrigger) setCurrentTriggerId(undefined);
                                    deleteElements({
                                        nodes: [{ id: nodeId }]
                                    })
                                }}>
                                <TrashIcon size={12} />
                            </Button>
                            {
                                !task.taskInfo.isEntryPoint && (
                                    <>
                                        <Button variant={"ghost"} size="icon" className='cursor-pointer'
                                            onClick={() => {
                                                const node = getNode(nodeId) as AppNode
                                                const newX = node.position.x + 100
                                                const newY = node.position.y + 100

                                                const newNode = CreateFlowNode(node.data.type, node.data.credits, { x: newX, y: newY }, node.data.trigger ? "TRIGGER" : "ACTION", node.data.actionId)

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

                        </>
                    }
                </div>
            </div>
        </div>
    )
}