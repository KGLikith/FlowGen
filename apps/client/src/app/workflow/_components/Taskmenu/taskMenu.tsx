import React from 'react'
import { AvailableTrigger } from '@/gql/graphql'
import { useGetAvailableTriggers } from '@/hooks/workflows/queries'
import Triggers from './Triggers'
import Actions from './Actions'
import { useTrigger } from '@/components/context/TaskProvider'

export default function TaskMenu() {
   const { currentTriggerId, actions, actionsLoading } = useTrigger();
   const { triggers, isLoading } = useGetAvailableTriggers(currentTriggerId);

   return (
      <aside className='w-[250px] min-w-[250px] max-w-[250px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
         {!currentTriggerId ?
            <>
               <Triggers availableTriggers={triggers as AvailableTrigger[]} isLoading={isLoading} />
            </>
            : <>
               <Actions actions={actions} isLoading={actionsLoading} />
            </>}
      </aside>
   )
}