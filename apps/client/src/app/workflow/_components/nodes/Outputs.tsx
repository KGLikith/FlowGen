import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ColorForHandle } from "./common";
import { TaskParam } from "@/gql/graphql";

type Props = {
    children: React.ReactNode;
};

export default function NodeOutputs({ children }: Props) {
    return <div className="flex flex-col gap-1 divide-y">{children}</div>;
}

export function NodeOutput({
    output,
    // nodeId,
}: {
    output: TaskParam;
    nodeId: string;
}) {
    return (
        <div className="flex relative justify-end p-3 bg-secondary">
            <span className="text-xs text-muted-foreground">{output.name}</span>
            <Handle
                id={output.name}
                type="source"
                position={Position.Right}
                className={cn("!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
                    ColorForHandle[output.type],
                )}
            />
        </div>
    );
}
