import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import NodeCard from "./Card";
import NodeHeader from "./Header";
import { AppNodeData } from "@/schema/appNode";
import { NodeInput, NodeInputs } from "./Inputs";
import { NodeOutputs, NodeOutput } from "./Outputs";
import { useWorkflow } from "@/components/context/WorkflowProvider";
import { WorkflowStatus } from "@/gql/graphql";

const NodeComponent = memo((props: NodeProps) => {
    const nodeData = props.data as AppNodeData;
    const { allActions, trigger, workflow } = useWorkflow();

    const task = [...(allActions || []), trigger].find(t => t?.key === nodeData.type)?.taskInfo;

    return (
        <>
            <NodeCard nodeId={props.id} isSelected={!!props.selected} >
                <NodeHeader taskType={nodeData.type} nodeId={props.id} isTrigger={nodeData.trigger} />
                <div className=" flex flex-col">
                    <NodeInputs>
                        {task?.inputs?.map(input =>
                            <NodeInput key={input.name} input={input} nodeId={props.id} disabled={workflow?.status == WorkflowStatus.Active} />
                        )}
                    </NodeInputs>
                    <NodeOutputs>
                        {task?.outputs?.map(output =>
                            <NodeOutput key={output.name} output={output} nodeId={props.id} disabled={workflow?.status == WorkflowStatus.Active} />
                        )}
                    </NodeOutputs>
                </div>
            </NodeCard>
        </>
    )
})


export default NodeComponent

NodeComponent.displayName = "NodeComponent"