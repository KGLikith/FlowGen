import { ActionKey, TriggerKey } from "@/gql/graphql";
import { Node } from "@xyflow/react";
// import { TaskType } from "./task";

export interface AppNodeData {
    trigger: boolean;
    triggerId?: string;
    actionId?: string;
    type: TriggerKey | ActionKey;
    inputs: Record<string, string>;
    [key: string]: any;
}

export interface AppNode extends Node {
    data: AppNodeData;
}

export type AppNodeMissingInputs = {     
    nodeId: string;
    inputs: string[];
}