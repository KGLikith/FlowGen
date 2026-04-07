"use client"

import { useEdges, useReactFlow, useStore } from "@xyflow/react"
import { useWorkflow } from "@/components/context/WorkflowProvider"
import { TaskInfo, type TaskParam, TpConnections, WorkflowStatus } from "@/gql/graphql"
import NodeParamField from "../../_components/nodes/ParamField"
import { getTaskIcon } from "../../_components/nodes/icons"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { AppNode, AppNodeData } from "@/schema/appNode"
import { useEffect, useState } from "react"
import { useNodeDialog } from "@/components/context/nodeDialogContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useFlowValidation from "@/hooks/useFlowValidation"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Setup from "./InspectorPanel/setup"
import Test from "./InspectorPanel/test"

export type setUpEventType = {
   event: string
   connection?: string
}

export default function NodeInspectorPanel({ allActions, trigger }: any) {
   const { workflow } = useWorkflow()
   const { currentNodeId, setCurrentNodeId } = useNodeDialog()
   const { getNode, updateNodeData } = useReactFlow()
   const [nodeData, setNodeData] = useState<AppNodeData | null>(null)
   const [tabValue, setTabValue] = useState<string>("configure");
   const { invalidInputs } = useFlowValidation();
   const [tempInputs, setTempInputs] = useState<Record<string, string>>({})
   const [setUpInputs, setSetUpInputs] = useState<setUpEventType>({
      event: "",
   })
   const [testing, setTesting] = useState(false)
   const [disabled, setDisabled] = useState({
      setup: false,
      configure: true,
      test: true
   })

   const nodes = useStore((state) => state.nodes);

   useEffect(() => {
      if (workflow?.status === WorkflowStatus.Active) {
         setCurrentNodeId(undefined)
      }
   }, [workflow?.status])

   useEffect(() => {
      setDisabled({
         setup: false,
         configure: true,
         test: true
      })
   }, [currentNodeId])

   useEffect(() => {
      if (nodeData) {
         setTempInputs(nodeData.inputs || {})
         setSetUpInputs({
            event: nodeData.event || "",
            connection: nodeData.connection || undefined
         })
      }
   }, [nodeData])

   useEffect(() => {
      const n = getNode(currentNodeId || "") as AppNode
      if (!n) {
         setNodeData(null)
         setCurrentNodeId(undefined)
         return
      }
      setNodeData(n?.data)

   }, [currentNodeId, nodes])

   const task = nodeData && [...(allActions || []), trigger].find((t) => t?.key === nodeData.type)?.taskInfo as TaskInfo

   useEffect(() => {
      if (task?.events && task.events.length > 0 && !nodeData?.event && (task.requiredConnection ? !nodeData?.connection : true)) setTabValue("setup");
      else if ((task?.inputs && task.inputs.length > 0) || task?.events?.find((ev) => ev.id === nodeData?.event)?.inputs) {
         if (!disabled.test) { setTabValue("test"); return; }
         if (task.events && task.events.find((event: any) => event.id === nodeData?.event)?.inputs?.length === 0 && task.inputs?.length == 0) {
            setDisabled(prev => ({ ...prev, test: false }))
            setTabValue("setup");
            return;
         }
         setTabValue("configure")
         setDisabled(prev => ({ ...prev, setup: false, configure: false }))
      }
      else {
         setDisabled(prev => ({ ...prev, setup: false, configure: true }))
         setTabValue("setup");
      }
   }, [currentNodeId, nodeData]);

   const inputs: TaskParam[] = task?.inputs || []
   const edges = useEdges();

   const isConnected = (input: TaskParam) => edges.some(edge => edge.target === currentNodeId && edge.targetHandle === input.name);

   const allRequiredFilled = inputs.every(param => {
      if (!param.required) return true;
      if (isConnected(param)) return true;
      const val = tempInputs[param.name];
      return (val !== undefined && val !== "");
   });

   const allRequiredFilledFromEvent = (eventId: string) => {
      const event = task?.events?.find(ev => ev.id === eventId);
      if (!event?.inputs) return true;
      return event.inputs.every(param => {
         if (!param.required) return true;
         if (isConnected(param)) return true;
         const val = tempInputs[param.name];

         return (val !== undefined && val !== "");
      });
   }

   const ConfigureDisabled = (task?.requiredConnection != TpConnections.None ? !setUpInputs.connection : true) && ((task?.events && task.events.length > 0) ? !setUpInputs.event : false)
   const testDisabled = (task?.events?.find(event => event.id === nodeData?.event)?.inputs ? !(allRequiredFilledFromEvent(nodeData?.event)) : false) && ConfigureDisabled

   return (
      <AnimatePresence>
         {nodeData && currentNodeId ? (
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

                  <Tabs value={tabValue} onValueChange={setTabValue} className="flex-1 flex flex-col overflow-auto">
                     <div className="px-4 pt-2">
                        <TabsList className={cn("grid w-full grid-cols-1 gap-2 justify-center items-center ",
                           { "grid-cols-1": (!task?.testingAvailable && (!task?.events || task?.events?.length === 0)) },
                           { "grid-cols-2": task?.testingAvailable || (task?.events && task?.events?.length !== 0) || (task?.events && task.events.find((event: any) => event.id === nodeData?.event)?.inputs?.length === 0) },
                           { "grid-cols-3": task?.testingAvailable && task?.events && task?.events.length > 0 && (task?.events.find((event: any) => event.id === nodeData?.event)?.inputs?.length !== 0) },
                        )}>
                           {task?.events && task?.events.length > 0 && <TabsTrigger className="w-full cursor-pointer" value="setup">Setup</TabsTrigger>}
                           {(task?.events && task.events.length > 0 && nodeData.event) ?
                              task.events.find((event: any) => event.id === nodeData.event)?.inputs?.length != 0 && <TabsTrigger className="w-full col-span-1 cursor-pointer" disabled={ConfigureDisabled || (task?.events && task.events.length > 0 ? !nodeData.event : false)} value="configure">Configure</TabsTrigger>
                              : <TabsTrigger disabled={ConfigureDisabled || (task?.events && task.events.length > 0 ? !nodeData.event : false)} className="w-full col-span-1 cursor-pointer" value="configure">Configure</TabsTrigger>
                           }
                           {task?.testingAvailable && <TabsTrigger disabled={workflow?.status === WorkflowStatus.Active || disabled.test} className="w-full cursor-pointer" value="test">Test</TabsTrigger>}
                        </TabsList>
                     </div>

                     {task?.events && task.events.length > 0 && <TabsContent value="setup" className="flex-1 overflow-auto p-4">
                        <Card className="p-3">
                           <Setup taskInfo={task} inputs={setUpInputs} setInputs={setSetUpInputs} disabled={workflow?.status === WorkflowStatus.Active} />
                        </Card>
                     </TabsContent>
                     }

                     <TabsContent value="configure" className="flex-1 overflow-auto p-4">
                        <p className="text-xs text-muted-foreground mb-2">Configure this node’s inputs</p>
                        <div className="space-y-3">
                           {inputs.length > 0 ? (
                              inputs.map((param) => {
                                 const hasErrors = invalidInputs?.some(invalid => invalid.nodeId === currentNodeId && invalid.inputs.includes(param.name));
                                 return (
                                    <div key={param.name} className="space-y-1">
                                       <NodeParamField
                                          hasErrors={hasErrors}
                                          param={param}
                                          value={tempInputs[param.name] || ""}
                                          onChange={(newValue: string) => setTempInputs(prev => ({ ...prev, [param.name]: newValue }))}
                                          nodeId={currentNodeId || ""}
                                          disabled={workflow?.status === WorkflowStatus.Active || isConnected(param)}
                                       />
                                    </div>
                                 )
                              })
                           ) : (setUpInputs.event && task?.events?.find(event => event?.id === setUpInputs?.event)?.inputs) ? (
                              (setUpInputs.event && task?.events?.find(event => event?.id === setUpInputs?.event)?.inputs || [])?.map((param: TaskParam) => {
                                 const hasErrors = invalidInputs?.some(invalid => invalid.nodeId === currentNodeId && invalid.inputs.includes(param.name));
                                 return (
                                    <div key={param.name} className="space-y-1">
                                       <NodeParamField
                                          hasErrors={hasErrors}
                                          param={param}
                                          value={tempInputs[param.name] || ""}
                                          onChange={(newValue: string) => setTempInputs(prev => ({ ...prev, [param.name]: newValue }))}
                                          nodeId={currentNodeId || ""}
                                          disabled={workflow?.status === WorkflowStatus.Active}
                                       />
                                    </div>
                                 );
                              })
                           ) : (
                              <>
                              </>
                           )}
                        </div>
                     </TabsContent>

                     {task?.testingAvailable && currentNodeId && workflow?.id && <TabsContent value="test" className="flex-1 p-4 no-scrollbar overflow-y-auto">
                        <Test workflowId={workflow?.id} currentNodeId={currentNodeId} taskInfo={task} testing={testing} setTesting={setTesting} currentTab={tabValue} />
                     </TabsContent>}
                  </Tabs>

                  <div className="p-3 border-t flex items-center justify-end gap-2">
                     {!testing && <Button className="cursor-pointer" variant="secondary" size="sm" onClick={() => setCurrentNodeId(undefined)}>
                        {tabValue === "test" ? "Skip" : "Close"}
                     </Button>}
                     <Button className="cursor-pointer" size="sm" onClick={() => {
                        if (!currentNodeId) return;
                        if (tabValue === "setup") {
                           if (!setUpInputs.event) return;
                           if (task?.requiredConnection && task?.requiredConnection !== TpConnections.None && !setUpInputs.connection) return;
                           if (task?.events && task.events.find((event: any) => event.id === setUpInputs.event)?.inputs?.length === 0 && task.inputs?.length === 0) {
                              if (task?.testingAvailable) {
                                 setDisabled(prev => ({ ...prev, test: false }));
                              }
                           } else {
                              setDisabled(prev => ({ ...prev, setup: false, configure: false, test: true }))
                           }
                           updateNodeData(currentNodeId, {
                              event: setUpInputs.event,
                              connection: setUpInputs.connection,
                           })
                           setTempInputs(
                              Object.fromEntries(
                                 (task?.events?.find(e => e.id === setUpInputs.event)?.inputs || []).map((param: TaskParam) => [param.name, ""])
                              )
                           )
                           if ((task?.inputs && task.inputs.length > 0) || task?.events?.find((ev) => ev.id === setUpInputs.event)?.inputs?.length != 0) {
                              setTabValue("configure")
                           } else if (task?.testingAvailable) {
                              setDisabled(prev => ({ ...prev, test: false }))
                              setTabValue("test")
                           }
                           else setCurrentNodeId(undefined)
                           return;
                        }
                        if (tabValue === "configure") {
                           if (!allRequiredFilled) return;
                           setDisabled(prev => ({ ...prev, configure: false, test: false }))
                           updateNodeData(currentNodeId, {
                              inputs: { ...nodeData?.inputs, ...tempInputs },
                           })
                           if (task?.testingAvailable) setTabValue("test")
                           else setCurrentNodeId(undefined)

                           return;
                        }
                        if (tabValue === "test") {
                           setTesting(true)
                           return;
                        }
                     }}
                        disabled={
                           workflow?.status === WorkflowStatus.Active ||
                           (tabValue === "configure" && testDisabled) ||
                           (tabValue === "setup" && ConfigureDisabled) ||
                           !allRequiredFilled || !allRequiredFilledFromEvent(setUpInputs.event)
                           || testing
                        }
                     >
                        {!testing ? tabValue === "setup" ? "Next" : tabValue === "configure" ? task?.testingAvailable ? "Next" : "Save" : "Test" : "Testing..."}
                     </Button>

                  </div>
               </div>
            </motion.aside>
         ) : null}
      </AnimatePresence>
   )
}
