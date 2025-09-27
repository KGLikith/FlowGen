import React from 'react'

type Props = {
  params: Promise<{ workflowId: string, executionId: string }>
}

export default async function Page({ params }: Props) {
  const { workflowId, executionId } = await params;
  console.log("workflowId, executionId", workflowId, executionId)
  return (
    <div>Page</div>
  )
}