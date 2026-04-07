"use client"
import { Separator } from "@/components/ui/separator"
import { type TaskInfo, TriggerKey } from "@/gql/graphql"
import { useEffect } from "react"
import WebhookTest from "./test/webhook"

type Props = {
  currentNodeId: string
  taskInfo: TaskInfo
  testing: boolean
  setTesting: (testing: boolean) => void
  currentTab: string
  workflowId: string
}

export default function Test({ currentNodeId, taskInfo, testing, setTesting, currentTab, workflowId }: Props) {
  useEffect(() => {
    if (currentTab !== "test" && testing) {
      setTesting(false)
    }
  }, [currentTab])

  return (
    <div className="flex flex-col gap-2 no-scrollbar overflow-y-auto">
      <p className="text-sm font-medium">Run a test</p>

      {(() => {
        switch (taskInfo.type) {
          case TriggerKey.Webhook:
            return (
              <WebhookTest
                currentTab={currentTab}
                currentNodeId={currentNodeId}
                taskInfo={taskInfo}
                testing={testing}
                workflowId={workflowId}
                setTesting={setTesting}
              />
            )
          case TriggerKey.LaunchBrowser:
            return <div className="text-xs text-muted-foreground">Type B test UI</div>
          default:
            return <div className="text-xs text-muted-foreground">Unknown type</div>
        }
      })()}

      <Separator className="my-2" />
    </div>
  )
}
