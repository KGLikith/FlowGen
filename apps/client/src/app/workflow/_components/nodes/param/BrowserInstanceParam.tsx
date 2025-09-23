import { TaskParamProps } from '@/schema/task'
import React from 'react'

type Props = {}

export default function BrowserInstanceParam({param, updateNodeParamValue, value}: TaskParamProps) {
  return (
    <p className='text-xs'>{param.name}</p>
  )
}