
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
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
}

export const TaskRegistry={
    LAUNCH_BROWSER: TaskType.LAUNCH_BROWSER,
    PAGE_TO_HTML: TaskType.PAGE_TO_HTML,
    EXTRACT_TEXT_FROM_ELEMENT: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
}
