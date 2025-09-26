import React, { createContext, useContext, useEffect, useState } from "react"
import { AvailableAction, AvailableTrigger } from "@/gql/graphql"
import { getAvailableActions, getAvailableActionsForTrigger } from "@/hooks/workflows/queries"

type TriggerContextType = {
  currentTriggerId?: string
  setCurrentTriggerId: (id?: string) => void
  actions: AvailableAction[]
  actionsLoading: boolean
  trigger: AvailableTrigger | undefined
  allActions: AvailableAction[]
}

const TriggerContext = createContext<TriggerContextType>({
  currentTriggerId: undefined,
  setCurrentTriggerId: () => { },
  actions: [],
  actionsLoading: false,
  trigger: undefined,
  allActions: []
})

export function TriggerContextProvider({ children }: { children: React.ReactNode }) {
  const [currentTriggerId, setCurrentTriggerId] = useState<string | undefined>(
    undefined
  )

  const data =
    getAvailableActionsForTrigger(currentTriggerId)

  const {actions} = getAvailableActions();

  useEffect(() => {
    data?.refetch()
  }, [currentTriggerId])

  return (
    <TriggerContext.Provider
      value={{ currentTriggerId, setCurrentTriggerId, actions: currentTriggerId ? data.data?.actions as AvailableAction[] : [], actionsLoading: data?.isLoading || false, trigger: data.data?.trigger as AvailableTrigger, allActions: actions as AvailableAction[] }}
    >
      {children}
    </TriggerContext.Provider>
  )
}

export const useTrigger = () => useContext(TriggerContext)
