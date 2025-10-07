"use client"

import { useEdges, useReactFlow } from "@xyflow/react"
import { useWorkflow } from "@/components/context/WorkflowProvider"
import { type TaskParam, WorkflowStatus } from "@/gql/graphql"
import NodeParamField from "../../_components/nodes/ParamField"
import { getTaskIcon } from "../../_components/nodes/icons"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { AppNode, AppNodeData } from "@/schema/appNode"
import { useEffect, useState } from "react"
import { useNodeDialog } from "@/components/context/nodeDialogContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useFlowValidation from "@/hooks/useFlowValidation"

export default function NodeInspectorPanel({ allActions, trigger }: any) {
  const { workflow } = useWorkflow()
  const { currentNodeId, setCurrentNodeId } = useNodeDialog()
  const { getNode } = useReactFlow()
  const [node, setNode] = useState<AppNode | null>(null)
  const [nodeData, setNodeData] = useState<AppNodeData | null>(null)
  const { invalidInputs } = useFlowValidation();
  const [tempInputs, setTempInputs] = useState<Record<string, string>>({})
  const { updateNodeData } = useReactFlow();


  useEffect(() => {
    if (nodeData) setTempInputs(nodeData.inputs || {})
  }, [nodeData])

  useEffect(() => {
    const n = getNode(currentNodeId || "") as AppNode
    if (!n) {
      setNode(null)
      setNodeData(null)
      return
    }
    setNode(n)
    setNodeData(n?.data)
  }, [currentNodeId, getNode])

  const task = nodeData && [...(allActions || []), trigger].find((t) => t?.key === nodeData.type)?.taskInfo

  const inputs: TaskParam[] = task?.inputs || []
  const edges = useEdges();

  const isConnected = (input: TaskParam) => edges.some(edge => edge.target === node?.id && edge.targetHandle === input.name);

  return (
    <AnimatePresence>
      {node ? (
        <motion.aside
          key="right-docked-inspector"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.18 }}
          className="absolute top-12 right-2 md:right-4 z-50 h-full overflow-auto"
          aria-live="polite"
          aria-label="Node inspector panel"
        >
          <div className="bg-card border border-border shadow-2xl rounded-2xl w-[360px] h-3/4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                {getTaskIcon(nodeData?.type)}
                <div className="flex flex-col">
                  <h2 className="font-semibold text-sm leading-tight">{nodeData?.label || nodeData?.type}</h2>
                  {/* <p className="text-xs text-muted-foreground">Step {node?.id}</p> */}
                </div>
              </div>
              <button
                onClick={() => setCurrentNodeId(undefined)}
                className="text-muted-foreground cursor-pointer hover:text-foreground text-xs"
                aria-label="Close inspector"
              >
                ✕
              </button>
            </div>

            <Tabs defaultValue="configure" className="flex-1 flex flex-col overflow-auto">
              <div className="px-4 pt-2">
                <TabsList className="grid grid-cols-1 w-full">
                  {/* <TabsTrigger value="setup">Setup</TabsTrigger> */}
                  <TabsTrigger value="configure">Configure</TabsTrigger>
                  {/* <TabsTrigger value="test">Test</TabsTrigger> */}
                </TabsList>
              </div>

              {/* <TabsContent value="setup" className="flex-1 overflow-auto p-4">
                <Card className="p-3">
                  <p className="text-sm font-medium">What you need</p>
                  <Separator className="my-2" />
                  <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-1">
                    <li>Connect any required credentials.</li>
                    <li>Review default inputs and required fields.</li>
                    <li>Use “Configure” to map values from previous steps.</li>
                  </ul>
                </Card>
              </TabsContent> */}

              <TabsContent value="configure" className="flex-1 overflow-auto p-4">
                <p className="text-xs text-muted-foreground mb-2">Configure this node’s inputs</p>
                <div className="space-y-3">
                  {inputs.length > 0 ? (
                    inputs.map((param) => {
                      const hasErrors = invalidInputs.some(invalid => invalid.nodeId === node?.id && invalid.inputs.includes(param.name));
                      return (
                        <div key={param.name} className="space-y-1">
                          <NodeParamField
                            hasErrors={hasErrors || isConnected(param)}
                            param={param}
                            value={tempInputs[param.name] || ""}
                            onChange={(newValue: string) => setTempInputs(prev => ({ ...prev, [param.name]: newValue }))}
                            nodeId={node.id}
                            disabled={workflow?.status === WorkflowStatus.Active || isConnected(param)}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground">This node has no configurable inputs.</p>
                  )}
                </div>
              </TabsContent>

              {/* <TabsContent value="test" className="flex-1 overflow-auto p-4">
                <Card className="p-3">
                  <p className="text-sm font-medium">Run a test</p>
                  <Separator className="my-2" />
                  <p className="text-xs text-muted-foreground mb-3">
                    Test this step to validate your configuration before activating the workflow.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full cursor-pointer"
                    onClick={() => {
                      console.log("Test step:", node.id)
                    }}
                  >
                    Test step
                  </Button>
                </Card>
              </TabsContent> */}
            </Tabs>

            <div className="p-3 border-t flex items-center justify-end gap-2">
              <Button className="cursor-pointer" variant="secondary" size="sm" onClick={() => setCurrentNodeId(undefined)}>
                Close
              </Button>
              <Button className="cursor-pointer" size="sm" onClick={() => {
                updateNodeData(node.id, { inputs: tempInputs })
                setCurrentNodeId(undefined)
              }}
                disabled={workflow?.status === WorkflowStatus.Active || Object.keys(tempInputs).length === 0}
              >
                Save
              </Button>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
