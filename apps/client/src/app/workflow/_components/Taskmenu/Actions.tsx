import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import TaskButton from './Button'
import { AvailableAction } from '@/gql/graphql'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
    actions: AvailableAction[]
    isLoading: boolean
}

export default function Actions({ actions, isLoading }: Props) {

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
        <Accordion type="multiple" className='w-full' defaultValue={["Extraction"]}>
            <div className='font-bold text-lg'>Actions</div>
            <div className="text-xs text-foreground">Please <span className="font-bold">drag and drop</span> the desired action into the workflow canvas.</div>
            <AccordionItem value="Extraction">
                <AccordionTrigger className="font-bold cursor-pointer">Data Extraction</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1'>
                    {actions.map(action => (
                        <TaskButton credits={action.taskInfo.credits} key={action.id} taskType={action.key} taskId={action.id} trigger={false} taskIcon={action.taskInfo.icon as string} taskLabel={action.taskInfo.label} />
                    ))}
                </AccordionContent>  
            </AccordionItem>
        </Accordion>
    )
}