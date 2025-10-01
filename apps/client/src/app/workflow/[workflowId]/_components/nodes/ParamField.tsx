// import { TaskParam, TaskParamType } from '@/schema/task'
import React, { useCallback } from 'react'
import Stringparam from './param/StringParam'
import { useReactFlow } from '@xyflow/react'
import { AppNode } from '@/schema/appNode'
import BrowserInstanceParam from './param/BrowserInstanceParam'
import { TaskParam, TaskParamType } from '@/gql/graphql'
import { useWorkflow } from '@/components/context/WorkflowProvider'

type Props = {
    param: TaskParam
    nodeId: string
    disabled?: boolean
}

export default function NodeParamField({ param, nodeId, disabled }: Props) {
    const { updateNodeData, getNode } =  useReactFlow();
    const { workflow} = useWorkflow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[param.name] || ''

    const updateNodeParamvalue  = useCallback((newValue: string)=>{
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue
            }
        })
    },[nodeId, updateNodeData, param.name, node?.data.inputs])

    switch (param.type) {
        case TaskParamType.String:
            return <Stringparam param={param} value={value} updateNodeParamValue={updateNodeParamvalue} disabled={disabled} status={workflow?.status} />
        case TaskParamType.BrowserInstance:
            return <BrowserInstanceParam param={param} value={value} updateNodeParamValue={updateNodeParamvalue} />
        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">Not implemented</p>
                </div>
            )
    }
}