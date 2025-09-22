import UserWorkflows from "./_components/userWorkflows"
import CreateWorkflowDialog from "./_components/createWorkflowDialog"


export default async function WorkFlowsPage() {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog triggerText="Create workflow" />
      </div>

      <div className="space-y-4 h-full">
        <UserWorkflows  />
      </div>

    </div>
  )
}
