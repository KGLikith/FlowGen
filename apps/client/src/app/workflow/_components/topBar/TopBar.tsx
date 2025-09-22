import React from 'react'

type Props = {}

export default function TopBar({}: Props) {
  return (
    <header className='flex p-2 border-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10'>
        <div className="flex gap-1 flex-1">
            <TooltipWrapper></TooltipWrapper>
        </div>
    </ header>
  )
}