import Logo from '@/components/logo'
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function layout({children}: Props) {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <Logo />
      {children}
    </div>
  )
}