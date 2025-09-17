import { User, Workflow } from "@/gql/graphql"
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react"

import "@xyflow/react/dist/style.css"

type Props = {
  workflow: Workflow
  currentUser: User
}

export default function FlowEditor({ workflow, currentUser }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
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
