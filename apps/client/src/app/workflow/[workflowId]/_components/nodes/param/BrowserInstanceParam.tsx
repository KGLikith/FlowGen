import { TaskParamProps } from '@/schema/task'
import React from 'react'


export default function BrowserInstanceParam({param, value}: TaskParamProps) {
  return (
    <p className='text-xs'>{param.name}</p>
  )
}