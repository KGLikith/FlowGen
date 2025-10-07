import React, { useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import TaskButton from './Button'
import { AvailableAction, TaskGroup } from '@/gql/graphql'
import { Skeleton } from '@/components/ui/skeleton'
import CloseButton from '../CloseButton'
import { groupLabels } from './helper'

type Props = {
  actions: AvailableAction[]
  isLoading: boolean
  onClose: () => void
}

export default function Actions({ actions, isLoading, onClose }: Props) {
  const grouped = useMemo(() => {
    return actions?.reduce((acc, action) => {
      const group = action.taskInfo.group as TaskGroup
      if (!acc[group]) acc[group] = []
      acc[group].push(action)
      return acc
    }, {} as Record<TaskGroup, AvailableAction[]>)
  }, [actions])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="font-bold text-lg">Actions</div>
        {[1, 2].map((i) => (
          <div key={`skeleton-${i}`} className='space-y-2'>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (

    <Accordion type="multiple" className='w-full' defaultValue={["DATA_EXTRACTION", "USER_INTERACTIONS", "TIMING", "INTEGRATIONS", "DATA_STORAGE"]}>
      <div className='flex items-center justify-between mb-1'>
        <div className='font-bold text-lg'>Actions</div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="text-xs text-foreground">
        Please <span className="font-bold">drag and drop</span> the desired action into the workflow canvas.
      </div>

      {Object.entries(grouped).map(([group, groupActions]) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger className="font-bold cursor-pointer">
            {groupLabels[group as TaskGroup]}
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-2'>
            {groupActions.map(action => (
              <TaskButton
                key={action.id}
                credits={action.taskInfo.credits}
                taskType={action.key}
                taskId={action.id}
                trigger={false}
                taskIcon={action.taskInfo.icon as string}
                taskLabel={action.taskInfo.label}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
