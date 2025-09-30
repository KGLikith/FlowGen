import TopBar from '@/app/workflow/_components/topBar/TopBar';
import React from 'react'
import ExecutionView from './_components/ExecutionView';

type Props = {
  params: Promise<{ workflowId: string, executionId: string }>
}

export default async function Page({ params }: Props) {
  const { workflowId, executionId } = await params;
  return (
    <ExecutionView executionId={executionId} workflowId={workflowId} />
  )
} 