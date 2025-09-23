import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/schema/task'
import React from 'react'

type Props = {
    taskType: TaskType
}

export default function TaskButton({ taskType }: Props) {
    const task = TaskRegistry[taskType]


    const onDragStart = (event: React.DragEvent<HTMLButtonElement>, taskType: TaskType) => {
        event.dataTransfer.setData('application/reactflow', taskType);
        event.dataTransfer.effectAllowed = 'move';
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