import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function layout({ children }: Props) {
  return (
    <>
      <div className='flex flex-col w-full h-screen'>
        {children}
        {/* <Seperator></Seperator> */}
      </div>
    </>
  )
}