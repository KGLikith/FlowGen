// import { TaskParam, TaskParamType } from '@/schema/task'
import React, { useCallback } from 'react'
import Stringparam from './param/StringParam'
import { useReactFlow } from '@xyflow/react'
import { AppNode } from '@/schema/appNode'
import BrowserInstanceParam from './param/BrowserInstanceParam'
import { TaskParam, TaskParamType, WorkflowStatus } from '@/gql/graphql'
import { useWorkflow } from '@/components/context/WorkflowProvider'
import SelectorParam from './param/SelectorParam'
import WebhookParam from './param/WebhookParam'
import CredentialParam from './param/CredentialParam'
import useFlowValidation from '@/hooks/useFlowValidation'

type Props = {
    param: TaskParam
    nodeId: string
    disabled?: boolean
    hasErrors: boolean
    value: string
  onChange: (newValue: string) => void
}

export default function NodeParamField({hasErrors, param, nodeId, disabled, value, onChange }: Props) {
    const { updateNodeData, getNode } = useReactFlow();
    const { workflow } = useWorkflow();
    const node = getNode(nodeId) as AppNode;


    switch (param.type) {
        case TaskParamType.String:
            return <Stringparam error={hasErrors} param={param} value={value} updateNodeParamValue={onChange} disabled={disabled || workflow?.status === WorkflowStatus.Active} />
        case TaskParamType.BrowserInstance:
            return <BrowserInstanceParam error={hasErrors} param={param} value={value} updateNodeParamValue={onChange} />
        case TaskParamType.Select:
            return <SelectorParam error={hasErrors} param={param} value={value} updateNodeParamValue={onChange} disabled={disabled || workflow?.status === WorkflowStatus.Active} />
        case TaskParamType.WebhookParams:
            return <WebhookParam error={hasErrors} param={param} value={value} updateNodeParamValue={onChange} disabled={disabled || workflow?.status === WorkflowStatus.Active} />
        case TaskParamType.Credential:
            return <CredentialParam error={hasErrors} param={param} value={value} updateNodeParamValue={onChange} disabled={disabled || workflow?.status === WorkflowStatus.Active} />
        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">Not implemented</p>
                </div>
            )
    }
}