import { auth } from '@clerk/nextjs/server'
import WorkflowPage from './_components/workflowPage'

type Props = {
  params: Promise<{ workflowId: string }>
}

export default async function Page({ params }: Props) {
  const { userId } = await auth()
  const { workflowId } = await params  

  if (!userId) {
    return <div>Please log in to access this page.</div>
  }

  return <WorkflowPage workflowId={workflowId} />
}
