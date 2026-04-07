'use client'
import { useWorkflow } from '@/components/context/WorkflowProvider'
import { Button } from '@/components/ui/button'
import { TrashIcon, CopyIcon, GripVerticalIcon } from 'lucide-react'
import { WorkflowStatus } from '@/gql/graphql'
import { useReactFlow } from '@xyflow/react'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { AppNode } from '@/schema/appNode'
import { getTaskIcon } from './icons'
import { useNodeDialog } from '@/components/context/nodeDialogContext'

export default function NodeHeader({ taskType, nodeId, isTrigger }: any) {
  const { allActions, trigger, setCurrentTriggerId, workflow } = useWorkflow()
  const { deleteElements, getNode, addNodes, setNodes } = useReactFlow()
  const task = [...(allActions || []), trigger].find((t) => t?.key === taskType)
  const { setCurrentNodeId, currentNodeId } = useNodeDialog();

  if (!task) return null

  return (
    <div className="flex justify-between items-center w-full px-2 py-3">
      <div className="flex items-center gap-3">
        {getTaskIcon(task.key)}
        <span className="font-semibold text-lg text-muted-foreground">
          {task.taskInfo.label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {workflow?.status === WorkflowStatus.Draft && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                deleteElements({ nodes: [{ id: nodeId }] })
                setNodes((nds) => nds.filter((n) => n.id !== nodeId))
                if(currentNodeId === nodeId) setCurrentNodeId(undefined)
                if (isTrigger) setCurrentTriggerId(undefined)
              }}
              className="text-destructive"
            >
              <TrashIcon size={12} />
            </Button>
            {!isTrigger && <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                const node = getNode(nodeId) as AppNode
                const newNode = CreateFlowNode(
                  node.data.type,
                  node.data.credits,
                  { x: node.position.x + 120, y: node.position.y + 80 },
                  node.data.trigger ? 'TRIGGER' : 'ACTION',
                  node.data.actionId,
                  node.data.event,
                  node.data.connection
                )
                addNodes([newNode])
              }}
            >
              <CopyIcon size={12} />
            </Button>}
            <Button variant={"ghost"} size="icon" className='drag-handle cursor-grab'>
              <GripVerticalIcon size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
