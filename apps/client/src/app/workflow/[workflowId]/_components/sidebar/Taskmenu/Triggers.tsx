import { AvailableTrigger } from '@/gql/graphql'
import React from 'react'
import TaskButton from './Button'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import CloseButton from '../CloseButton'

type Props = {
    availableTriggers: AvailableTrigger[]
    isLoading: boolean
    onClose: () => void
}

export default function Triggers({ availableTriggers, isLoading, onClose }: Props) {

    if (isLoading) {
        return <div className="space-y-3">
            <div className="font-bold text-lg">Triggers</div>
            {[1, 2].map((i) => (
                <div key={`skeleton-${i}`} className='space-y-2'>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ))}
        </div>
    }

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between mb-1'>

                <div className='font-bold text-lg'>Triggers / Task</div>
                <CloseButton onClose={onClose} />

            </div>
            <div className="text-xs pb-3 text-foreground">Please <span className="font-bold">drag and drop</span> the desired trigger/task into the workflow canvas.</div>
            <div className="flex gap-2 flex-col">
                {
                    availableTriggers.map((trigger) => {
                        return <TaskButton credits={trigger.taskInfo.credits} key={trigger.id} taskType={trigger.key} taskId={trigger.id} trigger={true} taskIcon={trigger.taskInfo.icon as string} taskLabel={trigger.taskInfo.label} />
                    })
                }
            </div>
        </div>
    )
}