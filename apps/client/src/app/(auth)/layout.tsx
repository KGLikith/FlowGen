import Logo from '@/components/logo'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default async function layout({ children }: Props) {
  const { userId } = await auth();
  
  if (userId) return null;

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <Logo />
      {children}
    </div>
  )
}