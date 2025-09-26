import { AvailableTrigger } from '@/gql/graphql'
import React from 'react'
import TaskButton from './Button'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
    availableTriggers: AvailableTrigger[]
    isLoading: boolean
}

export default function Triggers({ availableTriggers, isLoading }: Props) {

    if (isLoading) {
        return <div className="space-y-3">
            <div className="font-bold text-lg">Actions</div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    }

    return (
        <div className='w-full'>
            <div className='font-bold text-lg'>Triggers / Task</div>
            <div className="text-xs pb-3 text-foreground">Please <span className="font-bold">drag and drop</span> the desired trigger/task into the workflow canvas.</div>
            <div className="flex gap-2 flex-col">
                {
                    availableTriggers.map((trigger) => {
                        return <TaskButton key={trigger.id} taskType={trigger.key} taskId={trigger.id} trigger={true} taskIcon={trigger.taskInfo.icon as string} taskLabel={trigger.taskInfo.label}  />
                    })
                }
            </div>
        </div>
    )
}