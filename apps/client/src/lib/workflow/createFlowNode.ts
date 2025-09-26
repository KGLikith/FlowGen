import { ActionKey, TriggerKey } from "@/gql/graphql";

export function CreateFlowNode(
  nodeType: ActionKey | TriggerKey,
  position?: { x: number; y: number },
  type: "TRIGGER" | "ACTION" = "ACTION",
  taskId?: string
) {
  return {
    id: crypto.randomUUID(),
    data: {
      type: nodeType,
      inputs: {},
      trigger: type === "TRIGGER",
      triggerId: type === "TRIGGER" ? taskId : undefined,
      actionId: type === "ACTION" ? taskId : undefined,
    },
    dragHandle: ".drag-handle",
    type: "Node",
    position: position || { x: 0, y: 0 },
  };
}
