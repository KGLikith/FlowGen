import React from 'react'
import { AvailableTrigger } from '@/gql/graphql'
import { useGetAvailableTriggers } from '@/hooks/workflows/queries'
import Triggers from './Triggers'
import Actions from './Actions'
import { useWorkflow } from '@/components/context/WorkflowProvider'

export default function TaskMenu({ onClose }: { onClose: () => void }) {
   const { currentTriggerId, actions, actionsLoading } = useWorkflow();
   const { triggers, isLoading } = useGetAvailableTriggers(currentTriggerId);

   return (
      <aside className='w-[280px] min-w-[280px] max-w-[280px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
         {!currentTriggerId ?
            <>
               <Triggers availableTriggers={triggers as AvailableTrigger[]} isLoading={isLoading} onClose={onClose} />
            </>
            : <>
               <Actions actions={actions} isLoading={actionsLoading} onClose={onClose} />
            </>}
      </aside>
   )
}