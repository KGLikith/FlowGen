import React, { createContext, useContext, useEffect, useState } from "react"
import { AvailableAction } from "@/gql/graphql"
import { getAvailableActionsForTrigger } from "@/hooks/workflows/queries"

type TriggerContextType = {
  currentTriggerId?: string
  setCurrentTriggerId: (id?: string) => void
  actions: AvailableAction[]
  actionsLoading: boolean
}

const TriggerContext = createContext<TriggerContextType>({
  currentTriggerId: undefined,
  setCurrentTriggerId: () => { },
  actions: [],
  actionsLoading: false,
})

export function TriggerContextProvider({ children }: { children: React.ReactNode }) {
  const [currentTriggerId, setCurrentTriggerId] = useState<string | undefined>(
    undefined
  )

  const data =
    getAvailableActionsForTrigger(currentTriggerId)

  useEffect(() => {
    data?.refetch()
    console.log("in provider", currentTriggerId)
  }, [currentTriggerId])

  return (
    <TriggerContext.Provider
      value={{ currentTriggerId, setCurrentTriggerId, actions: currentTriggerId ? data?.data as AvailableAction[] : [], actionsLoading: data?.isLoading || false }}
    >
      {children}
    </TriggerContext.Provider>
  )
}

export const useTrigger = () => useContext(TriggerContext)
