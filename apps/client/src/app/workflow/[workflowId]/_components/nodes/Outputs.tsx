import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ColorForHandle } from "./common";
import { TaskParam } from "@/gql/graphql";

type Props = {
    children: React.ReactNode;
};

export function NodeOutputs({ children }: Props) {
    return <div className="flex flex-col " >{children}</div>;
}

export function NodeOutput({
    output,
    // nodeId,
    disabled
}: {
    output: TaskParam;
    nodeId: string;
    disabled: boolean
}) {
    return (
        <div className="flex relative justify-end p-3 bg-secondary ">
            <span className="text-xs text-muted-foreground">{output.name}</span>
            <Handle
                id={output.name}
                type="source"
                isConnectable={!disabled}
                position={Position.Right}
                className={cn("!bg-muted-foreground !border-2 !border-background !-right-2 !w-3 !h-3",
                    ColorForHandle[output.type],
                )}
            />
        </div>
    );
}
