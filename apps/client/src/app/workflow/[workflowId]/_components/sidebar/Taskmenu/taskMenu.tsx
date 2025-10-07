import React from 'react'
import { AvailableTrigger, WorkflowStatus } from '@/gql/graphql'
import { useGetAvailableTriggers } from '@/hooks/workflows/queries'
import Triggers from './Triggers'
import Actions from './Actions'
import { useWorkflow } from '@/components/context/WorkflowProvider'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function TaskMenu({ onClose }: { onClose: () => void }) {
   const { currentTriggerId, actions, actionsLoading, workflow } = useWorkflow();
   const { triggers, isLoading } = useGetAvailableTriggers(currentTriggerId);

   return (
      <ScrollArea className='h-full px-1 py-2'>

         <aside className='w-[280px] min-w-[280px] max-w-[280px] border-r-2 border-separate h-full p-2 px-4 pr-5 overflow-auto'>
            {!currentTriggerId ?
               <>
                  <Triggers availableTriggers={triggers as AvailableTrigger[]} isLoading={isLoading} onClose={onClose} />
               </>
               : <>
                  <Actions actions={actions} isLoading={actionsLoading} onClose={onClose} />
               </>}
         </aside>
      </ScrollArea>

   )
}