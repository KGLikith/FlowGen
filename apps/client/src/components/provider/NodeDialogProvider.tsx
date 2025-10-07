'use client'
import React from 'react'
import { NodeDialogProvider } from '../context/nodeDialogContext'

type Props = {
    children: React.ReactNode
}

export default function WorkflowProvider({children}: Props) {
  return (
    <NodeDialogProvider>
      {children}
    </NodeDialogProvider>
  )
}