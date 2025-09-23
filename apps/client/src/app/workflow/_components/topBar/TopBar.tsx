import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'
import SaveButton from './SaveButton';

type Props = {
  title: string
  subtitle?: string
  workflowId: string
}

export default function TopBar({ title, subtitle, workflowId }: Props) {
  const router = useRouter();

  return (
    <header className='flex p-2 border-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10'>
      <div className="flex gap-3 flex-1">
        <Tooltip>
          <TooltipTrigger className='cursor-pointer bg-accent/20 rounded-full p-1 hover:bg-accent transition' onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </TooltipTrigger>
          <TooltipContent>Back</TooltipContent>
        </Tooltip>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && <p className="text-sm text-muted-foreground truncate text-ellipsis">{subtitle}</p>}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <SaveButton workflowId={workflowId} />
      </div>
    </header>
  )
}