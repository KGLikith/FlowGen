"use client"
import { useGetCurrentUser } from "@/hooks/user"
import { useGetWorkflow } from "@/hooks/workflows"
import Loader from "@/components/loader"
import { User, FileX } from "lucide-react"
import FlowEditor from "./flowEditor"
import { User as UserType } from "@/gql/graphql"
import Editor from "./editor"

type Props = {
  workflowId: string
}

export default function WorkflowPage({ workflowId }: Props) {
  const { user, isLoading: isLoadingUser } = useGetCurrentUser()
  const { workflow, isLoading: isLoadingWorkflow } = useGetWorkflow(workflowId)

  if (isLoadingUser || isLoadingWorkflow) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader state />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
            <User className="h-8 w-8 text-orange-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Authentication Required</h3>
            <p className="text-muted-foreground">
              Please log in to view this workflow. You need to be authenticated to access workflow details.
            </p>
          </div>
        </div>
      </div>
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
              The workflow you're looking for doesn't exist or may have been deleted. Please check the URL or return to
              your workflows.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <Editor workflow={workflow} currentUser={user} />
}
