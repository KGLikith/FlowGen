import { ActionKey, TriggerKey } from "@/gql/graphql";

export function CreateFlowNode(
  nodeType: ActionKey | TriggerKey,
  credits: number,
  position?: { x: number; y: number },
  type: "TRIGGER" | "ACTION" = "ACTION",
  taskId?: string,
  ...extraInputs: [key: string, value: any][]
) {
  return {
    id: crypto.randomUUID(),
    data: {
      type: nodeType,
      inputs: {},
      credits: credits,
      trigger: type === "TRIGGER",
      triggerId: type === "TRIGGER" ? taskId : undefined,
      actionId: type === "ACTION" ? taskId : undefined,
      ...extraInputs.reduce((acc: { [key: string]: any }, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}),
    },
    dragHandle: ".drag-handle",
    type: "Node",
    position: position || { x: 0, y: 0 },
  };
}
