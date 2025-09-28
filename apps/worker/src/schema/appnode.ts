import { ActionKey, TriggerKey } from "@automation/db";

export interface AppNodeData {
  trigger: boolean;
  triggerId?: string;
  actionId?: string;
  credits: number;
  type: TriggerKey | ActionKey;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode {
  id: string;
  data: AppNodeData;
}
