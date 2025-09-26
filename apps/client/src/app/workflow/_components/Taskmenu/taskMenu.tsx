import React from 'react'
import { AvailableTrigger } from '@/gql/graphql'
import { getAvailableTriggers } from '@/hooks/workflows/queries'
import Triggers from './Triggers'
import Actions from './Actions'
import { useTrigger } from '@/components/context/TaskProvider'

type Props = {
   // trigger: AppNode | null
}

export default function TaskMenu({ }: Props) {
   const { currentTriggerId, actions, actionsLoading } = useTrigger();
   const { triggers, isLoading } = getAvailableTriggers(currentTriggerId);

   return (
      <aside className='w-[300px] min-w-[300px] max-w-[300px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
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