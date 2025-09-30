import { auth } from '@clerk/nextjs/server'
import WorkflowPage from './_components/workflowPage'
import Unauthorized from '@/components/unauthorized'

type Props = {
  params: Promise<{ workflowId: string }>
}

export default async function Page({ params }: Props) {
  const { userId } = await auth()
  const { workflowId } = await params  

  if (!userId) {
    return <Unauthorized />
  }

  return <WorkflowPage workflowId={workflowId} />
}
