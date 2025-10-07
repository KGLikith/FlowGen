import { useWorkflow } from "@/components/context/WorkflowProvider"
import { ActionKey, TriggerKey, User, Workflow } from "@/gql/graphql"
import { CreateFlowNode } from "@/lib/workflow/createFlowNode"
import { AppNode } from "@/schema/appNode"
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, Panel, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useEffect } from "react"
import { toast } from "sonner"
import NodeComponent from "@/app/workflow/[workflowId]/_components/nodes/Component"
import DeletableEdge from "@/app/workflow/[workflowId]/_components/edges/deletableEdge"
import NodeInspectorPanel from "./conifgPanel"
import { NodeDialogProvider } from "@/components/context/nodeDialogContext"

type Props = {
  currentUser: User
}

const nodeTypes = {
  Node: NodeComponent
}

const EdgeTypes = {
  default: DeletableEdge
}

const snapGrid: [number, number] = [20, 20]
const fitViewOptions = { padding: 3.0, includeHiddenNodes: true };

export default function FlowEditor({ }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow()
  const { setCurrentTriggerId, actions, trigger, workflow } = useWorkflow()

  useEffect(() => {
    try {
      if (!workflow?.definition) return;
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;

      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (e) {
      console.error("Failed to parse workflow definition:", e);
    }

  }, [workflow])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    const { type, taskId, trigger, credits } = data;

    if (typeof type === 'undefined' || !type) {
      return;
    }

    if (trigger) {
      const hasTrigger = nodes.some(node => node.data.trigger === true);
      if (hasTrigger) {
        toast.error("Only one trigger node is allowed.");
        return;
      }
      setCurrentTriggerId(taskId)
    }

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const pos = screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left / 2,
      y: event.clientY - reactFlowBounds.top / 2,
    });

    const newNode = CreateFlowNode(type as ActionKey | TriggerKey, credits, pos, trigger === true ? "TRIGGER" : "ACTION", taskId)
    setNodes((nds) => nds.concat(newNode))

  }, [screenToFlowPosition, setNodes])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({
      ...connection,
    }, eds))

    if (!connection.targetHandle) return;
    const node = nodes.find(n => n.id === connection.target);
    if (!node) return;

    const nodeInputs = node.data.inputs

    delete nodeInputs[connection.targetHandle]

    updateNodeData(node.id, {
      inputs: nodeInputs
    })
  }, [setEdges, updateNodeData, nodes, edges]);

  const isValidConnection = useCallback((connection: Edge | Connection) => {

    if (connection.source === connection.target) {
      return false;
    }

    const TaskRegistry = [...(actions || []), trigger]

    const source = nodes.find((n) => n.id === connection.source)
    const target = nodes.find((n) => n.id === connection.target)

    if (!source || !target) {
      return false;
    }

    const sourceTask = TaskRegistry.find((t) => t?.key === source.data.type)
    const targetTask = TaskRegistry.find((t) => t?.key === target.data.type)

    const output = sourceTask?.taskInfo.outputs?.find(o => o.name === connection.sourceHandle)
    const input = targetTask?.taskInfo.inputs?.find(i => i.name === connection.targetHandle)

    if (!input || !output || input.type !== output.type) {
      toast.error("Incompatible connection");
      return false;
    }

    if (edges.some(edge => edge.target === connection.target && edge.targetHandle === connection.targetHandle)) {
      return false;
    }

    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };

    if (target.id === connection.source) return false;

    return !hasCycle(target);
  }, [edges, nodes, actions, trigger]);

  return (
    <NodeDialogProvider>
      <main className="h-full w-full flex overflow-hidden relative">
        <NodeInspectorPanel allActions={actions} trigger={trigger} />
        <ReactFlow
          minZoom={0.3}
          maxZoom={2.0}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          className="bg-background"
          aria-label={`Flow editor for workflow: ${workflow?.name}`}
          role="application"
          nodeTypes={nodeTypes}
          edgeTypes={EdgeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          snapToGrid
          snapGrid={snapGrid}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={true}
          panOnDrag={true}
          zoomActivationKeyCode="Control"
        >
          <Controls position="top-left" className=" text-black border border-border shadow-lg rounded-lg" />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
          />
          <Panel position="top-right" className="rounded-md border bg-card px-2 py-1 text-xs font-semibold">
            Click a node to edit its parameters.
          </Panel>
        </ReactFlow>
      </main>
    </NodeDialogProvider>
  )
}
