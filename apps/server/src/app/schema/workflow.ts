import { ActionKey, TriggerKey } from "@automation/db";

export interface CreateWorkflowDataPayload {
  name: string;
  definition: string;
  description?: string;
  userId: string;
}

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type workflowExecutionPlan = WorkflowExecutionPlanPhase[];

export interface AppNodeData {
  type: ActionKey | TriggerKey;
  inputs: Record<string, string>;
  trigger: boolean;
  credits: number;
  triggerId?: string;
  actionId?: string;
  [key: string]: any;
}

export interface AppNode {
  data: AppNodeData;
}

export const ALG="aes-256-cbc"
