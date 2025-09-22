import { TaskType } from "@/schema/task";

export function CreateFlowNode ( 
    nodeType: TaskType,
    position?: {x: number, y: number}
) {
    return {
        id: crypto.randomUUID(),
        data: {
            type: nodeType,
            inputs: {},
        }, 
        dragHandle: '.drag-handle',
        type: 'Node',
        position: position || { x: 0, y: 0 },
    };
}