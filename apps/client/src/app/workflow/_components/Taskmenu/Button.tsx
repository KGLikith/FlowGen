import { Button } from '@/components/ui/button'
import { ActionKey, TriggerKey } from '@/gql/graphql'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/schema/task'
import React from 'react'

type Props = {
    taskType: TriggerKey | ActionKey
    taskId: string
    trigger: boolean
}

export default function TaskButton({ taskType, taskId, trigger }: Props) {
    const task = TaskRegistry[taskType]

    const onDragStart = (event: React.DragEvent<HTMLButtonElement>, taskType: TriggerKey | ActionKey) => {
        event.dataTransfer.setData('application/reactflow/taskType', taskType);
        event.dataTransfer.setData('application/reactflow/taskId', taskId);
        event.dataTransfer.setData('application/reactflow/trigger', trigger ? "true" : "false");
        event.dataTransfer.effectAllowed = 'move'
    }
    return (
        <Button
            variant={"secondary"}
            className="flex justify-between items-center gap-2 border w-full cursor-grab"
            draggable="true"
            onDragStart={e => onDragStart(e, taskType)}
            
        >
            <div className="flex gap-2 items-center">
                <task.icon size={20} />
                {task.label}
            </div>

        </Button>
    )
}