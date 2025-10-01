'use client'
import React from 'react'
import { WorkflowContextProvider } from '../context/WorkflowProvider'

type Props = {
    children: React.ReactNode
}

export default function WorkflowProvider({children}: Props) {
  return (
    <WorkflowContextProvider>
      {children}
    </WorkflowContextProvider>
  )
}