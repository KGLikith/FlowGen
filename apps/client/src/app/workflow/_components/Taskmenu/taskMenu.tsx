import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TaskType } from '@/schema/task'
import React from 'react'
import TaskButton from './Button'

type Props = {}

export default function TaskMenu({ }: Props) {
   return (
      <aside className='w-[300px] min-w-[300px] max-w-[300px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
         <Accordion type="multiple" className='w-full' defaultValue={["Extraction"]}>
            <AccordionItem value="Extraction">
               <AccordionTrigger className="font-bold cursor-pointer">Data Extraction</AccordionTrigger>
               <AccordionContent className='flex flex-col gap-1'>
                  <TaskButton taskType={TaskType.PAGE_TO_HTML} />
                  <TaskButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
               </AccordionContent>
            </AccordionItem>
         </Accordion>
      </aside>
   )
}