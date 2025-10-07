import { useWorkflow } from '@/components/context/WorkflowProvider'
import { Button } from '@/components/ui/button'
import { ActionKey, TriggerKey, WorkflowStatus } from '@/gql/graphql'
import { CoinsIcon } from 'lucide-react'
import React from 'react'
import { getTaskIcon } from './icons'

type Props = {
  taskType: TriggerKey | ActionKey
  taskId: string
  trigger: boolean
  taskIcon: string
  taskLabel: string
  credits: number
}

export default function TaskButton({ taskType, taskId, trigger, taskLabel, credits }: Props) {
  const { workflow } = useWorkflow()
  const disabled = workflow?.status === WorkflowStatus.Active

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, taskType: TriggerKey | ActionKey) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    const task = { type: taskType, taskId, trigger, credits }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(task))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Button
      variant="secondary"
      className="flex justify-between items-center gap-2 border w-full cursor-grab text-left py-5"
      draggable={!disabled}
      onDragStart={(e) => onDragStart(e, taskType)}
      disabled={disabled}
    >
      {getTaskIcon(taskType)}
      <div className="flex-1 min-w-0">
        <p className="break-words whitespace-normal leading-tight text-sm font-medium">
          {taskLabel}
        </p>
      </div>

      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/30 shrink-0">
        <CoinsIcon size={14} />
        {credits}
      </div>
    </Button>
  )
}
