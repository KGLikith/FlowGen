import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./Card";
import NodeHeader from "./Header";
import { AppNodeData } from "@/schema/appNode";
import { NodeInput, NodeInputs } from "./Inputs";
import NodeOutputs, { NodeOutput } from "./Outputs";
import { useWorkflow } from "@/components/context/WorkflowProvider";

const NodeComponent = memo((props: NodeProps) => {
    const nodeData = props.data as AppNodeData;
    const { allActions, trigger } = useWorkflow();

    const task = [...(allActions || []), trigger].find(t => t?.key === nodeData.type)?.taskInfo;

    return <NodeCard nodeId={props.id} isSelected={!!props.selected} >
        <NodeHeader taskType={nodeData.type} nodeId={props.id} isTrigger={nodeData.trigger} />
        <NodeInputs>
            {task?.inputs?.map(input =>
                <NodeInput key={input.name} input={input} nodeId={props.id}  />
            )}
        </NodeInputs>
        <NodeOutputs>
            {task?.outputs?.map(output =>
                <NodeOutput key={output.name} output={output} nodeId={props.id} />
            )}
        </NodeOutputs>
    </NodeCard>
})


export default NodeComponent

NodeComponent.displayName = "NodeComponent"