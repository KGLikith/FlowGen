import DeletableEdge from "@/app/workflow/_components/edges/deletableEdge"
import NodeComponent from "@/app/workflow/_components/nodes/Component"
import { useTrigger } from "@/components/context/TaskProvider"
import { AvailableTrigger, User, Workflow } from "@/gql/graphql"
import { CreateFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { AppNode } from "@/schema/appNode"
import { TaskType } from "@/schema/task"
import { useQueryClient } from "@tanstack/react-query"
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, Node, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { use, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
  workflow: Workflow
  currentUser: User
}

const nodeTypes = {
  Node: NodeComponent
}

const EdgeTypes = {
  default: DeletableEdge
}

const snapGrid: [number, number] = [20, 20]
const fitViewOptions = { padding: 1.5 };

export default function FlowEditor({ workflow, currentUser }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow()
  const { setCurrentTriggerId } = useTrigger()
  const queryclient = useQueryClient();

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
    const type = event.dataTransfer.getData('application/reactflow/taskType');
    const taskId = event.dataTransfer.getData('application/reactflow/taskId'); // ........................................................
    const trigger = event.dataTransfer.getData('application/reactflow/trigger');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    if(trigger === "true") {
      setCurrentTriggerId(taskId)
    }
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const pos = screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left / 2,
      y: event.clientY - reactFlowBounds.top / 2,
    });
    const newNode = CreateFlowNode(type as TaskType, pos, trigger === "true" ? "TRIGGER" : "ACTION", taskId)
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

    const source = nodes.find((n) => n.id === connection.source)
    const target = nodes.find((n) => n.id === connection.target)

    if (!source || !target) {
      return false;
    }

    const sourceTask = TaskRegistry[source.data.type]
    const targetTask = TaskRegistry[target.data.type]

    const output = sourceTask.outputs?.find(o => o.name === connection.sourceHandle)
    const input = targetTask.inputs?.find(i => i.name === connection.targetHandle)

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
  }, [edges, nodes]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        className="bg-background"
        aria-label={`Flow editor for workflow: ${workflow.name}`}
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
      >
        <Controls position="top-left" className=" text-black border border-border shadow-lg rounded-lg" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
      </ReactFlow>
    </main>
  )
}
