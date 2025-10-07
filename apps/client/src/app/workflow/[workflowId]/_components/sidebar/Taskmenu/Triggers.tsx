import { AvailableTrigger, TaskGroup } from '@/gql/graphql'
import React, { useMemo } from 'react'
import TaskButton from './Button'
import { Skeleton } from '@/components/ui/skeleton'
import CloseButton from '../CloseButton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { groupLabels } from './helper'


type Props = {
    availableTriggers: AvailableTrigger[]
    isLoading: boolean
    onClose: () => void
}

export default function Triggers({ availableTriggers, isLoading, onClose }: Props) {
    const grouped = useMemo(() => {
        return availableTriggers?.reduce((acc, action) => {
            const group = action.taskInfo.group as TaskGroup
            if (!acc[group]) acc[group] = []
            acc[group].push(action)
            return acc
        }, {} as Record<TaskGroup, AvailableTrigger[]>)
    }, [availableTriggers])

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
        <Accordion type="multiple" className='w-full' defaultValue={["DATA_EXTRACTION"]}>

            <div className='w-full'>
                <div className='flex items-center justify-between mb-1'>

                    <div className='font-bold text-lg'>Triggers / Task</div>
                    <CloseButton onClose={onClose} />

                </div>
                <div className="text-xs pb-3 text-foreground">Please <span className="font-bold">drag and drop</span> the desired trigger/task into the workflow canvas.</div>
                {Object.entries(grouped).map(([group, groupTriggers]) => (
                    <AccordionItem key={group} value={group}>
                        <AccordionTrigger className="font-bold cursor-pointer">
                            {groupLabels[group as TaskGroup]}
                        </AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-2'>
                            {groupTriggers.map(trigger => (
                                <TaskButton
                                    key={trigger.id}
                                    credits={trigger.taskInfo.credits}
                                    taskType={trigger.key}
                                    taskId={trigger.id}
                                    trigger={true}
                                    taskIcon={trigger.taskInfo.icon as string}
                                    taskLabel={trigger.taskInfo.label}
                                />
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </div>
        </Accordion>

    )
}