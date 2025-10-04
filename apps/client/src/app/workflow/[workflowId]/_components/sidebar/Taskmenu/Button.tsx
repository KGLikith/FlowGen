import { useWorkflow } from '@/components/context/WorkflowProvider'
import { Button } from '@/components/ui/button'
import { ActionKey, TriggerKey, WorkflowStatus } from '@/gql/graphql'
import React from 'react'

type Props = {
    taskType: TriggerKey | ActionKey
    taskId: string
    trigger: boolean
    taskIcon: string
    taskLabel: string
    credits: number
}

export default function TaskButton({ taskType, taskId, trigger, taskLabel, credits }: Props) {
    const { workflow } = useWorkflow();
    const disabled = workflow?.status === WorkflowStatus.Active;

    const onDragStart = (event: React.DragEvent<HTMLButtonElement>, taskType: TriggerKey | ActionKey) => {
        if(disabled){
            event.preventDefault();
            return;
        }
        const task = {
            type: taskType,
            taskId: taskId,
            trigger: trigger,
            credits: credits
        }
        event.dataTransfer.setData('application/reactflow', JSON.stringify(task));
        event.dataTransfer.effectAllowed = 'move'
    }
    return (
        <Button
            variant={"secondary"}
            className="flex justify-between items-center gap-2 border w-full cursor-grab"
            draggable={!disabled}
            onDragStart={e => onDragStart(e, taskType)}
            disabled={disabled}
        >
            <div className="flex gap-2 items-center">
                {/* <task.icon size={20} /> */}
                {taskLabel}
            </div>

        </Button>
    )
}