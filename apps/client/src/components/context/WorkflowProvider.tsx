import React, { createContext, useContext, useEffect, useState } from "react"
import { AvailableAction, AvailableTrigger, Workflow } from "@/gql/graphql"
import { useGetAvailableActions, useGetAvailableActionsForTrigger, useGetWorkflow } from "@/hooks/workflows/queries"

type WorkflowContextType = {
  currentTriggerId?: string
  setCurrentTriggerId: (id?: string) => void
  workflowId?: string
  setWorkflowId: (id?: string) => void
  isWorkflowLoading: boolean
  workflow: Workflow | undefined
  actions: AvailableAction[]
  actionsLoading: boolean
  trigger: AvailableTrigger | undefined
  allActions: AvailableAction[]
}

const WorkflowContext = createContext<WorkflowContextType>({
  currentTriggerId: undefined,
  setCurrentTriggerId: () => { },
  workflowId: undefined,
  workflow: undefined,
  isWorkflowLoading: false,
  setWorkflowId: () => { },
  actions: [],
  actionsLoading: false,
  trigger: undefined,
  allActions: []
})

export function WorkflowContextProvider({ children }: { children: React.ReactNode }) {
  const [currentTriggerId, setCurrentTriggerId] = useState<string | undefined>(undefined)
  const [workflowId, setWorkflowId] = useState<string | undefined>(undefined)

  const data = useGetAvailableActionsForTrigger(currentTriggerId)
  const { actions } = useGetAvailableActions();
  const { data: workflowData, isLoading } = useGetWorkflow(workflowId || "")
  useEffect(() => {
    data?.refetch()
  }, [currentTriggerId])

  return (
    <WorkflowContext.Provider
      value={{
        currentTriggerId,
        setCurrentTriggerId,
        actions: currentTriggerId ? data.data?.actions as AvailableAction[] : [],
        actionsLoading: data?.isLoading || false,
        trigger: data.data?.trigger as AvailableTrigger,
        allActions: actions as AvailableAction[],
        workflowId,
        isWorkflowLoading: isLoading || false,
        setWorkflowId,
        workflow: workflowData?.getWorkflow as Workflow | undefined,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export const useWorkflow = () => useContext(WorkflowContext)
