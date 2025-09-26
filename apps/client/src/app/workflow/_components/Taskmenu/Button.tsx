import { Button } from '@/components/ui/button'
import { ActionKey, TriggerKey } from '@/gql/graphql'
import React from 'react'

type Props = {
    taskType: TriggerKey | ActionKey
    taskId: string
    trigger: boolean
    taskIcon: String
    taskLabel: String
}

export default function TaskButton({ taskType, taskId, trigger, taskIcon, taskLabel }: Props) {

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
                {/* <task.icon size={20} /> */}
                {taskLabel}
            </div>

        </Button>
    )
}