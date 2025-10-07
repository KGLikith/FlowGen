import React, { createContext, useContext, useEffect, useState } from "react"
import { AvailableAction, AvailableTrigger, Workflow } from "@/gql/graphql"
import { useGetAvailableActions, useGetAvailableActionsForTrigger, useGetWorkflow } from "@/hooks/workflows/queries"

type NodeDialogType = {
  currentNodeId?: string
  setCurrentNodeId: (id?: string) => void
}

const NodeDialog = createContext<NodeDialogType>({
    currentNodeId: undefined,
    setCurrentNodeId: () => { },
})

export function NodeDialogProvider({ children }: { children: React.ReactNode }) {
  const [currentNodeId, setCurrentNodeId] = useState<string | undefined>(undefined)


  return (
    <NodeDialog.Provider
      value={{
        currentNodeId,
        setCurrentNodeId,
      }}
    >
      {children}
    </NodeDialog.Provider>
  )
}

export const useNodeDialog = () => useContext(NodeDialog)
