import NodeComponent from "@/app/workflow/_components/nodes/Component"
import { User, Workflow } from "@/gql/graphql"
import { CreateFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/schema/task"
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react"

import "@xyflow/react/dist/style.css"

type Props = {
  workflow: Workflow
  currentUser: User
}

const nodeTypes = {
  Node: NodeComponent
}

const snapGrid: [number, number] = [20, 20]
const fitViewOptions = { padding: 1.5 };

export default function FlowEditor({ workflow, currentUser }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    CreateFlowNode(TaskType.LAUNCH_BROWSER),
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  return (
    <main className="h-full w-full ">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        className="bg-background"
        aria-label={`Flow editor for workflow: ${workflow.name}`}
        role="application"
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        snapToGrid
        snapGrid={snapGrid}

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
