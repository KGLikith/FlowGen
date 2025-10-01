"use client"
import { useGetCurrentUser } from "@/hooks/user"
import { useGetWorkflow } from "@/hooks/workflows/queries"
import Loader from "@/components/loader"
import { ArrowLeft, FileX } from "lucide-react"
import Editor from "./editor"
import { useWorkflow, WorkflowContextProvider } from "@/components/context/WorkflowProvider"
import Unauthorized from "@/components/unauthorized"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type Props = {
  workflowId: string
}

export default function WorkflowPage({ workflowId }: Props) {
  const { user, isLoading: isLoadingUser } = useGetCurrentUser()
  const router = useRouter()
  const { setWorkflowId, isWorkflowLoading, workflow } = useWorkflow();

  useEffect(()=>{
    setWorkflowId(workflowId);
  },[workflowId, setWorkflowId])

  if (isLoadingUser || isWorkflowLoading) {
    return (
      <Loader />
    )
  }

  if (!user) {
    return (
      <Unauthorized />
    )
  }

  if (!workflow) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <FileX className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Workflow Not Found</h3>
            <p className="text-muted-foreground">
              The workflow you&apos;re looking for doesn&apos;t exist or may have been deleted.
              Please check the URL or return to your workflows.
            </p>
            <Button variant="outline" onClick={() => {
              router.push('/dashboard/workflows');
            }}>
              <ArrowLeft className="mr-2" /> Back to Workflow list.
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
        <Editor workflow={workflow} currentUser={user} />
    </>
  )
}
